"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupCoupleAction } from "../../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Hesap oluşturuluyor…" : "Üye Ol"}
    </Button>
  );
}

export function CoupleSignupForm() {
  const [state, formAction] = useActionState(signupCoupleAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Ad Soyad</Label>
        <Input id="name" name="name" required autoComplete="name" placeholder="Adınız ve soyadınız" />
        {state?.fieldErrors?.name && <FieldError msg={state.fieldErrors.name} />}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="partnerName">Eşinizin Adı (opsiyonel)</Label>
          <Input id="partnerName" name="partnerName" autoComplete="off" placeholder="Eşinizin adı" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="weddingDate">Düğün Tarihi (opsiyonel)</Label>
          <Input id="weddingDate" name="weddingDate" type="date" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">E-posta</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="ornek@eposta.com"
        />
        {state?.fieldErrors?.email && <FieldError msg={state.fieldErrors.email} />}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Telefon (opsiyonel)</Label>
        <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="0 5__ ___ __ __" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Şifre</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="En az 8 karakter"
        />
        {state?.fieldErrors?.password && <FieldError msg={state.fieldErrors.password} />}
      </div>

      {state?.error && !state.ok && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {state.error}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Üye olarak{" "}
        <Link href="/kullanim-sartlari" className="text-primary hover:underline">
          Kullanım Şartları
        </Link>{" "}
        ve{" "}
        <Link href="/gizlilik" className="text-primary hover:underline">
          Gizlilik Politikası
        </Link>
        'nı kabul etmiş sayılırsın.
      </p>

      <SubmitButton />
    </form>
  );
}

function FieldError({ msg }: { msg: string }) {
  return <p className="text-xs text-red-600">{msg}</p>;
}
