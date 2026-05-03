import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { db } from "@/lib/db";
import { getFirmsByDistrict } from "@/lib/firm";
import { FirmCard } from "@/components/shared/firm-card";
import { ALL_DISTRICTS, getRegionBySlug } from "@/config/regions";
import { CATEGORIES } from "@/config/categories";
import { siteConfig } from "@/config/site";

export async function generateStaticParams() {
  return ALL_DISTRICTS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const region = getRegionBySlug(slug);
  if (!region) return {};
  return {
    title: `${region.name} Düğün Hizmetleri | Mekan, Fotoğrafçı, Organizasyon ve Daha Fazlası`,
    description: `${region.name}'da düğün hazırlığı yapan çiftler için tüm hizmet kategorileri tek platformda.`,
    alternates: { canonical: `/bolge/${slug}` },
  };
}

export default async function BolgePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const region = getRegionBySlug(slug);
  if (!region) notFound();

  const firms = await getFirmsByDistrict(slug, { take: 24 });
  const totalFirms = await db.firm.count({
    where: { status: "ACTIVE", OR: [{ district: slug }, { serviceAreas: { has: slug } }] },
  });

  return (
    <div className="container-page py-10">
      <nav className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary">Anasayfa</Link>
        <ChevronRight className="h-3 w-3" />
        <span>{region.name}</span>
      </nav>

      <header className="mb-10">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {region.name} Düğün Hizmetleri
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">{region.description}</p>
      </header>

      <h2 className="font-display text-2xl font-semibold">Kategoriye göre firmalar</h2>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {CATEGORIES.slice(0, 16).map((c) => (
          <Link
            key={c.slug}
            href={`/kategori/${c.slug}/${slug}`}
            className="rounded-xl border border-border bg-card p-3 text-sm transition hover:border-primary hover:bg-primary/5"
          >
            {region.name} {c.shortName ?? c.name}
          </Link>
        ))}
      </div>

      <h2 className="mt-12 font-display text-2xl font-semibold">{region.name}'daki firmalar</h2>
      {firms.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border bg-muted/30 px-8 py-12 text-center">
          <p className="font-display text-lg font-semibold">
            {region.name}'da henüz onaylı firma yok
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            İlk firmalardan biri olmak için{" "}
            <Link href="/isletme/kayit" className="text-primary hover:underline">
              işletmeni ekle
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {firms.map((f) => <FirmCard key={f.id} firm={f} />)}
        </div>
      )}

      <p className="mt-6 text-xs text-muted-foreground">{totalFirms} firma listede</p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Place",
            name: region.name,
            description: region.description,
            url: `${siteConfig.url}/bolge/${slug}`,
          }),
        }}
      />
    </div>
  );
}
