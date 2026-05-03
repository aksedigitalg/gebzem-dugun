import Link from "next/link";
import { MapPin } from "lucide-react";
import { PRIMARY_DISTRICTS, SECONDARY_DISTRICTS } from "@/config/regions";

export function Regions() {
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Bölge bölge düğün hizmetleri
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Yerel firmalar, yerel fiyatlar — ilçenize en yakın seçenekler tek tıkla.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PRIMARY_DISTRICTS.map((d) => (
          <Link
            key={d.slug}
            href={`/bolge/${d.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg"
          >
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="font-display text-2xl font-semibold tracking-tight">{d.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{d.description}</p>
            <span className="mt-4 inline-flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Firmaları gör →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="text-muted-foreground">Yakın çevre:</span>
        {SECONDARY_DISTRICTS.map((d) => (
          <Link
            key={d.slug}
            href={`/bolge/${d.slug}`}
            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
          >
            {d.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
