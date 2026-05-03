"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateFirmProfileAction, type FirmActionState } from "@/lib/actions/firm";

type Firm = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  phone: string;
  whatsapp: string | null;
  email: string;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  youtube: string | null;
  address: string;
  district: string;
  neighborhood: string | null;
};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      <Save className="h-4 w-4" />
      {pending ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
    </Button>
  );
}

export function ProfileForm({
  firm,
  districts,
}: {
  firm: Firm;
  districts: { slug: string; name: string }[];
}) {
  const [state, formAction] = useActionState<FirmActionState, FormData>(updateFirmProfileAction, {});

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="firmId" value={firm.id} />

      {state.ok && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4" /> Değişiklikler kaydedildi.
        </div>
      )}
      {state.error && !state.ok && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>
      )}

      {/* Temel */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Temel Bilgiler</h2>
        <div className="mt-4 space-y-4">
          <Field label="Firma Adı" name="name" defaultValue={firm.name} required err={state.fieldErrors?.name} />
          <Field
            label="Kısa Açıklama (kart üzerinde görünür, max 280)"
            name="shortDescription"
            defaultValue={firm.shortDescription}
            required
            err={state.fieldErrors?.shortDescription}
            inputAs="textarea"
            rows={2}
            maxLength={280}
          />
          <Field
            label="Detaylı Açıklama (firma profilinde görünür, HTML destekli)"
            name="description"
            defaultValue={firm.description}
            required
            err={state.fieldErrors?.description}
            inputAs="textarea"
            rows={8}
          />
        </div>
      </section>

      {/* İletişim */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">İletişim</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Telefon" name="phone" defaultValue={firm.phone} required type="tel" />
          <Field label="WhatsApp (opsiyonel)" name="whatsapp" defaultValue={firm.whatsapp ?? ""} type="tel" />
          <Field label="E-posta" name="email" defaultValue={firm.email} required type="email" />
          <Field label="Web Sitesi" name="website" defaultValue={firm.website ?? ""} type="url" placeholder="https://" />
        </div>
      </section>

      {/* Sosyal */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Sosyal Medya</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Instagram URL" name="instagram" defaultValue={firm.instagram ?? ""} placeholder="https://instagram.com/..." />
          <Field label="Facebook URL" name="facebook" defaultValue={firm.facebook ?? ""} placeholder="https://facebook.com/..." />
          <Field label="TikTok URL" name="tiktok" defaultValue={firm.tiktok ?? ""} placeholder="https://tiktok.com/@..." />
          <Field label="YouTube URL" name="youtube" defaultValue={firm.youtube ?? ""} placeholder="https://youtube.com/@..." />
        </div>
      </section>

      {/* Konum */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Konum</h2>
        <div className="mt-4 grid grid-cols-1 gap-4">
          <Field label="Adres" name="address" defaultValue={firm.address} required />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="district">İlçe</Label>
              <select
                id="district"
                name="district"
                defaultValue={firm.district}
                required
                className="flex h-11 w-full rounded-lg border border-border bg-background px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {districts.map((d) => (
                  <option key={d.slug} value={d.slug}>{d.name}</option>
                ))}
              </select>
            </div>
            <Field label="Mahalle (opsiyonel)" name="neighborhood" defaultValue={firm.neighborhood ?? ""} />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <SaveButton />
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  err?: string;
  inputAs?: "input" | "textarea";
  rows?: number;
  maxLength?: number;
};

function Field({ label, name, defaultValue, required, type, placeholder, err, inputAs = "input", rows = 4, maxLength }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      {inputAs === "textarea" ? (
        <Textarea
          id={name}
          name={name}
          defaultValue={defaultValue}
          required={required}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
        />
      ) : (
        <Input
          id={name}
          name={name}
          defaultValue={defaultValue}
          required={required}
          type={type ?? "text"}
          placeholder={placeholder}
        />
      )}
      {err && <p className="text-xs text-red-600">{err}</p>}
    </div>
  );
}
