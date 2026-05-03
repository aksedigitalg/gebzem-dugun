import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin } from "lucide-react";
import { db } from "@/lib/db";
import { getFirmsByCategory } from "@/lib/firm";
import { FirmCard } from "@/components/shared/firm-card";
import { Badge } from "@/components/ui/badge";
import { ALL_DISTRICTS, PRIMARY_DISTRICTS } from "@/config/regions";
import { CATEGORIES } from "@/config/categories";
import { siteConfig } from "@/config/site";

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = await db.category.findUnique({ where: { slug } });
  if (!cat) return {};
  return {
    title: `Gebze ${cat.name} | Firmalar, Yorumlar ve Fiyatlar`,
    description: `Gebze, Darıca, Çayırova ve Dilovası'ndaki tüm ${cat.name.toLowerCase()} firmalarını karşılaştır. Gerçek müşteri yorumları, şeffaf fiyatlar, ücretsiz teklif.`,
    alternates: { canonical: `/kategori/${slug}` },
  };
}

export default async function KategoriPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await db.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const { items, total } = await getFirmsByCategory(slug, { take: 24 });

  return (
    <div className="container-page py-10">
      <nav className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary">Anasayfa</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/" className="hover:text-primary">Kategoriler</Link>
        <ChevronRight className="h-3 w-3" />
        <span>{category.name}</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Gebze {category.name}
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">{category.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline">{total} firma listede</Badge>
          {PRIMARY_DISTRICTS.map((d) => (
            <Link
              key={d.slug}
              href={`/kategori/${slug}/${d.slug}`}
              className="rounded-full border border-border bg-background px-3 py-1 text-xs hover:border-primary hover:text-primary"
            >
              {d.name} {category.shortName ?? category.name}
            </Link>
          ))}
        </div>
      </header>

      {items.length === 0 ? (
        <EmptyState category={category.name} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => <FirmCard key={f.id} firm={f} />)}
        </div>
      )}

      <NeighbourLinks slug={slug} />

      <SeoFooter category={category.name} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Gebze ${category.name}`,
            description: category.description,
            url: `${siteConfig.url}/kategori/${slug}`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: total,
              itemListElement: items.slice(0, 12).map((f, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${siteConfig.url}/firma/${f.slug}`,
                name: f.name,
              })),
            },
          }),
        }}
      />
    </div>
  );
}

function EmptyState({ category }: { category: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-8 py-12 text-center">
      <p className="font-display text-lg font-semibold">Bu kategoride henüz onaylı firma yok</p>
      <p className="mt-1 text-sm text-muted-foreground">
        İlk {category} firmasını sen ekle, çiftler aramaya başladığında ilk sırada görün.
      </p>
      <Link
        href="/isletme/kayit"
        className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        İşletmeni Ekle
      </Link>
    </div>
  );
}

function NeighbourLinks({ slug }: { slug: string }) {
  return (
    <section className="mt-12 rounded-2xl border border-border bg-muted/30 p-6">
      <h2 className="font-display text-lg font-semibold">İlçeye göre listele</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {ALL_DISTRICTS.map((d) => (
          <Link
            key={d.slug}
            href={`/kategori/${slug}/${d.slug}`}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-sm hover:border-primary hover:text-primary"
          >
            <MapPin className="h-3 w-3" /> {d.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

function SeoFooter({ category }: { category: string }) {
  return (
    <section className="mt-12 max-w-3xl text-sm leading-relaxed text-muted-foreground">
      <h2 className="font-display text-xl font-semibold text-foreground">
        Gebze ve çevresinde {category} nasıl seçilir?
      </h2>
      <p className="mt-3">
        Düğün hazırlığında {category.toLowerCase()} seçimi, hem bütçeniz hem de gününüzün hatırasında belirleyici bir rol oynar.
        GebzemDugun olarak Gebze, Darıca, Çayırova ve Dilovası'ndaki firmaları aynı kriterlerle değerlendirip
        size sunuyoruz: doğrulanmış işletme bilgileri, gerçek müşteri yorumları, şeffaf fiyat aralıkları ve müsaitlik takvimi.
      </p>
      <p className="mt-3">
        Aradığınızı yukarıdaki listede bulamazsanız "İşletmeni Ekle" butonuyla yeni firmaların eklenmesini sağlayabilir;
        kategori bağlamı dahilinde "Bütçe", "Davetli Sayısı", "Tarih" filtrelerini kullanarak en uygun seçeneği daraltabilirsiniz.
      </p>
    </section>
  );
}
