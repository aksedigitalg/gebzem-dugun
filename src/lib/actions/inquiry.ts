"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { audit } from "@/lib/audit";
import { notify } from "@/lib/notify";
import { sanitizeText } from "@/lib/sanitize";
import { ipFromHeaders, memoryRateLimit, LIMITS } from "@/lib/rate-limit";
import { headers } from "next/headers";

const inquirySchema = z.object({
  firmId: z.string().min(1),
  weddingDate: z.string().optional().or(z.literal("")),
  guestCount: z.coerce.number().int().min(1).max(5000).optional(),
  budget: z.coerce.number().int().min(0).optional(),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalı.").max(2000),
  contactPhone: z.string().min(7, "Geçerli bir telefon numarası gir."),
  contactEmail: z.string().trim().toLowerCase().email("Geçerli bir e-posta gir."),
  preferredContact: z.enum(["email", "phone", "whatsapp"]).default("email"),
});

export type InquiryState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

/** Çift, firma sayfasından teklif gönderir. Anonim kullanıcı için de çalışır. */
export async function createInquiryAction(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  try {
    // Rate limit
    const h = await headers();
    const ip = ipFromHeaders(h);
    const rl = memoryRateLimit(`inquiry:${ip}`, LIMITS.inquiry.max, LIMITS.inquiry.windowMs);
    if (!rl.ok) {
      return { ok: false, error: "Çok fazla teklif gönderildi. Lütfen biraz sonra tekrar dene." };
    }

    const parsed = inquirySchema.safeParse({
      firmId: String(formData.get("firmId") ?? ""),
      weddingDate: String(formData.get("weddingDate") ?? ""),
      guestCount: formData.get("guestCount") ? Number(formData.get("guestCount")) : undefined,
      budget: formData.get("budget") ? Number(formData.get("budget")) : undefined,
      message: String(formData.get("message") ?? ""),
      contactPhone: String(formData.get("contactPhone") ?? ""),
      contactEmail: String(formData.get("contactEmail") ?? ""),
      preferredContact: String(formData.get("preferredContact") ?? "email"),
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const f = String(issue.path[0] ?? "");
        if (f && !fieldErrors[f]) fieldErrors[f] = issue.message;
      }
      return { ok: false, error: "Form alanlarını kontrol et.", fieldErrors };
    }

    const session = await auth();

    // Firma kontrolü
    const firm = await db.firm.findFirst({
      where: { id: parsed.data.firmId, status: "ACTIVE" },
      select: { id: true, slug: true, ownerId: true, name: true },
    });
    if (!firm) return { ok: false, error: "Firma bulunamadı veya yayında değil." };

    // Oturumlu kullanıcı varsa onu kullan; ama JWT'de id olup DB'de kullanıcı
    // silinmişse FK violation'a takılırız. Önce var olduğunu doğrula.
    let userId: string | undefined;
    if (session?.user?.id) {
      const existing = await db.user.findUnique({
        where: { id: session.user.id },
        select: { id: true },
      });
      if (existing) userId = existing.id;
    }

    // Kullanıcı yoksa (anonim ya da silinmiş hesap) e-posta üzerinden lazy-create.
    if (!userId) {
      const guestEmail = parsed.data.contactEmail;
      const existing = await db.user.findUnique({ where: { email: guestEmail } });
      if (existing) {
        userId = existing.id;
      } else {
        const guest = await db.user.create({
          data: {
            email: guestEmail,
            name: parsed.data.contactEmail.split("@")[0],
            role: "COUPLE",
            status: "PENDING",
            phone: parsed.data.contactPhone || null,
          },
        });
        userId = guest.id;
      }
    }

    const weddingDate = parsed.data.weddingDate ? new Date(parsed.data.weddingDate) : null;

    const inquiry = await db.inquiry.create({
      data: {
        userId,
        firmId: firm.id,
        weddingDate,
        guestCount: parsed.data.guestCount ?? null,
        budget: parsed.data.budget ?? null,
        message: sanitizeText(parsed.data.message, 2000),
        contactPhone: parsed.data.contactPhone,
        contactEmail: parsed.data.contactEmail,
        preferredContact: parsed.data.preferredContact,
        status: "NEW",
      },
    });

    // Stat — kritik değil, hata olursa atla.
    try {
      await db.firm.update({
        where: { id: firm.id },
        data: { inquiryCount: { increment: 1 } },
      });
    } catch (e) {
      console.error("[inquiry] firm count update failed:", e);
    }

    // Bildirim → firma sahibi (kritik değil, hata olursa atla)
    if (firm.ownerId) {
      try {
        await notify({
          userId: firm.ownerId,
          kind: "INQUIRY_NEW",
          title: "Yeni teklif isteği",
          body: `${parsed.data.contactEmail} sizden teklif istedi.`,
          link: `/firma-paneli/teklifler/${inquiry.id}`,
        });
      } catch (e) {
        console.error("[inquiry] notify failed:", e);
      }
    }

    await audit({
      userId,
      actorRole: session?.user?.role ?? "GUEST",
      action: "INQUIRY_CREATE",
      resource: "Inquiry",
      resourceId: inquiry.id,
      meta: { firmId: firm.id, firmSlug: firm.slug },
    });

    revalidatePath(`/firma/${firm.slug}`);
    revalidatePath(`/firma-paneli/teklifler`);
    revalidatePath(`/hesabim/tekliflerim`);

    return { ok: true };
  } catch (error) {
    console.error("[createInquiryAction] failed:", error);
    return {
      ok: false,
      error: "Teklif gönderilemedi. Lütfen biraz sonra tekrar dene.",
    };
  }
}

const inquiryReplySchema = z.object({
  inquiryId: z.string(),
  response: z.string().min(5).max(4000),
  status: z.enum(["RESPONDED", "REJECTED"]).default("RESPONDED"),
});

/** Firma sahibi teklife yanıt verir. */
export async function respondInquiryAction(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Oturum yok." };

  const parsed = inquiryReplySchema.safeParse({
    inquiryId: String(formData.get("inquiryId") ?? ""),
    response: String(formData.get("response") ?? ""),
    status: String(formData.get("status") ?? "RESPONDED"),
  });
  if (!parsed.success) return { ok: false, error: "Yanıt formu hatalı." };

  // Sahiplik kontrolü
  const inquiry = await db.inquiry.findFirst({
    where: {
      id: parsed.data.inquiryId,
      firm: {
        OR: [
          { ownerId: session.user.id },
          { staff: { some: { userId: session.user.id } } },
        ],
      },
    },
    include: { firm: { select: { id: true, slug: true, name: true } } },
  });
  if (!inquiry) return { ok: false, error: "Teklif bulunamadı veya erişim yok." };

  await db.inquiry.update({
    where: { id: inquiry.id },
    data: {
      firmResponse: sanitizeText(parsed.data.response, 4000),
      responseAt: new Date(),
      status: parsed.data.status,
    },
  });

  await notify({
    userId: inquiry.userId,
    kind: "INQUIRY_RESPONDED",
    title: `${inquiry.firm.name} sana yanıt verdi`,
    body: parsed.data.response.slice(0, 140),
    link: `/hesabim/tekliflerim`,
  });

  await audit({
    userId: session.user.id,
    actorRole: session.user.role,
    action: "INQUIRY_RESPOND",
    resource: "Inquiry",
    resourceId: inquiry.id,
    meta: { firmId: inquiry.firm.id, status: parsed.data.status },
  });

  revalidatePath("/firma-paneli/teklifler");
  revalidatePath(`/firma-paneli/teklifler/${inquiry.id}`);
  revalidatePath("/hesabim/tekliflerim");
  return { ok: true };
}
