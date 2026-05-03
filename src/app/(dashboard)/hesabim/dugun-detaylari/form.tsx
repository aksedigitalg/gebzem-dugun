"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateWeddingDetailsAction } from "@/lib/actions/couple-profile";

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      <Save className="h-4 w-4" />
      {pending ? "Kaydediliyor…" : "Kaydet"}
    </Button>
  );
}

export function WeddingDetailsForm({
  defaultValues,
  districts,
}: {
  defaultValues: {
    weddingDate: string;
    partnerName: string;
    guestCount: number | null;
    budget: number | null;
    city: string;
    district: string;
    about: string;
  };
  districts: { slug: string; name: string }[];
}) {
  const [state, formAction] = useActionState<{ ok?: boolean; error?: string }, FormData>(updateWeddingDetailsAction, {});

  return (
    <form action={formAction} className="space-y-6">
      {state.ok && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4" /> Detaylar kaydedildi.
        </div>
      )}
      {state.error && !state.ok && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>
      )}

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Düğün Bilgileri</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="weddingDate">Düğün Tarihi</Label>
            <Input id="weddingDate" name="weddingDate" type="date" defaultValue={defaultValues.weddingDate} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="partnerName">Eşinizin Adı</Label>
            <Input id="partnerName" name="partnerName" defaultValue={defaultValues.partnerName} placeholder="Eşinizin adı" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="guestCount">Davetli Sayısı</Label>
            <Input id="guestCount" name="guestCount" type="number" min={0} max={5000} defaultValue={defaultValues.guestCount ?? ""} placeholder="200" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="budget">Bütçeniz ₺</Label>
            <Input id="budget" name="budget" type="number" min={0} defaultValue={defaultValues.budget ?? ""} placeholder="250000" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Konum</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="city">Şehir</Label>
            <Input id="city" name="city" defaultValue={defaultValues.city} placeholder="Kocaeli" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="district">İlçe</Label>
            <select
              id="district"
              name="district"
              defaultValue={defaultValues.district}
              className="flex h-11 w-full rounded-lg border border-border bg-background px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Seçiniz…</option>
              {districts.map((d) => (
                <option key={d.slug} value={d.slug}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Hakkında / Notlar</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Düğün konseptiniz, beklentileriniz veya özel istekleriniz hakkında kısa bir not.
        </p>
        <Textarea
          name="about"
          defaultValue={defaultValues.about}
          rows={4}
          maxLength={2000}
          className="mt-3"
          placeholder="Sade, romantik, açık hava… (opsiyonel)"
        />
      </section>

      <div className="flex justify-end">
        <SaveBtn />
      </div>
    </form>
  );
}
