import Link from "next/link";
import { Sparkles, ArrowRight, Building2, Camera, PartyPopper, Crown } from "lucide-react";

/**
 * Henüz onaylı, yayında firma yokken anasayfada gösterilen "yakında" hücreleri.
 * Stok görsel kullanmıyoruz; gerçek firmalar onaylandıkça bu blok dinamik olarak
 * en yüksek puanlı / Premium firmalarla doldurulacak.
 */
const PLACEHOLDER_CATEGORIES = [
  { icon: Building2, label: "Düğün Mekanları", href: "/kategori/dugun-mekanlari" },
  { icon: Camera, label: "Düğün Fotoğrafçıları", href: "/kategori/dugun-fotografcilari" },
  { icon: PartyPopper, label: "Düğün Organizasyonu", href: "/kategori/dugun-organizasyonu" },
  { icon: Crown, label: "Gelinlik", href: "/kategori/gelinlik" },
];

export function FeaturedFirms() {
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3 w-3" />
          Yakında
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Öne çıkan firmalar burada listelenecek
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Platform yeni yayında — onaylı işletmeler eklendikçe en yüksek puanlı,
          premium üyelikli firmalar bu alanda çiftlere sunulacak.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PLACEHOLDER_CATEGORIES.map(({ icon: Icon, label, href }) => (
          <Link
            key={href}
            href={href}
            className="group flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-background text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <span className="font-display text-sm font-semibold text-foreground">
              {label}
            </span>
            <span className="text-xs text-muted-foreground">
              kategorisinde firmalar →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-center">
        <Link
          href="/isletme/kayit"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
        >
          İlk firmalardan biri olmak ister misiniz?
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
