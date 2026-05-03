import Link from "next/link";
import { Star, MapPin, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type FeaturedFirm = {
  slug: string;
  name: string;
  category: string;
  district: string;
  rating: number;
  reviewCount: number;
  cover: string;
  premium?: boolean;
};

const SAMPLE: FeaturedFirm[] = [
  {
    slug: "ornek-balo-salonu",
    name: "Örnek Balo Salonu",
    category: "Düğün Mekanı",
    district: "Gebze",
    rating: 4.9,
    reviewCount: 127,
    cover:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80&auto=format&fit=crop",
    premium: true,
  },
  {
    slug: "ornek-fotograf-stuyo",
    name: "Mira Photography",
    category: "Düğün Fotoğrafçısı",
    district: "Darıca",
    rating: 4.8,
    reviewCount: 84,
    cover:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80&auto=format&fit=crop",
  },
  {
    slug: "ornek-gelinlik-butik",
    name: "Aurora Gelinlik",
    category: "Gelinlik",
    district: "Çayırova",
    rating: 4.7,
    reviewCount: 56,
    cover:
      "https://images.unsplash.com/photo-1594552072238-5c4a26f4f4ce?w=900&q=80&auto=format&fit=crop",
  },
  {
    slug: "ornek-organizasyon",
    name: "Bella Düğün Organizasyon",
    category: "Düğün Organizasyonu",
    district: "Gebze",
    rating: 4.9,
    reviewCount: 142,
    cover:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80&auto=format&fit=crop",
    premium: true,
  },
];

export function FeaturedFirms() {
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Öne çıkan firmalar
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Doğrulanmış, yüksek puanlı ve hızlı yanıt veren ekipler — bu hafta öne çıkanlar.
          </p>
        </div>
        <Link href="/kategori/dugun-mekanlari" className="hidden text-sm font-medium text-primary hover:underline sm:inline">
          Daha fazlasını gör →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SAMPLE.map((f) => (
          <Link
            key={f.slug}
            href={`/firma/${f.slug}`}
            className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={f.cover}
                alt={f.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {f.premium && (
                <Badge variant="premium" className="absolute left-3 top-3 shadow-sm">
                  <Award className="h-3 w-3" /> Premium
                </Badge>
              )}
              <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-medium text-foreground shadow">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {f.rating.toFixed(1)}
              </div>
            </div>
            <div className="p-5">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-primary">
                {f.category}
              </p>
              <h3 className="font-display text-lg font-semibold leading-tight">{f.name}</h3>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {f.district}
                <span aria-hidden>·</span>
                <span>{f.reviewCount} yorum</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        ⓘ Liste demo amaçlıdır — gerçek firmalar onaylandıkça bu alan otomatik güncellenir.
      </p>
    </section>
  );
}
