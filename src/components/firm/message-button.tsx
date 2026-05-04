"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendMessageAction } from "@/lib/actions/message";

export function MessageButton({ firmId, firmName }: { firmId: string; firmName: string }) {
  const router = useRouter();
  const { status } = useSession();
  const [pending, startTransition] = React.useTransition();
  const [opened, setOpened] = React.useState(false);
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  if (status === "unauthenticated") {
    return (
      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => router.push(`/cift?callbackUrl=${encodeURIComponent(window.location.pathname)}`)}
      >
        <MessageSquare className="h-4 w-4" />
        Mesaj Gönder (giriş gerekir)
      </Button>
    );
  }

  if (!opened) {
    return (
      <Button variant="outline" size="lg" className="w-full" onClick={() => setOpened(true)}>
        <MessageSquare className="h-4 w-4" />
        Mesaj Gönder
      </Button>
    );
  }

  return (
    <form
      action={(fd) => {
        setError(null);
        startTransition(async () => {
          const result = await sendMessageAction({}, fd);
          if (result.ok) {
            setText("");
            router.push("/hesabim/mesajlar");
            router.refresh();
          } else {
            setError(result.error ?? "Mesaj gönderilemedi.");
          }
        });
      }}
      className="space-y-2 rounded-xl border border-border bg-card p-3"
    >
      <input type="hidden" name="firmId" value={firmId} />
      <textarea
        name="content"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        minLength={1}
        maxLength={2000}
        rows={3}
        placeholder={`${firmName}'e mesajını yaz…`}
        className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpened(false)} className="flex-1">
          Vazgeç
        </Button>
        <Button type="submit" size="sm" disabled={pending || text.length < 1} className="flex-1">
          {pending ? "Gönderiliyor…" : "Gönder"}
        </Button>
      </div>
    </form>
  );
}
