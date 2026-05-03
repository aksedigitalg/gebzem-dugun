"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupFirmAction } from "../../actions";
import { ALL_DISTRICTS } from "@/config/regions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" variant="secondary" className="w-full" disabled={pending}>
      {pending ? "İşletme hesabı oluşturuluyor…" : "İşletme Hesabı Oluştur"}
    </Button>
  );
}

export function FirmSignupForm() {
  const [state, formAction] = useActionState(signupFirmAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="firmName">Firma / İşletme Adı</Label>
        <Input
          id="firmName"
          name="firmName"
          required
          autoComplete="organization"
          placeholder="Örnek Düğün Salonu"
        />
        {state?.fieldErrors?.firmName && <FieldError msg={state.fieldErrors.firmName} />}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name">Yetkili Ad Soyad</Label>
        <Input
          id="name"
          name="name"
          required
          autoComplete="name"
          placeholder="Adınız ve soyadınız"
        />
        {state?.fieldErrors?.name && <FieldError msg={state.fieldErrors.name} />}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">İşletme E-postası</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="firma@eposta.com"
          />
          {state?.fieldErrors?.email && <FieldError msg={state.fieldErrors.email} />}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">İşletme Telefonu</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="0 5__ ___ __ __"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="district">Hizmet Verdiğiniz Ana İlçe</Label>
        <select
          id="district"
          name="district"
          required
          defaultValue=""
          className="flex h-11 w-full rounded-lg border border-border bg-background px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <option value="" disabled>İlçe seçiniz…</option>
          {ALL_DISTRICTS.map((d) => (
            <option key={d.slug} value={d.slug}>{d.name}</option>
          ))}
        </select>
        {state?.fieldErrors?.district && <FieldError msg={state.fieldErrors.district} />}
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
        <Link href="/kullanim-sartlari" className="text-secondary hover:underline">
          Kullanım Şartları
        </Link>{" "}
        ve{" "}
        <Link href="/gizlilik" className="text-secondary hover:underline">
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
