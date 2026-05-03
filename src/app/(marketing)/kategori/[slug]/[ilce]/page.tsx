import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { db } from "@/lib/db";
import { getFirmsByCategory } from "@/lib/firm";
import { FirmCard } from "@/components/shared/firm-card";
import { Badge } from "@/components/ui/badge";
import { ALL_DISTRICTS, getRegionBySlug } from "@/config/regions";
import { siteConfig } from "@/config/site";
import { CATEGORIES } from "@/config/categories";

export async function generateStaticParams() {
  return CATEGORIES.flatMap((c) =>
    ALL_DISTRICTS.filter((d) => d.priority <= 2).map((d) => ({ slug: c.slug, ilce: d.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; ilce: string }>;
}): Promise<Metadata> {
  const { slug, ilce } = await params;
  const cat = await db.category.findUnique({ where: { slug } });
  const district = getRegionBySlug(ilce);
  if (!cat || !district) return {};
  return {
    title: `${district.name} ${cat.name} | En İyi Firmalar, Yorumlar ve Fiyatlar`,
    description: `${district.name}'da ${cat.name.toLowerCase()} arıyorsanız doğru yerdesiniz. Doğrulanmış firmalar, şeffaf fiyatlar, ücretsiz teklif.`,
    alternates: { canonical: `/kategori/${slug}/${ilce}` },
  };
}

export default async function KategoriIlcePage({
  params,
}: {
  params: Promise<{ slug: string; ilce: string }>;
}) {
  const { slug, ilce } = await params;
  const category = await db.category.findUnique({ where: { slug } });
  const district = getRegionBySlug(ilce);
  if (!category || !district) notFound();

  const { items, total } = await getFirmsByCategory(slug, { district: ilce, take: 24 });

  return (
    <div className="container-page py-10">
      <nav className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary">Anasayfa</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/kategori/${slug}`} className="hover:text-primary">{category.name}</Link>
        <ChevronRight className="h-3 w-3" />
        <span>{district.name}</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {district.name} {category.name}
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          {district.description ?? `${district.name}'da ${category.name.toLowerCase()} arayan çiftler için doğrulanmış firma listesi.`}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline">{total} firma listede</Badge>
          <Link href={`/kategori/${slug}`} className="text-xs text-primary hover:underline">
            Tüm bölgeleri gör →
          </Link>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-8 py-12 text-center">
          <p className="font-display text-lg font-semibold">
            {district.name}'da bu kategoride henüz onaylı firma yok
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            <Link href={`/kategori/${slug}`} className="text-primary hover:underline">
              Yakın ilçelere bak
            </Link>{" "}
            ya da{" "}
            <Link href="/isletme/kayit" className="text-primary hover:underline">
              ilk firma sen ol
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => <FirmCard key={f.id} firm={f} />)}
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${district.name} ${category.name}`,
            description: `${district.name}'da ${category.name.toLowerCase()} firmaları`,
            url: `${siteConfig.url}/kategori/${slug}/${ilce}`,
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
