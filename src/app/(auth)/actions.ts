"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const signupSchema = z
  .object({
    name: z.string().min(2, "Ad-soyad en az 2 karakter olmalı"),
    email: z.string().email("Geçerli bir e-posta gir"),
    password: z.string().min(8, "Şifre en az 8 karakter"),
    role: z.enum(["COUPLE", "FIRM_OWNER"]).default("COUPLE"),
    phone: z.string().min(10).optional().or(z.literal("")),
  });

export type SignupState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "password" | "phone", string>>;
};

export async function signupAction(_prev: SignupState, formData: FormData): Promise<SignupState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    role: String(formData.get("role") ?? "COUPLE") as "COUPLE" | "FIRM_OWNER",
    phone: String(formData.get("phone") ?? ""),
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: SignupState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const f = issue.path[0] as keyof NonNullable<SignupState["fieldErrors"]>;
      if (f) fieldErrors[f] = issue.message;
    }
    return { ok: false, error: "Form bilgilerini kontrol et.", fieldErrors };
  }

  const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { ok: false, error: "Bu e-posta zaten kayıtlı." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone || null,
      passwordHash,
      role: parsed.data.role,
      status: "ACTIVE",
    },
  });

  // Otomatik giriş
  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (err) {
    if (!(err instanceof AuthError)) throw err;
  }

  redirect(parsed.data.role === "FIRM_OWNER" ? "/firma-paneli" : "/hesabim");
}

const signinSchema = z.object({
  email: z.string().email("Geçerli e-posta"),
  password: z.string().min(1, "Şifre gerekli"),
});

export type SigninState = { error?: string };

export async function signinAction(_prev: SigninState, formData: FormData): Promise<SigninState> {
  const parsed = signinSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    return { error: "E-posta ve şifre gerekli." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/hesabim",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "E-posta veya şifre hatalı." };
    }
    throw err;
  }
  return {};
}
