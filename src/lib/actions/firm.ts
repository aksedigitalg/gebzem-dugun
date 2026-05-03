"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireFirmOwnership, requireRole } from "@/lib/auth-guards";
import { audit } from "@/lib/audit";
import { sanitizeRichText, sanitizeText } from "@/lib/sanitize";
import { uploadFile, deleteFile, BUCKETS } from "@/lib/supabase/storage";
import { slugify } from "@/lib/utils";

// ==============================================================================
// FİRMA TEMEL BİLGİLERİ
// ==============================================================================

const profileSchema = z.object({
  firmId: z.string(),
  name: z.string().min(2).max(120),
  shortDescription: z.string().min(20).max(280),
  description: z.string().min(40).max(8000),
  phone: z.string().min(7).max(30),
  whatsapp: z.string().max(30).optional().or(z.literal("")),
  email: z.string().email(),
  website: z.string().url().optional().or(z.literal("")),
  instagram: z.string().max(120).optional().or(z.literal("")),
  facebook: z.string().max(120).optional().or(z.literal("")),
  tiktok: z.string().max(120).optional().or(z.literal("")),
  youtube: z.string().max(120).optional().or(z.literal("")),
  address: z.string().min(5).max(280),
  district: z.string().min(2),
  neighborhood: z.string().max(80).optional().or(z.literal("")),
});

export type FirmActionState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };

export async function updateFirmProfileAction(
  _prev: FirmActionState,
  formData: FormData,
): Promise<FirmActionState> {
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) {
      const f = String(i.path[0] ?? "");
      if (f && !fieldErrors[f]) fieldErrors[f] = i.message;
    }
    return { ok: false, error: "Form alanlarını kontrol et.", fieldErrors };
  }

  const { session, firm } = await requireFirmOwnership(parsed.data.firmId);

  const before = { name: firm.name, district: firm.district };

  await db.firm.update({
    where: { id: firm.id },
    data: {
      name: parsed.data.name,
      shortDescription: sanitizeText(parsed.data.shortDescription, 280),
      description: sanitizeRichText(parsed.data.description),
      phone: parsed.data.phone,
      whatsapp: parsed.data.whatsapp || null,
      email: parsed.data.email,
      website: parsed.data.website || null,
      instagram: parsed.data.instagram || null,
      facebook: parsed.data.facebook || null,
      tiktok: parsed.data.tiktok || null,
      youtube: parsed.data.youtube || null,
      address: parsed.data.address,
      district: parsed.data.district,
      neighborhood: parsed.data.neighborhood || null,
    },
  });

  await audit({
    userId: session.user.id,
    actorRole: session.user.role,
    action: "FIRM_UPDATE",
    resource: "Firm",
    resourceId: firm.id,
    before,
    after: { name: parsed.data.name, district: parsed.data.district },
  });

  revalidatePath(`/firma/${firm.slug}`);
  revalidatePath("/firma-paneli/profilim");

  return { ok: true };
}

// ==============================================================================
// GALERİ
// ==============================================================================

export async function uploadGalleryItemAction(formData: FormData): Promise<FirmActionState> {
  const firmId = String(formData.get("firmId") ?? "");
  const file = formData.get("file");
  const caption = String(formData.get("caption") ?? "").slice(0, 200);
  const altText = String(formData.get("altText") ?? "").slice(0, 200);

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Dosya seçilmedi." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { ok: false, error: "Dosya en fazla 8 MB olabilir." };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "Sadece resim dosyası yükleyebilirsin." };
  }

  const { session, firm } = await requireFirmOwnership(firmId);

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${firm.slug}/gallery/${Date.now()}-${slugify(file.name.split(".")[0] ?? "img")}.${ext}`;

  const buffer = await file.arrayBuffer();
  const { publicUrl } = await uploadFile({
    bucket: BUCKETS.FIRM_MEDIA,
    path,
    file: buffer,
    contentType: file.type,
    upsert: false,
  });

  const last = await db.galleryItem.findFirst({
    where: { firmId: firm.id },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  await db.galleryItem.create({
    data: {
      firmId: firm.id,
      url: publicUrl,
      caption: caption || null,
      altText: altText || firm.name,
      order: (last?.order ?? -1) + 1,
    },
  });

  await audit({
    userId: session.user.id,
    actorRole: session.user.role,
    action: "GALLERY_UPLOAD",
    resource: "GalleryItem",
    resourceId: firm.id,
    meta: { path, contentType: file.type, size: file.size },
  });

  revalidatePath(`/firma/${firm.slug}`);
  revalidatePath("/firma-paneli/galeri");
  return { ok: true };
}

export async function deleteGalleryItemAction(itemId: string): Promise<FirmActionState> {
  const item = await db.galleryItem.findUnique({
    where: { id: itemId },
    select: { id: true, firmId: true, url: true },
  });
  if (!item) return { ok: false, error: "Öğe bulunamadı." };

  const { session, firm } = await requireFirmOwnership(item.firmId);

  // URL'den path türetme: .../firm-media/{slug}/gallery/{filename}
  const idx = item.url.indexOf(`${BUCKETS.FIRM_MEDIA}/`);
  const path = idx >= 0 ? item.url.slice(idx + BUCKETS.FIRM_MEDIA.length + 1) : null;
  if (path) await deleteFile(BUCKETS.FIRM_MEDIA, path).catch(() => null);

  await db.galleryItem.delete({ where: { id: item.id } });

  await audit({
    userId: session.user.id,
    actorRole: session.user.role,
    action: "GALLERY_DELETE",
    resource: "GalleryItem",
    resourceId: item.id,
    meta: { firmId: firm.id, path },
  });

  revalidatePath(`/firma/${firm.slug}`);
  revalidatePath("/firma-paneli/galeri");
  return { ok: true };
}

// ==============================================================================
// HİZMET / PAKET
// ==============================================================================

const serviceSchema = z.object({
  firmId: z.string(),
  id: z.string().optional(),
  name: z.string().min(2).max(120),
  description: z.string().min(5).max(2000),
  priceMin: z.coerce.number().int().min(0).optional(),
  priceMax: z.coerce.number().int().min(0).optional(),
  unit: z.string().max(40).optional().or(z.literal("")),
  duration: z.string().max(40).optional().or(z.literal("")),
});

export async function upsertServiceAction(_prev: FirmActionState, formData: FormData): Promise<FirmActionState> {
  const parsed = serviceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Form hatalı." };

  const { session, firm } = await requireFirmOwnership(parsed.data.firmId);

  if (parsed.data.id) {
    await db.service.update({
      where: { id: parsed.data.id, firmId: firm.id },
      data: {
        name: parsed.data.name,
        description: sanitizeText(parsed.data.description, 2000),
        priceMin: parsed.data.priceMin ?? null,
        priceMax: parsed.data.priceMax ?? null,
        unit: parsed.data.unit || null,
        duration: parsed.data.duration || null,
      },
    });
  } else {
    await db.service.create({
      data: {
        firmId: firm.id,
        name: parsed.data.name,
        description: sanitizeText(parsed.data.description, 2000),
        priceMin: parsed.data.priceMin ?? null,
        priceMax: parsed.data.priceMax ?? null,
        unit: parsed.data.unit || null,
        duration: parsed.data.duration || null,
      },
    });
  }

  await audit({
    userId: session.user.id,
    actorRole: session.user.role,
    action: parsed.data.id ? "SERVICE_UPDATE" : "SERVICE_CREATE",
    resource: "Service",
    resourceId: parsed.data.id ?? null,
    meta: { firmId: firm.id },
  });

  revalidatePath(`/firma/${firm.slug}`);
  revalidatePath("/firma-paneli/hizmetlerim");
  return { ok: true };
}

export async function deleteServiceAction(id: string, firmId: string): Promise<FirmActionState> {
  const { session, firm } = await requireFirmOwnership(firmId);
  await db.service.delete({ where: { id, firmId: firm.id } });

  await audit({
    userId: session.user.id,
    actorRole: session.user.role,
    action: "SERVICE_DELETE",
    resource: "Service",
    resourceId: id,
    meta: { firmId: firm.id },
  });

  revalidatePath(`/firma/${firm.slug}`);
  revalidatePath("/firma-paneli/hizmetlerim");
  return { ok: true };
}

// ==============================================================================
// ADMIN — firma onay/red/askıya alma
// ==============================================================================

const moderationSchema = z.object({
  firmId: z.string(),
  action: z.enum(["APPROVE", "REJECT", "SUSPEND", "ACTIVATE", "FEATURE", "UNFEATURE", "VERIFY", "UNVERIFY"]),
  notes: z.string().max(1000).optional(),
});

export async function moderateFirmAction(
  _prev: FirmActionState,
  formData: FormData,
): Promise<FirmActionState> {
  const session = await requireRole("ADMIN", "SUPER_ADMIN");
  const parsed = moderationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Form hatalı." };

  const firm = await db.firm.findUnique({ where: { id: parsed.data.firmId } });
  if (!firm) return { ok: false, error: "Firma bulunamadı." };

  const before = { status: firm.status, isVerified: firm.isVerified, isFeatured: firm.isFeatured };
  const data: Parameters<typeof db.firm.update>[0]["data"] = {};

  switch (parsed.data.action) {
    case "APPROVE": data.status = "ACTIVE"; break;
    case "REJECT": data.status = "REJECTED"; break;
    case "SUSPEND": data.status = "SUSPENDED"; break;
    case "ACTIVATE": data.status = "ACTIVE"; break;
    case "FEATURE": data.isFeatured = true; break;
    case "UNFEATURE": data.isFeatured = false; break;
    case "VERIFY": data.isVerified = true; break;
    case "UNVERIFY": data.isVerified = false; break;
  }

  await db.firm.update({ where: { id: firm.id }, data });

  // Bildirim — firma sahibine
  if (parsed.data.action === "APPROVE" || parsed.data.action === "REJECT") {
    await db.notification.create({
      data: {
        userId: firm.ownerId,
        kind: parsed.data.action === "APPROVE" ? "FIRM_APPROVED" : "FIRM_REJECTED",
        title: parsed.data.action === "APPROVE" ? "Firmanız onaylandı 🎉" : "Firma başvurunuz reddedildi",
        body: parsed.data.notes ?? "",
        link: `/firma-paneli`,
      },
    });
  }

  await audit({
    userId: session.user.id,
    actorRole: session.user.role,
    action: `FIRM_${parsed.data.action}`,
    resource: "Firm",
    resourceId: firm.id,
    before,
    after: data as never,
    meta: { notes: parsed.data.notes },
  });

  revalidatePath("/admin/firmalar");
  revalidatePath(`/admin/firmalar/${firm.id}`);
  revalidatePath(`/firma/${firm.slug}`);
  return { ok: true };
}
