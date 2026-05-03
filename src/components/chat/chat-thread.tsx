"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendMessageAction, markConversationReadAction } from "@/lib/actions/message";
import { cn, relativeTime } from "@/lib/utils";

type Message = {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
};

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <Send className="h-4 w-4" />
      {pending ? "Gönderiliyor…" : "Gönder"}
    </Button>
  );
}

export function ChatThread({
  conversationId,
  messages: initialMessages,
  meId,
  counterpartyName,
  counterpartyInitials,
}: {
  conversationId: string;
  messages: Message[];
  meId: string;
  counterpartyName: string;
  counterpartyInitials: string;
}) {
  const router = useRouter();
  const [messages, setMessages] = React.useState(initialMessages);
  const [text, setText] = React.useState("");
  const endRef = React.useRef<HTMLDivElement>(null);

  // mark read on mount
  React.useEffect(() => {
    void markConversationReadAction(conversationId);
  }, [conversationId]);

  // 5s polling
  React.useEffect(() => {
    let cancelled = false;
    async function poll() {
      try {
        const res = await fetch(`/api/conversation/${conversationId}/messages`, { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        setMessages(data.messages ?? []);
      } catch {}
    }
    const id = setInterval(() => {
      if (!document.hidden) poll();
    }, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [conversationId]);

  // scroll to bottom
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex h-[calc(100vh-12rem)] min-h-[480px] flex-col rounded-2xl border border-border bg-card">
      <header className="flex items-center gap-3 border-b border-border px-5 py-4">
        <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {counterpartyInitials}
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium">{counterpartyName}</p>
          <p className="text-[11px] text-muted-foreground">{messages.length} mesaj</p>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <p className="my-auto text-center text-sm text-muted-foreground">
            Bu konuşmada henüz mesaj yok. Aşağıdan yazmaya başla.
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.senderId === meId;
            return (
              <div
                key={m.id}
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                  mine
                    ? "ml-auto bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm",
                )}
              >
                <p className="whitespace-pre-wrap break-words">{m.content}</p>
                <p
                  className={cn(
                    "mt-1 text-[10px]",
                    mine ? "text-primary-foreground/70" : "text-muted-foreground",
                  )}
                >
                  {relativeTime(m.createdAt)}
                  {mine && (m.isRead ? " · ✓✓" : " · ✓")}
                </p>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <form
        action={async (fd) => {
          fd.append("conversationId", conversationId);
          const res = await sendMessageAction({}, fd);
          if (res.ok) {
            setText("");
            router.refresh();
          }
        }}
        className="flex items-end gap-2 border-t border-border p-3"
      >
        <Textarea
          name="content"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Mesaj yaz…"
          rows={2}
          required
          minLength={1}
          maxLength={2000}
          className="flex-1 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (text.trim()) (e.currentTarget.form as HTMLFormElement)?.requestSubmit();
            }
          }}
        />
        <SubmitBtn />
      </form>
    </div>
  );
}
