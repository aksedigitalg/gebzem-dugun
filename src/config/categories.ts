export type CategoryDef = {
  slug: string;
  name: string;
  shortName?: string;
  icon: string; // lucide icon name
  group: "mekan" | "fotograf" | "organizasyon" | "kiyafet" | "guzellik" | "davetiye" | "ikram" | "muzik" | "ulasim" | "ozel-gun" | "diger";
  description: string;
};

export const CATEGORIES: CategoryDef[] = [
  // Mekan
  { slug: "dugun-mekanlari", name: "Düğün Mekanları", shortName: "Mekan", icon: "Building2", group: "mekan", description: "Salon, bahçe, kır, otel, kuleli; tüm düğün mekanları." },
  { slug: "soz-nisan-mekanlari", name: "Söz & Nişan Mekanları", shortName: "Söz & Nişan", icon: "Heart", group: "mekan", description: "Söz ve nişan organizasyonu için butik mekanlar." },
  { slug: "kina-bekarliga-veda-mekani", name: "Kına & Bekarlığa Veda Mekanı", shortName: "Kına Mekanı", icon: "Sparkles", group: "mekan", description: "Kına gecesi ve bekarlığa veda partileri için mekanlar." },
  { slug: "evlendirme-daireleri", name: "Evlendirme Daireleri", shortName: "Nikah Salonu", icon: "Landmark", group: "mekan", description: "Resmi nikah daireleri ve nikah salonları." },

  // Fotoğraf & Video
  { slug: "dugun-fotografcilari", name: "Düğün Fotoğrafçıları", shortName: "Fotoğrafçı", icon: "Camera", group: "fotograf", description: "Düğün, nişan, dış çekim fotoğrafçıları." },
  { slug: "video-cekimi", name: "Düğün Video Çekimi", shortName: "Video", icon: "Video", group: "fotograf", description: "Sinematik düğün video çekimi ve montaj." },
  { slug: "drone-cekimi", name: "Drone Çekimi", shortName: "Drone", icon: "Plane", group: "fotograf", description: "Havadan çekim ile etkileyici görüntüler." },
  { slug: "fotograf-baski-album", name: "Fotoğraf Baskı & Albüm", shortName: "Albüm", icon: "BookImage", group: "fotograf", description: "Düğün albümleri, baskı ve özel hediyelik fotoğraf." },

  // Organizasyon
  { slug: "dugun-organizasyonu", name: "Düğün Organizasyonu", shortName: "Organizasyon", icon: "PartyPopper", group: "organizasyon", description: "Anahtar teslim düğün organizasyonu ve koordinasyon." },
  { slug: "kina-organizasyonu", name: "Kına Organizasyonu", shortName: "Kına Org.", icon: "Flame", group: "organizasyon", description: "Kına gecesi süsleme ve organizasyon ekipleri." },
  { slug: "sunnet-organizasyonu", name: "Sünnet Organizasyonu", shortName: "Sünnet Org.", icon: "Crown", group: "organizasyon", description: "Sünnet düğünü ve tören organizasyonu." },
  { slug: "evlilik-teklifi", name: "Evlilik Teklifi Organizasyonu", shortName: "Evlilik Teklifi", icon: "Gem", group: "organizasyon", description: "Sürpriz evlilik teklifi senaryoları ve uygulama." },
  { slug: "host-hostes", name: "Host & Hostes", shortName: "Host", icon: "Users", group: "organizasyon", description: "Karşılama ve davet günü hostes hizmetleri." },
  { slug: "lcv-davetli-yonetimi", name: "LCV & Davetli Yönetimi", shortName: "LCV", icon: "ListChecks", group: "organizasyon", description: "Davetli takip, LCV yönetimi ve oturma planı." },
  { slug: "sunucu-mc", name: "Sunucu & MC", shortName: "Sunucu", icon: "Mic2", group: "organizasyon", description: "Düğün ve organizasyon sunucuları." },

  // Kıyafet
  { slug: "gelinlik", name: "Gelinlik", shortName: "Gelinlik", icon: "Crown", group: "kiyafet", description: "Butik gelinlik mağazaları, kiralık ve satılık." },
  { slug: "damatlik", name: "Damatlık", shortName: "Damatlık", icon: "Shirt", group: "kiyafet", description: "Damat takımları, smokin ve frak kiralama/satış." },
  { slug: "abiye-nisanlik", name: "Abiye & Nişanlık", shortName: "Abiye", icon: "Sparkles", group: "kiyafet", description: "Söz, nişan ve davet için abiye." },
  { slug: "kina-aksesuar", name: "Kına Kıyafeti & Aksesuar", shortName: "Kına Kıyafeti", icon: "Sparkle", group: "kiyafet", description: "Bindallı, kına kıyafetleri ve aksesuarlar." },
  { slug: "sunnet-kiyafeti", name: "Sünnet Kıyafeti", shortName: "Sünnet", icon: "Crown", group: "kiyafet", description: "Şehzade kıyafetleri ve sünnet aksesuarları." },
  { slug: "gelin-ayakkabisi-aksesuari", name: "Gelin Ayakkabısı & Aksesuar", shortName: "Aksesuar", icon: "Footprints", group: "kiyafet", description: "Gelinlik ayakkabısı, taç, duvak, takı." },

  // Güzellik
  { slug: "gelin-saci-makyaj", name: "Gelin Saçı & Makyaj", shortName: "Gelin Saç & Makyaj", icon: "Palette", group: "guzellik", description: "Profesyonel gelin makyajı ve saç tasarımı." },
  { slug: "guzellik-merkezleri", name: "Güzellik Merkezleri", shortName: "Güzellik", icon: "Sparkles", group: "guzellik", description: "Cilt bakımı, epilasyon, manikür, pedikür." },

  // Davetiye & Hediye
  { slug: "dugun-davetiyesi", name: "Düğün Davetiyesi", shortName: "Davetiye", icon: "Mail", group: "davetiye", description: "Klasik ve özel tasarım düğün davetiyeleri." },
  { slug: "nikah-sekeri-hediyelik", name: "Nikah Şekeri & Hediyelik", shortName: "Nikah Şekeri", icon: "Gift", group: "davetiye", description: "Davetli hediyelik ve nikah şekeri tasarımı." },
  { slug: "alyans-taki", name: "Alyans & Takı", shortName: "Alyans", icon: "Gem", group: "davetiye", description: "Alyans, söz ve nişan yüzükleri, takılar." },

  // İkram
  { slug: "dugun-pastasi", name: "Düğün Pastası", shortName: "Pasta", icon: "Cake", group: "ikram", description: "Özel tasarım düğün ve nişan pastaları." },
  { slug: "butik-pastane", name: "Butik Pastane", shortName: "Pastane", icon: "Cookie", group: "ikram", description: "Butik pastane ürünleri, cupcake, cookie bar." },
  { slug: "catering", name: "Catering", shortName: "Catering", icon: "UtensilsCrossed", group: "ikram", description: "Düğün, kokteyl ve davet ikram hizmetleri." },

  // Müzik
  { slug: "muzik-orkestra", name: "Müzik & Orkestra", shortName: "Orkestra", icon: "Music", group: "muzik", description: "Düğün orkestraları ve canlı müzik grupları." },
  { slug: "dj-ses-isik", name: "DJ & Ses Işık", shortName: "DJ", icon: "Disc3", group: "muzik", description: "DJ, ses, ışık, lazer ve sahne ekipmanları." },
  { slug: "dans-kurslari", name: "Dans Kursları", shortName: "Dans", icon: "Music2", group: "muzik", description: "Düğün ilk dansı için özel kurslar." },

  // Çiçek & Süsleme
  { slug: "cicekci-cicek-aranjmani", name: "Çiçekçi & Çiçek Aranjmanı", shortName: "Çiçek", icon: "Flower2", group: "diger", description: "Gelin buketi, masa süslemesi ve mekan çiçek tasarımı." },

  // Ulaşım
  { slug: "gelin-arabasi", name: "Gelin Arabası", shortName: "Gelin Arabası", icon: "Car", group: "ulasim", description: "Süslemeli klasik ve lüks gelin arabaları." },
  { slug: "limuzin-kiralama", name: "Limuzin Kiralama", shortName: "Limuzin", icon: "Bus", group: "ulasim", description: "Limuzin ve VIP araç kiralama." },

  // Diğer
  { slug: "balayi", name: "Balayı", shortName: "Balayı", icon: "Plane", group: "diger", description: "Yurt içi & yurt dışı balayı paketleri." },
];

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export const CATEGORY_GROUPS: Record<CategoryDef["group"], string> = {
  mekan: "Mekanlar",
  fotograf: "Fotoğraf & Video",
  organizasyon: "Organizasyon",
  kiyafet: "Kıyafet & Aksesuar",
  guzellik: "Güzellik & Bakım",
  davetiye: "Davetiye & Hediyelik",
  ikram: "Pasta & İkram",
  muzik: "Müzik & Eğlence",
  ulasim: "Ulaşım",
  "ozel-gun": "Özel Gün",
  diger: "Diğer Hizmetler",
};
