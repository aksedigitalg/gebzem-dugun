export const siteConfig = {
  name: "GebzemDugun",
  fullName: "GebzemDugun.com",
  description:
    "Gebze, Darıca, Çayırova ve Dilovası'ndaki tüm düğün, nişan, kına ve sünnet hizmeti veren firmaları tek platformda karşılaştır. Ücretsiz teklif al, yorumları oku, en uygun firmayı seç.",
  shortDescription: "Gebze ve çevre ilçelerin yerel düğün rehberi",
  url: "https://gebzemdugun.com",
  ogImage: "/og.png",
  email: "info@gebzemdugun.com",
  phone: "+90 (262) 000 00 00",
  whatsapp: "+905000000000",
  address: "Gebze, Kocaeli",
  social: {
    instagram: "https://instagram.com/gebzemdugun",
    facebook: "https://facebook.com/gebzemdugun",
    tiktok: "https://tiktok.com/@gebzemdugun",
    youtube: "https://youtube.com/@gebzemdugun",
    pinterest: "https://pinterest.com/gebzemdugun",
  },
  keywords: [
    "Gebze düğün",
    "Gebze düğün mekanları",
    "Gebze düğün fotoğrafçısı",
    "Darıca düğün salonu",
    "Çayırova gelinlik",
    "Dilovası düğün organizasyon",
    "Kocaeli düğün",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
