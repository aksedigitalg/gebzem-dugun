import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star, MapPin, Phone, Mail, Globe, Award, ShieldCheck, Calendar,
  Instagram, Facebook, Youtube, ChevronRight, Clock, Building2, MessageCircle,
} from "lucide-react";
import { getFirmBySlug } from "@/lib/firm";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { InquiryButton } from "@/components/firm/inquiry-modal";
import { MessageButton } from "@/components/firm/message-button";
import { FavoriteButton } from "@/components/firm/favorite-button";
import { FirmGallery } from "@/components/firm/firm-gallery";
import { formatPrice, relativeTime } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const firm = await getFirmBySlug(slug);
  if (!firm) return {};
  const primaryCat = firm.categories.find((c) => c.isPrimary)?.category.name ?? "Düğün Hizmeti";
  return {
    title: `${firm.name} — ${primaryCat} | ${firm.district}`,
    description: firm.metaDescription || firm.shortDescription,
    alternates: { canonical: `/firma/${slug}` },
    openGraph: {
      title: firm.name,
      description: firm.shortDescription,
      images: firm.coverImage ? [firm.coverImage] : [],
    },
  };
}

export default async function FirmaProfilPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let firm: Awaited<ReturnType<typeof getFirmBySlug>> = null;
  try {
    firm = await getFirmBySlug(slug);
  } catch (e) {
    console.error("[firm-page] getFirmBySlug failed:", e);
  }
  if (!firm) notFound();

  const primaryCat = firm.categories.find((c) => c.isPrimary)?.category;

  // Bu kullanıcı bu firmayı favorilemiş mi? — Hata olursa sayfayı patlatma.
  let isFavorited = false;
  try {
    const session = await auth();
    if (session?.user?.id) {
      const fav = await db.favorite.findUnique({
        where: { userId_firmId: { userId: session.user.id, firmId: firm.id } },
      });
      isFavorited = !!fav;
    }
  } catch (e) {
    console.error("[firm-page] favorite lookup failed:", e);
  }

  return (
    <div className="bg-muted/20">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-background">
        <div className="container-page py-3">
          <nav className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary">Anasayfa</Link>
            <ChevronRight className="h-3 w-3" />
            {primaryCat && (
              <>
                <Link href={`/kategori/${primaryCat.slug}`} className="hover:text-primary">
                  {primaryCat.name}
                </Link>
                <ChevronRight className="h-3 w-3" />
              </>
            )}
            <span className="truncate font-medium text-foreground">{firm.name}</span>
          </nav>
        </div>
      </div>

      {/* HERO — kapak görseli ya da gradient */}
      <section className="relative h-56 w-full overflow-hidden sm:h-72 md:h-80">
        {firm.coverImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={firm.coverImage} alt={firm.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </>
        ) : (
          <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" aria-hidden />
            <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" aria-hidden />
            <div className="absolute inset-0 [background-image:radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px]" aria-hidden />
          </div>
        )}
      </section>

      {/* INFO BAR — hero ile content arasında, logo'yu hero'ya taşırarak Airbnb stili */}
      <div className="container-page">
        <div className="relative -mt-12 mb-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-lg sm:flex-row sm:items-center sm:gap-6 sm:p-6">
          {/* Logo / placeholder — büyük, hero'ya doğru taşmış */}
          {firm.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={firm.logo}
              alt={firm.name}
              className="h-24 w-24 flex-shrink-0 rounded-2xl border-2 border-background bg-white object-cover shadow-md sm:-mt-12 sm:h-28 sm:w-28"
            />
          ) : (
            <span className="grid h-24 w-24 flex-shrink-0 place-items-center rounded-2xl border-2 border-background bg-gradient-to-br from-primary/15 via-secondary/15 to-accent/15 text-primary shadow-md sm:-mt-12 sm:h-28 sm:w-28">
              <Building2 className="h-10 w-10 sm:h-12 sm:w-12" />
            </span>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                {firm.name}
              </h1>
              {firm.isVerified && (
                <Badge variant="success" className="gap-1">
                  <ShieldCheck className="h-3 w-3" /> Doğrulanmış
                </Badge>
              )}
              {firm.isFeatured && (
                <Badge variant="premium" className="gap-1">
                  <Award className="h-3 w-3" /> Premium
                </Badge>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              {firm.rating > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <strong className="text-foreground">{firm.rating.toFixed(1)}</strong>
                  <span>({firm.reviewCount} yorum)</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {firm.district}, {firm.city}
              </span>
              {firm.founded && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> {firm.founded}'den beri
                </span>
              )}
              {primaryCat && (
                <Link
                  href={`/kategori/${primaryCat.slug}`}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/20"
                >
                  {primaryCat.name}
                </Link>
              )}
            </div>

            {firm.categories.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {firm.categories
                  .filter((c) => !c.isPrimary)
                  .map(({ category }) => (
                    <Link
                      key={category.id}
                      href={`/kategori/${category.slug}`}
                      className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[11px] text-foreground/70 hover:border-primary hover:text-primary"
                    >
                      {category.name}
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container-page pb-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {/* Sol kolon */}
          <div className="space-y-6">

            {/* Hakkımızda */}
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-xl font-semibold">Hakkımızda</h2>
              <div
                className="prose prose-sm mt-3 max-w-none text-foreground/85"
                dangerouslySetInnerHTML={{ __html: firm.description }}
              />
            </section>

            {/* Galeri */}
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-xl font-semibold">Galeri</h2>
              <div className="mt-3">
                <FirmGallery items={firm.gallery} firmName={firm.name} />
              </div>
            </section>

            {/* Hizmetler */}
            {firm.services.length > 0 && (
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-display text-xl font-semibold">Hizmetler</h2>
                <ul className="mt-4 divide-y divide-border">
                  {firm.services.map((s) => (
                    <li key={s.id} className="flex items-start justify-between gap-4 py-3">
                      <div className="min-w-0">
                        <p className="font-medium">{s.name}</p>
                        <p className="text-sm text-muted-foreground">{s.description}</p>
                        {s.duration && (
                          <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" /> {s.duration}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        {(s.priceMin || s.priceMax) && (
                          <p className="font-display text-base font-semibold">
                            {s.priceMin && s.priceMax && s.priceMin !== s.priceMax
                              ? `${formatPrice(s.priceMin)} – ${formatPrice(s.priceMax)}`
                              : formatPrice((s.priceMin ?? s.priceMax) as number)}
                          </p>
                        )}
                        {s.unit && <p className="text-xs text-muted-foreground">{s.unit}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Paketler */}
            {firm.packages.length > 0 && (
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-display text-xl font-semibold">Paketler</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {firm.packages.map((p) => (
                    <div
                      key={p.id}
                      className={`rounded-xl border p-5 ${p.isPopular ? "border-primary bg-primary/5" : "border-border"}`}
                    >
                      {p.isPopular && (
                        <Badge variant="default" className="mb-2">En Popüler</Badge>
                      )}
                      <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                      <p className="mt-3 font-display text-2xl font-bold">{formatPrice(p.price)}</p>
                      {p.features.length > 0 && (
                        <ul className="mt-3 space-y-1.5 text-sm">
                          {p.features.map((f, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-emerald-600">✓</span>
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Yorumlar */}
            <section className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">
                  Müşteri Yorumları {firm.reviewCount > 0 && `(${firm.reviewCount})`}
                </h2>
                {firm.rating > 0 && (
                  <span className="inline-flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <strong>{firm.rating.toFixed(1)}</strong> / 5
                  </span>
                )}
              </div>

              {firm.reviews.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
                  Bu firma henüz yorum almamış. İlk yorumu yazan sen ol.
                </div>
              ) : (
                <ul className="mt-4 space-y-4">
                  {firm.reviews.map((r) => (
                    <li key={r.id} className="rounded-xl border border-border bg-muted/30 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{r.user.name ?? "Anonim"}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                              />
                            ))}
                            <span className="ml-1 text-xs text-muted-foreground">{relativeTime(r.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      {r.title && <p className="mt-2 font-medium">{r.title}</p>}
                      <p className="mt-1 text-sm text-foreground/85">{r.content}</p>
                      {r.reply && (
                        <div className="mt-3 rounded-lg border-l-4 border-primary bg-background p-3">
                          <p className="text-xs font-semibold text-primary">{firm.name} cevap verdi:</p>
                          <p className="mt-1 text-sm">{r.reply}</p>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* SSS */}
            {firm.faqs.length > 0 && (
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-display text-xl font-semibold">Sıkça Sorulan Sorular</h2>
                <div className="mt-3 space-y-2">
                  {firm.faqs.map((f) => (
                    <details key={f.id} className="group rounded-xl border border-border bg-muted/30 p-4">
                      <summary className="cursor-pointer font-medium">{f.question}</summary>
                      <p className="mt-2 text-sm text-muted-foreground">{f.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sağ kolon — sticky aksiyon paneli */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-md">
              <div className="border-b border-border pb-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Hızlı İletişim
                </p>
                <p className="mt-0.5 text-sm font-medium text-foreground">
                  Bu firmayla iletişime geç
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  24 saat içinde dönüş yapılır
                </p>
              </div>
              <InquiryButton firmId={firm.id} firmName={firm.name} />
              <MessageButton firmId={firm.id} firmName={firm.name} />
              <FavoriteButton firmId={firm.id} initiallyFavorited={isFavorited} />

              <div className="space-y-2 pt-3">
                <a
                  href={`tel:${firm.phone}`}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-medium hover:border-primary hover:bg-primary/5"
                >
                  <Phone className="h-4 w-4 text-muted-foreground" /> {firm.phone}
                </a>
                {firm.whatsapp && (
                  <a
                    href={`https://wa.me/${firm.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-medium hover:border-emerald-500 hover:bg-emerald-50"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-600" /> WhatsApp
                  </a>
                )}
                <a
                  href={`mailto:${firm.email}`}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-medium hover:border-primary hover:bg-primary/5"
                >
                  <Mail className="h-4 w-4 text-muted-foreground" /> {firm.email}
                </a>
                {firm.website && (
                  <a
                    href={firm.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-medium hover:border-primary hover:bg-primary/5"
                  >
                    <Globe className="h-4 w-4 text-muted-foreground" /> Web sitesi
                  </a>
                )}
              </div>

              {(firm.instagram || firm.facebook || firm.youtube) && (
                <div className="flex items-center gap-2 border-t border-border pt-3">
                  {firm.instagram && (
                    <a aria-label="Instagram" href={firm.instagram} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-pink-50 hover:border-pink-300">
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                  {firm.facebook && (
                    <a aria-label="Facebook" href={firm.facebook} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-blue-50 hover:border-blue-300">
                      <Facebook className="h-4 w-4" />
                    </a>
                  )}
                  {firm.youtube && (
                    <a aria-label="YouTube" href={firm.youtube} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-red-50 hover:border-red-300">
                      <Youtube className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}

              <div className="border-t border-border pt-3 text-xs text-muted-foreground">
                <p className="flex items-start gap-1.5">
                  <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0" />
                  <span>{firm.address}</span>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* JSON-LD: LocalBusiness */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `${siteConfig.url}/firma/${firm.slug}#business`,
            name: firm.name,
            description: firm.shortDescription,
            url: `${siteConfig.url}/firma/${firm.slug}`,
            image: firm.coverImage ?? firm.logo ?? undefined,
            telephone: firm.phone,
            email: firm.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: firm.address,
              addressLocality: firm.district,
              addressRegion: firm.city,
              addressCountry: "TR",
            },
            geo:
              firm.latitude && firm.longitude
                ? {
                    "@type": "GeoCoordinates",
                    latitude: firm.latitude,
                    longitude: firm.longitude,
                  }
                : undefined,
            ...(firm.rating > 0 && {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: firm.rating,
                reviewCount: firm.reviewCount,
              },
            }),
            ...(firm.reviews.length > 0 && {
              review: firm.reviews.slice(0, 5).map((r) => ({
                "@type": "Review",
                reviewRating: { "@type": "Rating", ratingValue: r.rating },
                author: { "@type": "Person", name: r.user.name ?? "Anonim" },
                reviewBody: r.content,
                datePublished: r.createdAt.toISOString(),
              })),
            }),
          }),
        }}
      />
    </div>
  );
}
