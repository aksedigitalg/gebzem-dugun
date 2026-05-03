"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, XCircle, Pause, Play, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { moderateFirmAction } from "@/lib/actions/firm";

type Action = "APPROVE" | "REJECT" | "SUSPEND" | "ACTIVATE" | "FEATURE" | "UNFEATURE" | "VERIFY" | "UNVERIFY";

function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "İşleniyor…" : label}
    </Button>
  );
}

export function ModerationActions({
  firmId,
  status,
  isFeatured,
  isVerified,
}: {
  firmId: string;
  status: string;
  isFeatured: boolean;
  isVerified: boolean;
}) {
  const [state, formAction] = useActionState(moderateFirmAction, {});
  const [confirmAction, setConfirmAction] = React.useState<Action | null>(null);
  const [notes, setNotes] = React.useState("");

  if (confirmAction) {
    return (
      <form
        action={(fd) => {
          fd.set("firmId", firmId);
          fd.set("action", confirmAction);
          fd.set("notes", notes);
          formAction(fd);
          setConfirmAction(null);
        }}
        className="space-y-3"
      >
        <p className="text-sm font-medium">Aksiyon: {confirmAction}</p>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="(Opsiyonel) Açıklama / not — kullanıcıya iletilebilir"
          rows={3}
        />
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmAction(null)} className="flex-1">
            Vazgeç
          </Button>
          <SubmitBtn label="Onayla" />
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-2">
      {state.ok && <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">✓ Aksiyon uygulandı.</p>}
      {state.error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{state.error}</p>}

      {status === "PENDING" && (
        <>
          <Button onClick={() => setConfirmAction("APPROVE")} className="w-full bg-emerald-600 hover:bg-emerald-700" size="sm">
            <CheckCircle2 className="h-4 w-4" /> Onayla
          </Button>
          <Button onClick={() => setConfirmAction("REJECT")} variant="outline" className="w-full text-red-600" size="sm">
            <XCircle className="h-4 w-4" /> Reddet
          </Button>
        </>
      )}

      {status === "ACTIVE" && (
        <Button onClick={() => setConfirmAction("SUSPEND")} variant="outline" className="w-full text-amber-700" size="sm">
          <Pause className="h-4 w-4" /> Askıya Al
        </Button>
      )}

      {(status === "SUSPENDED" || status === "PAUSED") && (
        <Button onClick={() => setConfirmAction("ACTIVATE")} variant="outline" className="w-full text-emerald-700" size="sm">
          <Play className="h-4 w-4" /> Aktifleştir
        </Button>
      )}

      <div className="border-t border-border pt-2">
        {!isFeatured ? (
          <Button onClick={() => setConfirmAction("FEATURE")} variant="outline" className="w-full" size="sm">
            <Star className="h-4 w-4" /> Öne Çıkar
          </Button>
        ) : (
          <Button onClick={() => setConfirmAction("UNFEATURE")} variant="outline" className="w-full" size="sm">
            <Star className="h-4 w-4" /> Öne Çıkarmayı Kaldır
          </Button>
        )}
        {!isVerified ? (
          <Button onClick={() => setConfirmAction("VERIFY")} variant="outline" className="mt-2 w-full" size="sm">
            <ShieldCheck className="h-4 w-4" /> Doğrulanmış Yap
          </Button>
        ) : (
          <Button onClick={() => setConfirmAction("UNVERIFY")} variant="outline" className="mt-2 w-full" size="sm">
            <ShieldCheck className="h-4 w-4" /> Doğrulamayı Kaldır
          </Button>
        )}
      </div>
    </div>
  );
}
