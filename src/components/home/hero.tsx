"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/config/categories";
import { ALL_DISTRICTS } from "@/config/regions";

export function Hero() {
  const router = useRouter();
  const [category, setCategory] = React.useState<string>("");
  const [region, setRegion] = React.useState<string>("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (category && region) router.push(`/kategori/${category}/${region}`);
    else if (category) router.push(`/kategori/${category}`);
    else if (region) router.push(`/bolge/${region}`);
  };

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-muted via-background to-background pb-20 pt-14 sm:pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(60%_50%_at_50%_30%,black,transparent)]"
      >
        <div className="absolute -top-24 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-accent/30 blur-3xl" />
      </div>

      <div className="container-page text-center">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Gebze, Darıca, Çayırova ve Dilovası'nın yerel düğün rehberi
        </div>

        <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
          Düğününüzün her detayı
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            tek platformda.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
          Mekan, fotoğrafçı, gelinlik, organizasyon ve daha fazlası — Gebze ve çevre
          ilçelerin en güvenilir firmalarını karşılaştır, ücretsiz teklif al, en doğru
          tercihi yap.
        </p>

        <form
          onSubmit={handleSearch}
          className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-2 rounded-2xl border border-border bg-background p-2 shadow-sm sm:grid-cols-[1fr_1fr_auto]"
        >
          <label className="relative flex items-center">
            <Search className="absolute left-4 h-4 w-4 text-muted-foreground" />
            <select
              aria-label="Kategori"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 w-full appearance-none rounded-xl border-0 bg-transparent pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Hizmet kategorisi seç…</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className="relative flex items-center border-t border-border sm:border-l sm:border-t-0">
            <MapPin className="absolute left-4 h-4 w-4 text-muted-foreground" />
            <select
              aria-label="Bölge"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="h-12 w-full appearance-none rounded-xl border-0 bg-transparent pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Bölge seç…</option>
              {ALL_DISTRICTS.map((d) => (
                <option key={d.slug} value={d.slug}>{d.name}</option>
              ))}
            </select>
          </label>
          <Button type="submit" size="lg" className="h-12">
            <Search className="h-4 w-4" /> Ara
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Popüler aramalar:</span>
          {[
            { label: "Gebze düğün mekanları", href: "/kategori/dugun-mekanlari/gebze" },
            { label: "Darıca fotoğrafçı", href: "/kategori/dugun-fotografcilari/darica" },
            { label: "Çayırova gelinlik", href: "/kategori/gelinlik/cayirova" },
            { label: "Dilovası organizasyon", href: "/kategori/dugun-organizasyonu/dilovasi" },
          ].map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-full border border-border bg-background/60 px-3 py-1 transition hover:border-primary hover:text-primary"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
