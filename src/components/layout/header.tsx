"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, LogIn, Menu, Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { CATEGORIES, CATEGORY_GROUPS } from "@/config/categories";
import { PRIMARY_DISTRICTS } from "@/config/regions";
import { cn } from "@/lib/utils";

const groupedCategories = Object.entries(CATEGORY_GROUPS).map(([groupKey, label]) => ({
  groupKey,
  label,
  items: CATEGORIES.filter((c) => c.group === groupKey),
})).filter((g) => g.items.length > 0);

export function Header() {
  const [open, setOpen] = React.useState(false);
  const [megaOpen, setMegaOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
              <Heart className="h-4 w-4" fill="currentColor" />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">
              {siteConfig.name}
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            <button
              type="button"
              onClick={() => setMegaOpen((v) => !v)}
              className="flex items-center gap-1 text-sm font-medium text-foreground/80 transition hover:text-foreground"
            >
              Kategoriler
              <span className={cn("transition-transform", megaOpen && "rotate-180")}>▾</span>
            </button>
            <Link href="/bolge/gebze" className="text-sm font-medium text-foreground/80 hover:text-foreground">
              Bölgeler
            </Link>
            <Link href="/teklif-al" className="text-sm font-medium text-foreground/80 hover:text-foreground">
              Teklif Al
            </Link>
            <Link href="/blog" className="text-sm font-medium text-foreground/80 hover:text-foreground">
              Blog
            </Link>
            <Link href="/nasil-calisir" className="text-sm font-medium text-foreground/80 hover:text-foreground">
              Nasıl Çalışır?
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/isletme/kayit" className="hidden lg:inline-flex">
            <Button variant="outline" size="sm">
              <Sparkles className="h-4 w-4" />
              İşletmeni Ekle
            </Button>
          </Link>
          <Link href="/cift" className="hidden lg:inline-flex">
            <Button size="sm">
              <LogIn className="h-4 w-4" />
              Giriş Yap
            </Button>
          </Link>
          <button
            type="button"
            aria-label="Menüyü aç"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-border lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {megaOpen && (
        <div
          className="absolute inset-x-0 top-full hidden border-t border-border bg-background shadow-lg lg:block"
          onMouseLeave={() => setMegaOpen(false)}
        >
          <div className="container-page grid grid-cols-4 gap-8 py-8">
            {groupedCategories.map((group) => (
              <div key={group.groupKey}>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
                  {group.label}
                </h3>
                <ul className="space-y-2">
                  {group.items.slice(0, 6).map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/kategori/${cat.slug}`}
                        className="text-sm text-foreground/80 transition-colors hover:text-primary"
                        onClick={() => setMegaOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto bg-background p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-xl font-semibold">{siteConfig.name}</span>
              <button onClick={() => setOpen(false)} aria-label="Kapat" className="grid h-10 w-10 place-items-center rounded-lg border border-border">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Firma, kategori, bölge…"
                className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Link href="/cift" className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted" onClick={() => setOpen(false)}>
                Çift Girişi
              </Link>
              <Link href="/cift/kayit" className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted" onClick={() => setOpen(false)}>
                Çift Üye Ol
              </Link>
              <div className="my-1 h-px bg-border" />
              <Link href="/isletme" className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted" onClick={() => setOpen(false)}>
                İşletme Girişi
              </Link>
              <Link href="/isletme/kayit" className="block rounded-lg bg-secondary px-3 py-2.5 text-sm font-medium text-white" onClick={() => setOpen(false)}>
                İşletmeni Ekle
              </Link>
            </div>

            <div className="mt-8">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Bölgeler
              </h3>
              <div className="flex flex-wrap gap-2">
                {PRIMARY_DISTRICTS.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/bolge/${d.slug}`}
                    className="rounded-full border border-border px-3 py-1 text-xs"
                    onClick={() => setOpen(false)}
                  >
                    {d.name}
                  </Link>
                ))}
              </div>
            </div>

            {groupedCategories.map((group) => (
              <div key={group.groupKey} className="mt-6">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </h3>
                <ul className="space-y-1">
                  {group.items.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/kategori/${cat.slug}`}
                        className="block rounded px-2 py-1.5 text-sm text-foreground/80 hover:bg-muted"
                        onClick={() => setOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
