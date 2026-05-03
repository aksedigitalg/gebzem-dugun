"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupAction } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Hesap oluşturuluyor…" : "Üye Ol"}
    </Button>
  );
}

export default function SignupPage() {
  const [state, formAction] = useActionState(signupAction, {});
  const [role, setRole] = React.useState<"COUPLE" | "FIRM_OWNER">("COUPLE");

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Hesap oluştur</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Saniyeler içinde kaydol; tüm araçlara ücretsiz erişim sağla.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
        <button
          type="button"
          onClick={() => setRole("COUPLE")}
          className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${role === "COUPLE" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
        >
          Çift / Misafir
        </button>
        <button
          type="button"
          onClick={() => setRole("FIRM_OWNER")}
          className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${role === "FIRM_OWNER" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
        >
          Firma Sahibi
        </button>
      </div>

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="role" value={role} />

        <div className="space-y-1.5">
          <Label htmlFor="name">{role === "FIRM_OWNER" ? "Yetkili Ad Soyad" : "Ad Soyad"}</Label>
          <Input id="name" name="name" required autoComplete="name" placeholder="Adınız ve soyadınız" />
          {state?.fieldErrors?.name && <p className="text-xs text-red-600">{state.fieldErrors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">E-posta</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" placeholder="ornek@eposta.com" />
          {state?.fieldErrors?.email && <p className="text-xs text-red-600">{state.fieldErrors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Telefon (opsiyonel)</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="0 5__ ___ __ __" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Şifre</Label>
          <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="En az 8 karakter" />
          {state?.fieldErrors?.password && <p className="text-xs text-red-600">{state.fieldErrors.password}</p>}
        </div>

        {state?.error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">{state.error}</p>
        )}

        <p className="text-xs text-muted-foreground">
          Üye olarak{" "}
          <Link href="/kullanim-sartlari" className="text-primary hover:underline">Kullanım Şartları</Link>{" "}
          ve{" "}
          <Link href="/gizlilik" className="text-primary hover:underline">Gizlilik Politikası</Link>'nı
          kabul etmiş sayılırsın.
        </p>

        <SubmitButton />
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Zaten hesabın var mı?{" "}
        <Link href="/giris" className="font-medium text-primary hover:underline">
          Giriş Yap
        </Link>
      </p>
    </div>
  );
}
