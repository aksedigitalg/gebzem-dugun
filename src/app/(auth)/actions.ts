"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { signIn } from "@/auth";

// ==============================================================================
// Yardımcı: rol için varsayılan dashboard yolu
// ==============================================================================
function dashboardForRole(role: string): string {
  if (role === "FIRM_OWNER" || role === "FIRM_STAFF") return "/firma-paneli";
  if (role === "ADMIN" || role === "SUPER_ADMIN") return "/admin/panel";
  return "/hesabim";
}

// ==============================================================================
// LOGIN — rol kısıtlı (couple/firm/admin sayfalarına özel)
// ==============================================================================

const signinSchema = z.object({
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta gir."),
  password: z.string().min(1, "Şifre boş olamaz."),
});

export type SigninState = {
  error?: string;
};

/** Çift girişi (/cift) */
export async function signinCoupleAction(
  _prev: SigninState,
  formData: FormData,
): Promise<SigninState> {
  return signinByRole(formData, ["COUPLE"], "/hesabim");
}

/** İşletme girişi (/isletme) */
export async function signinFirmAction(
  _prev: SigninState,
  formData: FormData,
): Promise<SigninState> {
  return signinByRole(
    formData,
    ["FIRM_OWNER", "FIRM_STAFF"],
    "/firma-paneli",
  );
}

/** Admin girişi (/admin) */
export async function signinAdminAction(
  _prev: SigninState,
  formData: FormData,
): Promise<SigninState> {
  return signinByRole(
    formData,
    ["ADMIN", "SUPER_ADMIN"],
    "/admin/panel",
  );
}

async function signinByRole(
  formData: FormData,
  allowedRoles: string[],
  redirectTo: string,
): Promise<SigninState> {
  const parsed = signinSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Form hatalı." };
  }

  // Rol kontrolü: kullanıcı bu kapıdan girmeye yetkili mi?
  const user = await db.user.findUnique({
    where: { email: parsed.data.email },
    select: { role: true, status: true, passwordHash: true },
  });
  if (!user || !user.passwordHash) {
    return { error: "E-posta veya şifre hatalı." };
  }
  if (user.status === "BANNED" || user.status === "SUSPENDED") {
    return { error: "Hesabınız askıya alınmış. Destek ekibiyle iletişime geçin." };
  }
  if (!allowedRoles.includes(user.role)) {
    return { error: "Bu giriş ekranı seçtiğiniz hesap türü için uygun değil." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "E-posta veya şifre hatalı." };
    }
    // signIn başarılı olursa NEXT_REDIRECT fırlatır — re-throw et, Next handle eder.
    throw error;
  }

  return {};
}

// ==============================================================================
// SIGNUP — rol bazlı, ayrı server actions
// ==============================================================================

const baseSignupSchema = z.object({
  name: z.string().trim().min(2, "Ad-soyad en az 2 karakter olmalı."),
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta gir."),
  password: z.string().min(8, "Şifre en az 8 karakter olmalı."),
  phone: z.string().trim().optional().or(z.literal("")),
});

const coupleSignupSchema = baseSignupSchema.extend({
  partnerName: z.string().trim().optional().or(z.literal("")),
  weddingDate: z.string().optional().or(z.literal("")),
});

const firmSignupSchema = baseSignupSchema.extend({
  firmName: z.string().trim().min(2, "Firma adı en az 2 karakter olmalı."),
  district: z.string().min(1, "İlçe seçiniz."),
});

export type SignupState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

/** Çift kaydı */
export async function signupCoupleAction(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    partnerName: String(formData.get("partnerName") ?? ""),
    weddingDate: String(formData.get("weddingDate") ?? ""),
  };

  const parsed = coupleSignupSchema.safeParse(raw);
  if (!parsed.success) {
    return formStateFromZod(parsed.error.issues);
  }

  const exists = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return { error: "Bu e-posta zaten kayıtlı. Giriş yapmayı deneyin." };

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const weddingDate = parsed.data.weddingDate ? new Date(parsed.data.weddingDate) : null;

  await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      passwordHash,
      role: "COUPLE",
      status: "ACTIVE",
      partnerName: parsed.data.partnerName || null,
      weddingDate,
    },
  });

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/hesabim",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: true, error: "Hesap oluşturuldu fakat oturum açılamadı. Giriş sayfasından dene." };
    }
    throw error;
  }

  return { ok: true };
}

/** İşletme (firma sahibi) kaydı */
export async function signupFirmAction(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    firmName: String(formData.get("firmName") ?? ""),
    district: String(formData.get("district") ?? ""),
  };

  const parsed = firmSignupSchema.safeParse(raw);
  if (!parsed.success) {
    return formStateFromZod(parsed.error.issues);
  }

  const exists = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return { error: "Bu e-posta zaten kayıtlı. Giriş yapmayı deneyin." };

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      passwordHash,
      role: "FIRM_OWNER",
      status: "ACTIVE",
      city: "Kocaeli",
      district: parsed.data.district,
    },
  });

  // Firma profil'i için onboarding bayrağı: ilk firma-paneli ziyaretinde
  // wizard otomatik açılır. Şimdilik kullanıcıyı oturuma alıp paneline yönlendir.
  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/firma-paneli",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: true, error: "Hesap oluşturuldu fakat oturum açılamadı. Giriş sayfasından dene." };
    }
    throw error;
  }

  return { ok: true };
}

// ==============================================================================
// LOGOUT (server action)
// ==============================================================================
export async function signOutAction() {
  const { signOut } = await import("@/auth");
  await signOut({ redirectTo: "/" });
}

// ==============================================================================
// Yardımcı: zod issues → form state
// ==============================================================================
function formStateFromZod(issues: z.ZodIssue[]): SignupState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const f = String(issue.path[0] ?? "");
    if (f && !fieldErrors[f]) fieldErrors[f] = issue.message;
  }
  return { error: "Lütfen form alanlarını kontrol edin.", fieldErrors };
}

export { dashboardForRole };
