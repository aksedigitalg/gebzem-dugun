import * as Icons from "lucide-react";
import Link from "next/link";

type IconKey = keyof typeof Icons;

export function PageStub({
  icon = "Sparkles",
  title,
  description,
  ctaHref,
  ctaLabel,
  features,
}: {
  icon?: IconKey;
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
  features?: string[];
}) {
  const Icon = (Icons[icon] ?? Icons.Sparkles) as React.ComponentType<{ className?: string }>;
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">{description}</p>

      {features && features.length > 0 && (
        <ul className="mx-auto mt-6 grid max-w-md gap-2 text-left text-sm text-foreground/85">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 rounded-lg border border-border bg-background px-3 py-2">
              <Icons.CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
        <Icons.Wrench className="h-3 w-3" />
        Geliştirme Aşamasında — Yakında Hazır
      </p>

      {ctaHref && ctaLabel && (
        <div className="mt-4">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {ctaLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
