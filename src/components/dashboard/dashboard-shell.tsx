import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

type IconKey = keyof typeof Icons;

export type NavItem = {
  href: string;
  label: string;
  icon: IconKey;
  badge?: number;
  exact?: boolean;
};

export function DashboardShell({
  title,
  subtitle,
  navTitle,
  navItems,
  currentPath,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  navTitle: string;
  navItems: NavItem[];
  currentPath: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-2xl border border-border bg-card p-4 lg:sticky lg:top-20 lg:h-fit">
        <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {navTitle}
        </p>
        <nav className="space-y-1">
          {navItems.map((it) => {
            const isActive = it.exact ? currentPath === it.href : currentPath.startsWith(it.href);
            const Icon = (Icons[it.icon] ?? Icons.Circle) as React.ComponentType<{ className?: string }>;
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition",
                  isActive
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-foreground/80 hover:bg-muted",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  {it.label}
                </span>
                {typeof it.badge === "number" && it.badge > 0 && (
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    {it.badge > 99 ? "99+" : it.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div>
        <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>

        {children}
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: IconKey;
  accent?: "primary" | "secondary" | "amber" | "emerald";
}) {
  const Icon = icon ? ((Icons[icon] ?? Icons.Circle) as React.ComponentType<{ className?: string }>) : null;
  const accentClass = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
  }[accent ?? "primary"];
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-2xl font-semibold leading-none">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        {Icon && (
          <span className={cn("grid h-10 w-10 place-items-center rounded-full", accentClass)}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
    </div>
  );
}
