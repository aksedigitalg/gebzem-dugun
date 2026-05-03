import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { CATEGORIES } from "@/config/categories";
import { ALL_DISTRICTS, NEIGHBORHOODS } from "@/config/regions";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes = [
    "",
    "/hakkimizda",
    "/nasil-calisir",
    "/iletisim",
    "/firma-ekle",
    "/blog",
    "/teklif-al",
    "/dugun-butce-hesaplayici",
    "/dugun-davetli-listesi",
    "/dugun-checklist",
    "/dugun-geri-sayim",
    "/dugun-mekan-karsilastir",
    "/kvkk",
    "/gizlilik",
    "/kullanim-sartlari",
    "/cerez-politikasi",
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  const categoryRoutes = CATEGORIES.map((c) => ({
    url: `${base}/kategori/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const regionRoutes = ALL_DISTRICTS.map((d) => ({
    url: `${base}/bolge/${d.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryRegionRoutes = CATEGORIES.flatMap((c) =>
    ALL_DISTRICTS.filter((d) => d.priority <= 2).map((d) => ({
      url: `${base}/kategori/${c.slug}/${d.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  );

  const neighborhoodRoutes = CATEGORIES.flatMap((c) =>
    NEIGHBORHOODS.map((n) => ({
      url: `${base}/kategori/${c.slug}/${n.parent}/${n.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...regionRoutes,
    ...categoryRegionRoutes,
    ...neighborhoodRoutes,
  ];
}
