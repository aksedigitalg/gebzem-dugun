"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { audit } from "@/lib/audit";
import { sanitizeText } from "@/lib/sanitize";

const detailsSchema = z.object({
  weddingDate: z.string().optional().or(z.literal("")),
  partnerName: z.string().max(120).optional().or(z.literal("")),
  guestCount: z.coerce.number().int().min(0).max(5000).optional(),
  budget: z.coerce.number().int().min(0).optional(),
  city: z.string().max(80).optional().or(z.literal("")),
  district: z.string().max(80).optional().or(z.literal("")),
  about: z.string().max(2000).optional().or(z.literal("")),
});

export async function updateWeddingDetailsAction(_prev: { ok?: boolean; error?: string }, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Giriş gerekli." };

  const parsed = detailsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Form alanlarını kontrol et." };

  await db.user.update({
    where: { id: session.user.id },
    data: {
      weddingDate: parsed.data.weddingDate ? new Date(parsed.data.weddingDate) : null,
      partnerName: parsed.data.partnerName || null,
      guestCount: parsed.data.guestCount ?? null,
      budget: parsed.data.budget ?? null,
      city: parsed.data.city || null,
      district: parsed.data.district || null,
      about: parsed.data.about ? sanitizeText(parsed.data.about, 2000) : null,
    },
  });

  await audit({
    userId: session.user.id,
    actorRole: session.user.role,
    action: "COUPLE_DETAILS_UPDATE",
    resource: "User",
    resourceId: session.user.id,
  });

  revalidatePath("/hesabim/dugun-detaylari");
  revalidatePath("/hesabim");
  return { ok: true };
}

const profileSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().max(30).optional().or(z.literal("")),
});

export async function updateProfileAction(_prev: { ok?: boolean; error?: string }, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Giriş gerekli." };

  const parsed = profileSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
  });
  if (!parsed.success) return { ok: false, error: "Form hatalı." };

  await db.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
    },
  });

  revalidatePath("/hesabim/ayarlar");
  return { ok: true };
}

const passwordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export async function changePasswordAction(_prev: { ok?: boolean; error?: string }, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Giriş gerekli." };

  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Şifre en az 8 karakter olmalı." };

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.passwordHash) return { ok: false, error: "Hesap bulunamadı." };

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) return { ok: false, error: "Mevcut şifre yanlış." };

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await db.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  await audit({
    userId: session.user.id,
    actorRole: session.user.role,
    action: "PASSWORD_CHANGE",
    resource: "User",
    resourceId: session.user.id,
  });

  return { ok: true };
}
