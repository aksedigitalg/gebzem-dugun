"use client";

import * as React from "react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createInquiryAction, type InquiryState } from "@/lib/actions/inquiry";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      <Send className="h-4 w-4" />
      {pending ? "Gönderiliyor…" : "Teklif İste"}
    </Button>
  );
}

export function InquiryButton({
  firmId,
  firmName,
}: {
  firmId: string;
  firmName: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<InquiryState, FormData>(createInquiryAction, {});

  React.useEffect(() => {
    if (state.ok) {
      const t = setTimeout(() => setOpen(false), 1800);
      return () => clearTimeout(t);
    }
  }, [state.ok]);

  return (
    <>
      <Button size="lg" className="w-full" onClick={() => setOpen(true)}>
        <Send className="h-4 w-4" />
        Ücretsiz Teklif Al
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-background shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background/95 px-6 py-4 backdrop-blur">
              <div>
                <h2 className="font-display text-lg font-semibold">{firmName}'den teklif iste</h2>
                <p className="text-xs text-muted-foreground">24 saat içinde size dönüş yapılacak.</p>
              </div>
              <button
                aria-label="Kapat"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {state.ok ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                  ✓
                </div>
                <p className="mt-3 font-display text-lg font-semibold">Teklifin gönderildi</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Firma yanıtladığında e-posta ve panelinden bildirim alacaksın.
                </p>
              </div>
            ) : (
              <form action={formAction} className="space-y-4 px-6 py-5">
                <input type="hidden" name="firmId" value={firmId} />

                <div className="space-y-1.5">
                  <Label htmlFor="message">Mesajın</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    rows={4}
                    placeholder="Düğününüz hakkında kısa bilgi verin: tarih, davetli sayısı, beklentileriniz…"
                  />
                  {state.fieldErrors?.message && (
                    <p className="text-xs text-red-600">{state.fieldErrors.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="weddingDate">Düğün Tarihi (opsiyonel)</Label>
                    <Input id="weddingDate" name="weddingDate" type="date" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="guestCount">Davetli Sayısı (opsiyonel)</Label>
                    <Input id="guestCount" name="guestCount" type="number" min={1} max={5000} placeholder="200" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="budget">Bütçeniz ₺ (opsiyonel)</Label>
                  <Input id="budget" name="budget" type="number" min={0} placeholder="250000" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contactEmail">E-posta</Label>
                  <Input id="contactEmail" name="contactEmail" type="email" required placeholder="ornek@eposta.com" />
                  {state.fieldErrors?.contactEmail && (
                    <p className="text-xs text-red-600">{state.fieldErrors.contactEmail}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contactPhone">Telefon</Label>
                  <Input id="contactPhone" name="contactPhone" type="tel" required placeholder="0 5__ ___ __ __" />
                  {state.fieldErrors?.contactPhone && (
                    <p className="text-xs text-red-600">{state.fieldErrors.contactPhone}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="preferredContact">Tercih edilen iletişim</Label>
                  <select
                    id="preferredContact"
                    name="preferredContact"
                    defaultValue="email"
                    className="flex h-11 w-full rounded-lg border border-border bg-background px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="email">E-posta</option>
                    <option value="phone">Telefon</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>

                {state.error && !state.ok && (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {state.error}
                  </p>
                )}

                <SubmitButton />

                <p className="text-center text-[11px] text-muted-foreground">
                  Bilgilerin firmaya ve platforma iletilir. KVKK kapsamında işlenir.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
