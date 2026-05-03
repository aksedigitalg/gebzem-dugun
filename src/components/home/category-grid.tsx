import Link from "next/link";
import * as Icons from "lucide-react";
import { CATEGORIES } from "@/config/categories";
import { cn } from "@/lib/utils";

type IconKey = keyof typeof Icons;

export function CategoryGrid({ limit, className }: { limit?: number; className?: string }) {
  const items = limit ? CATEGORIES.slice(0, limit) : CATEGORIES;

  return (
    <section className={cn("container-page py-16 sm:py-20", className)}>
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Tüm hizmetler bir tık uzakta
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Düğün, nişan, kına ve sünnet için ihtiyacın olan her hizmet kategorisi
            burada — gerçek müşteri yorumlarıyla, şeffaf fiyatlarla.
          </p>
        </div>
        <Link
          href="/kategori"
          className="hidden text-sm font-medium text-primary hover:underline sm:inline"
        >
          Tümünü gör →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((cat) => {
          const Icon = (Icons[cat.icon as IconKey] ?? Icons.Sparkles) as React.ComponentType<{ className?: string }>;
          return (
            <Link
              key={cat.slug}
              href={`/kategori/${cat.slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-muted text-secondary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium text-foreground">{cat.shortName ?? cat.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
