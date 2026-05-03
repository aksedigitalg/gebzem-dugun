"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { respondInquiryAction } from "@/lib/actions/inquiry";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <Send className="h-4 w-4" />
      {pending ? "Gönderiliyor…" : "Yanıt Gönder"}
    </Button>
  );
}

export function ReplyForm({
  inquiryId,
  existingResponse,
  firmName,
}: {
  inquiryId: string;
  existingResponse: string | null;
  firmName: string;
}) {
  const [state, formAction] = useActionState(respondInquiryAction, {});

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-border bg-card p-6">
      <input type="hidden" name="inquiryId" value={inquiryId} />
      <h3 className="font-display text-base font-semibold">
        {existingResponse ? "Yanıtı Güncelle" : "Yanıt Gönder"}
      </h3>
      <p className="text-xs text-muted-foreground">
        Müşteri yanıtınızı e-posta ile alacak ve panellerinde görecek. {firmName} olarak yanıt veriyorsunuz.
      </p>

      <div className="space-y-1.5">
        <Label htmlFor="response">Yanıtınız</Label>
        <Textarea
          id="response"
          name="response"
          required
          minLength={5}
          maxLength={4000}
          rows={6}
          defaultValue={existingResponse ?? ""}
          placeholder="Tarih müsait, paket fiyatları şöyle…"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="status">Teklif Durumu</Label>
        <select
          id="status"
          name="status"
          defaultValue="RESPONDED"
          className="flex h-11 w-full rounded-lg border border-border bg-background px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="RESPONDED">Yanıtlandı</option>
          <option value="REJECTED">Reddet (uygun değil)</option>
        </select>
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{state.error}</p>
      )}
      {state.ok && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          ✓ Yanıt gönderildi.
        </p>
      )}

      <SubmitBtn />
    </form>
  );
}
