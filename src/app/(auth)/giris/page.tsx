"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signinAction } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Giriş yapılıyor…" : "Giriş Yap"}
    </Button>
  );
}

export default function SigninPage() {
  const [state, formAction] = useActionState(signinAction, {});

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Tekrar hoş geldin 👋</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Hesabına giriş yap; tekliflerini, favorilerini ve listelerini takip et.
      </p>

      <form action={formAction} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">E-posta</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" placeholder="ornek@eposta.com" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Şifre</Label>
            <Link href="/sifremi-unuttum" className="text-xs text-primary hover:underline">
              Şifremi unuttum
            </Link>
          </div>
          <Input id="password" name="password" type="password" required autoComplete="current-password" />
        </div>

        {state?.error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">{state.error}</p>
        )}

        <SubmitButton />
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Henüz hesabın yok mu?{" "}
        <Link href="/kayit" className="font-medium text-primary hover:underline">
          Üye Ol
        </Link>
      </p>
    </div>
  );
}
