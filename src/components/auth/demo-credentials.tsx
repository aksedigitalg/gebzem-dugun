"use client";

import * as React from "react";
import { Copy, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "couple" | "firm" | "admin";

const CREDS: Record<Variant, { label: string; email: string; password: string; color: string }> = {
  couple: {
    label: "Demo Çift Hesabı",
    email: "cift@example.com",
    password: "couple12345",
    color: "border-primary/30 bg-primary/5",
  },
  firm: {
    label: "Demo İşletme Hesabı",
    email: "firma@example.com",
    password: "firma12345",
    color: "border-secondary/30 bg-secondary/5",
  },
  admin: {
    label: "Demo Admin Hesabı",
    email: "admin@gebzemdugun.com",
    password: "admin12345",
    color: "border-amber-300 bg-amber-50",
  },
};

export function DemoCredentials({ variant }: { variant: Variant }) {
  const c = CREDS[variant];
  const [copied, setCopied] = React.useState<string | null>(null);

  function copy(value: string, key: string) {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  return (
    <div className={cn("rounded-xl border p-4", c.color)}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground/80">
        <Info className="h-3.5 w-3.5" />
        {c.label} (demo amaçlı)
      </div>
      <div className="mt-3 space-y-2 text-sm">
        <CredRow
          label="E-posta"
          value={c.email}
          copied={copied === "email"}
          onCopy={() => copy(c.email, "email")}
        />
        <CredRow
          label="Şifre"
          value={c.password}
          copied={copied === "password"}
          onCopy={() => copy(c.password, "password")}
        />
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        İlk girişte deneyim amaçlı bu hesabı kullanabilirsin. Production'a açılmadan önce şifreler değiştirilecek.
      </p>
    </div>
  );
}

function CredRow({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-background/80 px-3 py-2 text-xs">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <code className="truncate font-mono text-sm text-foreground">{value}</code>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-md border border-border bg-background text-muted-foreground transition hover:border-primary hover:text-primary"
        aria-label={`${label} kopyala`}
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3 w-3" />}
      </button>
    </div>
  );
}
