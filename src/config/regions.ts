export type RegionDef = {
  slug: string;
  name: string;
  type: "city" | "district" | "neighborhood";
  parent?: string;
  priority: 1 | 2 | 3; // 1 = birincil hedef, 2 = ikincil, 3 = üçüncül
  description?: string;
};

export const PRIMARY_DISTRICTS: RegionDef[] = [
  {
    slug: "gebze",
    name: "Gebze",
    type: "district",
    parent: "kocaeli",
    priority: 1,
    description:
      "Kocaeli'nin sanayi ve nüfus merkezi Gebze, Marmara'nın en yoğun düğün organizasyonu hareketinin yaşandığı ilçelerden biridir. Eskihisar, Çayırova ve İstanbul yakın çevresine hizmet verir.",
  },
  {
    slug: "darica",
    name: "Darıca",
    type: "district",
    parent: "kocaeli",
    priority: 1,
    description:
      "Marmara kıyısında konumlanan Darıca, sahil mekanları ve manzaralı düğün salonlarıyla bilinir. Bayramoğlu ve sahil bölgesi gözde lokasyonlardır.",
  },
  {
    slug: "cayirova",
    name: "Çayırova",
    type: "district",
    parent: "kocaeli",
    priority: 1,
    description:
      "Çayırova, modern düğün salonları ve organizasyon firmalarıyla genç çiftlerin tercihi olan ilçelerdendir.",
  },
  {
    slug: "dilovasi",
    name: "Dilovası",
    type: "district",
    parent: "kocaeli",
    priority: 1,
    description:
      "Dilovası ve çevresinde butik ölçekli düğün mekanları ve organizasyon firmaları yer alır.",
  },
];

export const SECONDARY_DISTRICTS: RegionDef[] = [
  { slug: "tuzla", name: "Tuzla", type: "district", parent: "istanbul", priority: 2 },
  { slug: "pendik", name: "Pendik", type: "district", parent: "istanbul", priority: 2 },
];

export const TERTIARY_DISTRICTS: RegionDef[] = [
  { slug: "izmit", name: "İzmit", type: "district", parent: "kocaeli", priority: 3 },
  { slug: "korfez", name: "Körfez", type: "district", parent: "kocaeli", priority: 3 },
  { slug: "golcuk", name: "Gölcük", type: "district", parent: "kocaeli", priority: 3 },
  { slug: "kandira", name: "Kandıra", type: "district", parent: "kocaeli", priority: 3 },
  { slug: "karamursel", name: "Karamürsel", type: "district", parent: "kocaeli", priority: 3 },
  { slug: "basiskele", name: "Başiskele", type: "district", parent: "kocaeli", priority: 3 },
  { slug: "kartepe", name: "Kartepe", type: "district", parent: "kocaeli", priority: 3 },
];

export const ALL_DISTRICTS: RegionDef[] = [
  ...PRIMARY_DISTRICTS,
  ...SECONDARY_DISTRICTS,
  ...TERTIARY_DISTRICTS,
];

export const NEIGHBORHOODS: RegionDef[] = [
  // Gebze
  { slug: "arapcesme", name: "Arapçeşme", type: "neighborhood", parent: "gebze", priority: 1 },
  { slug: "barbaros", name: "Barbaros", type: "neighborhood", parent: "gebze", priority: 1 },
  { slug: "beylikbagi", name: "Beylikbağı", type: "neighborhood", parent: "gebze", priority: 1 },
  { slug: "cumhuriyet", name: "Cumhuriyet", type: "neighborhood", parent: "gebze", priority: 1 },
  { slug: "eskihisar", name: "Eskihisar", type: "neighborhood", parent: "gebze", priority: 1 },
  { slug: "guzeller", name: "Güzeller", type: "neighborhood", parent: "gebze", priority: 1 },
  { slug: "hacihalil", name: "Hacıhalil", type: "neighborhood", parent: "gebze", priority: 1 },
  { slug: "mustafapasa", name: "Mustafapaşa", type: "neighborhood", parent: "gebze", priority: 1 },
  { slug: "osmanyilmaz", name: "Osman Yılmaz", type: "neighborhood", parent: "gebze", priority: 1 },
  { slug: "sultanorhan", name: "Sultan Orhan", type: "neighborhood", parent: "gebze", priority: 1 },
  { slug: "tatlikuyu", name: "Tatlıkuyu", type: "neighborhood", parent: "gebze", priority: 1 },
  { slug: "yenikent", name: "Yenikent", type: "neighborhood", parent: "gebze", priority: 1 },

  // Darıca
  { slug: "bayramoglu", name: "Bayramoğlu", type: "neighborhood", parent: "darica", priority: 1 },
  { slug: "abdi-ipekci", name: "Abdi İpekçi", type: "neighborhood", parent: "darica", priority: 1 },
  { slug: "kazim-karabekir", name: "Kazım Karabekir", type: "neighborhood", parent: "darica", priority: 1 },
  { slug: "piri-reis", name: "Piri Reis", type: "neighborhood", parent: "darica", priority: 1 },

  // Çayırova
  { slug: "akse", name: "Akse", type: "neighborhood", parent: "cayirova", priority: 1 },
  { slug: "atatürk", name: "Atatürk", type: "neighborhood", parent: "cayirova", priority: 1 },
  { slug: "inonu", name: "İnönü", type: "neighborhood", parent: "cayirova", priority: 1 },
  { slug: "ozgurluk", name: "Özgürlük", type: "neighborhood", parent: "cayirova", priority: 1 },

  // Dilovası
  { slug: "diliskelesi", name: "Diliskelesi", type: "neighborhood", parent: "dilovasi", priority: 1 },
  { slug: "tavsancil", name: "Tavşancıl", type: "neighborhood", parent: "dilovasi", priority: 1 },
];

export function getRegionBySlug(slug: string): RegionDef | undefined {
  return [...ALL_DISTRICTS, ...NEIGHBORHOODS].find((r) => r.slug === slug);
}

export function getNeighborhoodsForDistrict(districtSlug: string) {
  return NEIGHBORHOODS.filter((n) => n.parent === districtSlug);
}
