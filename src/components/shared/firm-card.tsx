import Link from "next/link";
import { Star, MapPin, Award, ShieldCheck, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { FirmCard as FirmCardType } from "@/lib/firm";
import { cn } from "@/lib/utils";

export function FirmCard({ firm, className }: { firm: FirmCardType; className?: string }) {
  const primaryCat = firm.categories.find((c) => c.isPrimary) ?? firm.categories[0];
  return (
    <Link
      href={`/firma/${firm.slug}`}
      className={cn(
        "group block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {firm.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firm.coverImage}
            alt={firm.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Building2 className="h-10 w-10 opacity-30" />
          </div>
        )}

        {firm.isFeatured && (
          <Badge variant="premium" className="absolute left-3 top-3 shadow-sm">
            <Award className="h-3 w-3" /> Premium
          </Badge>
        )}
        {firm.rating > 0 && (
          <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-medium text-foreground shadow">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {firm.rating.toFixed(1)}
          </div>
        )}
      </div>

      <div className="p-5">
        {primaryCat && (
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-primary">
            {primaryCat.category.name}
          </p>
        )}
        <h3 className="font-display text-lg font-semibold leading-tight">
          {firm.name}
          {firm.isVerified && (
            <ShieldCheck className="ml-1 inline-block h-4 w-4 text-emerald-600" aria-label="Doğrulanmış" />
          )}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{firm.shortDescription}</p>
        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {firm.district}
          {firm.reviewCount > 0 && (
            <>
              <span aria-hidden>·</span>
              <span>{firm.reviewCount} yorum</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export function FirmCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-2 p-5">
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
