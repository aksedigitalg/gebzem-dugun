"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Save, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction, changePasswordAction } from "@/lib/actions/couple-profile";

function SubmitBtn({ icon: Icon = Save, idleLabel, pendingLabel }: { icon?: typeof Save; idleLabel: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <Icon className="h-4 w-4" />
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
}

export function ProfileForm({ name, email, phone }: { name: string; email: string; phone: string }) {
  const [state, formAction] = useActionState<{ ok?: boolean; error?: string }, FormData>(updateProfileAction, {});

  return (
    <form action={formAction} className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-display text-lg font-semibold">Profil Bilgileri</h2>
      <p className="mt-1 text-xs text-muted-foreground">E-posta değiştirmek için destek ekibiyle iletişime geç.</p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Ad Soyad</Label>
          <Input id="name" name="name" required minLength={2} defaultValue={name} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">E-posta (değiştirilemez)</Label>
          <Input id="email" name="email" defaultValue={email} disabled />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input id="phone" name="phone" type="tel" defaultValue={phone} placeholder="0 5__ ___ __ __" />
        </div>
      </div>

      {state.ok && (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700">
          <CheckCircle2 className="h-3 w-3" /> Profil güncellendi.
        </p>
      )}
      {state.error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700">{state.error}</p>
      )}

      <div className="mt-4 flex justify-end">
        <SubmitBtn idleLabel="Profili Kaydet" pendingLabel="Kaydediliyor…" />
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, formAction] = useActionState<{ ok?: boolean; error?: string }, FormData>(changePasswordAction, {});
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-display text-lg font-semibold">Şifre Değiştir</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="currentPassword">Mevcut Şifre</Label>
          <Input id="currentPassword" name="currentPassword" type="password" required minLength={8} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="newPassword">Yeni Şifre</Label>
          <Input id="newPassword" name="newPassword" type="password" required minLength={8} />
        </div>
      </div>

      {state.ok && (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700">
          <CheckCircle2 className="h-3 w-3" /> Şifre değiştirildi.
        </p>
      )}
      {state.error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700">{state.error}</p>
      )}

      <div className="mt-4 flex justify-end">
        <SubmitBtn icon={Lock} idleLabel="Şifreyi Değiştir" pendingLabel="Değiştiriliyor…" />
      </div>
    </form>
  );
}
