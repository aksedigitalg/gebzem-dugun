/**
 * Gebzem Düğün — Seed
 * - Bölgeleri ve 36 kategoriyi oluşturur
 * - 3 örnek kullanıcı (admin / çift / firma sahibi)
 * - Her kategoriden 1 örnek firma (toplam 36) — gerçekçi Türkçe veri
 *
 * Idempotent: tekrar çalıştırılabilir, mevcut kayıtlar üzerine update etmez.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CATEGORIES } from "../src/config/categories";
import { ALL_DISTRICTS, NEIGHBORHOODS } from "../src/config/regions";

const db = new PrismaClient();

// ---------- yardımcılar ----------
function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length]!;
}
function rng(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[çÇ]/g, "c").replace(/[ğĞ]/g, "g").replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o").replace(/[şŞ]/g, "s").replace(/[üÜ]/g, "u")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ---------- gerçekçi şablon veri ----------
const districts = ["gebze", "darica", "cayirova", "dilovasi"];
const districtNames: Record<string, string> = { gebze: "Gebze", darica: "Darıca", cayirova: "Çayırova", dilovasi: "Dilovası" };

const FIRM_NAMES_BY_GROUP: Record<string, string[]> = {
  mekan: ["Bahçeli Davet", "Marmara Balo Salonu", "Lavanta Düğün Bahçesi", "Eskihisar Park", "Liman Garden", "Kuleli Konak"],
  fotograf: ["Mira Photography", "Ahşap Lens", "Sinema Story", "Görkem Foto", "Anadolu Frame", "Deniz Stüdyo"],
  organizasyon: ["Bella Organizasyon", "Atölye 41", "Sahne Düğün", "Senin Günün", "Halay Event", "Mavi Ekip"],
  kiyafet: ["Aurora Gelinlik", "Beyaz Sayfa", "Couture Marmara", "Saten Atölye", "Damatlık Park", "Romantica"],
  guzellik: ["Glow Studio", "Dilek Güzellik", "Marmara Beauty", "Inci Cilt Bakım", "Naz Makyaj", "Ela Salon"],
  davetiye: ["Mavi Mürekkep", "Atölye Davet", "Kalem Tasarım", "Pelin Davetiye", "Renk Atölyesi", "Buket Hediyelik"],
  ikram: ["Pasta Çiçeği", "Tatlı Köşe", "Marmara Catering", "Lezzet Düğün", "Sofra Mutfak", "Özel Pasta"],
  muzik: ["Ezgi Orkestra", "Marmara DJ", "Sahne Müzik", "Rüzgar Grup", "Ses Tasarım", "Festival Müzik"],
  ulasim: ["Lüks Limuzin", "Beyaz Gelin Arabası", "Marmara Klasik", "Vintage Drive", "Damat Limousine", "Şahane Otomotiv"],
  diger: ["Çiçek Sepeti", "Bal Ay Tur", "Atölye Çiçek", "Marmara Tur", "Düğün Hediyeleri", "Mira Plus"],
  "ozel-gun": ["Söz Atölye", "Kına Sahnesi", "Sünnet Şehzade", "Nişan Bahçesi", "Davet Mira", "Aile Günü"],
};

const NEIGH_BY_DISTRICT: Record<string, string[]> = {
  gebze: ["arapcesme", "barbaros", "beylikbagi", "cumhuriyet", "eskihisar", "guzeller", "hacihalil", "mustafapasa", "osmanyilmaz", "sultanorhan", "tatlikuyu", "yenikent"],
  darica: ["bayramoglu", "abdi-ipekci", "kazim-karabekir", "piri-reis"],
  cayirova: ["akse", "atatürk", "inonu", "ozgurluk"],
  dilovasi: ["diliskelesi", "tavsancil"],
};

function descriptionFor(catName: string, district: string, firmName: string): string {
  return `<p>${firmName} olarak ${district} ve çevresinde ${catName.toLowerCase()} hizmeti sunuyoruz. Hayalinizdeki günü gerçeğe dönüştürmek için profesyonel ekibimizle yanınızdayız.</p>
<p>Geniş referans listemiz, doğrulanmış müşteri yorumlarımız ve şeffaf fiyatlandırma politikamız ile Marmara Bölgesi'nin tercih edilen markalarındanız.</p>
<ul>
  <li>10+ yıllık tecrübe ve yüzlerce mutlu çift</li>
  <li>Kişiye özel paket seçenekleri</li>
  <li>Ücretsiz keşif ve ön görüşme</li>
  <li>Yerel pazarın detaylarına hakim ekip</li>
</ul>`;
}

const SERVICE_TEMPLATES: Record<string, Array<{ name: string; description: string; min: number; max: number; unit?: string; duration?: string }>> = {
  mekan: [
    { name: "Standart Düğün Paketi", description: "200 kişiye kadar masa-sandalye, ses sistemi ve dekor dahil.", min: 75000, max: 120000, unit: "etkinlik" },
    { name: "Geniş Davet Paketi", description: "300+ davetli için bahçe + salon kombine paket.", min: 130000, max: 220000, unit: "etkinlik" },
    { name: "Kına Gecesi", description: "Bohem konseptli kına salonu + dekor.", min: 25000, max: 45000, unit: "gece" },
  ],
  fotograf: [
    { name: "Düğün + Dış Çekim", description: "Sınırsız çekim + dış mekan + dijital teslim.", min: 18000, max: 35000, unit: "paket", duration: "tüm gün" },
    { name: "Nişan Çekimi", description: "1 lokasyon + 100 retuşlanmış kare + USB.", min: 6500, max: 12000, unit: "paket", duration: "3 saat" },
    { name: "Sinematik Video", description: "Drone + 2 kameraman + 5 dakikalık highlight reel.", min: 22000, max: 45000, unit: "paket" },
  ],
  organizasyon: [
    { name: "Anahtar Teslim Düğün", description: "Mekan, ikram, müzik, foto ve süsleme tek elden.", min: 200000, max: 500000, unit: "etkinlik" },
    { name: "Süsleme & Dekor", description: "Masa süslemesi, gelin masası, masa kartları, ışıklandırma.", min: 35000, max: 90000, unit: "paket" },
  ],
  kiyafet: [
    { name: "Gelinlik Kiralama", description: "Kuyruklu prenses model. Aksesuarlar dahil.", min: 8000, max: 25000, unit: "kiralama" },
    { name: "Damatlık Takım", description: "Smokin / klasik takım + aksesuar.", min: 4500, max: 12000, unit: "kiralama" },
  ],
  guzellik: [
    { name: "Gelin Saç & Makyaj", description: "Deneme + düğün günü hizmet.", min: 4500, max: 9500, unit: "paket" },
    { name: "Cilt Bakımı (öncesi)", description: "Düğün öncesi 4 seans cilt bakımı.", min: 3500, max: 8000, unit: "paket" },
  ],
  davetiye: [
    { name: "Klasik Davetiye Baskı", description: "200 adet baskı + zarf.", min: 4000, max: 9000, unit: "200 adet" },
    { name: "Lüks Tasarım Davetiye", description: "Altın yaldızlı, özel tasarım.", min: 9000, max: 22000, unit: "200 adet" },
  ],
  ikram: [
    { name: "Düğün Pastası 5 Katlı", description: "Yağlı krema, butik tasarım.", min: 3500, max: 12000, unit: "5 katlı" },
    { name: "Catering Yemek Servisi", description: "200 kişilik açık büfe veya servis.", min: 80000, max: 220000, unit: "etkinlik" },
  ],
  muzik: [
    { name: "Düğün Orkestrası", description: "5 kişilik canlı orkestra + ses sistemi.", min: 25000, max: 65000, unit: "etkinlik", duration: "4 saat" },
    { name: "DJ + Işık", description: "DJ + lazer + LED.", min: 12000, max: 30000, unit: "etkinlik" },
  ],
  ulasim: [
    { name: "Klasik Gelin Arabası", description: "Süslemeli klasik araç + şoför.", min: 5500, max: 14000, unit: "etkinlik" },
    { name: "Limuzin Kiralama", description: "Lüks Lincoln limuzin.", min: 8500, max: 22000, unit: "etkinlik" },
  ],
  diger: [
    { name: "Standart Hizmet", description: "Bu kategoride sunulan ana hizmet paketi.", min: 5000, max: 25000, unit: "paket" },
  ],
  "ozel-gun": [
    { name: "Tema Konsept Paket", description: "Mekan + dekor + servis dahil.", min: 35000, max: 95000, unit: "etkinlik" },
  ],
};

// ---------- main ----------
async function main() {
  console.log("→ Bölgeler…");
  for (const d of ALL_DISTRICTS) {
    await db.region.upsert({
      where: { slug: d.slug },
      update: {},
      create: { slug: d.slug, name: d.name, type: d.type, description: d.description ?? null },
    });
  }
  for (const n of NEIGHBORHOODS) {
    const parent = n.parent ? await db.region.findUnique({ where: { slug: n.parent } }) : null;
    await db.region.upsert({
      where: { slug: n.slug },
      update: {},
      create: { slug: n.slug, name: n.name, type: n.type, parentId: parent?.id },
    });
  }

  console.log("→ Kategoriler…");
  for (const [i, c] of CATEGORIES.entries()) {
    await db.category.upsert({
      where: { slug: c.slug },
      update: { description: c.description, icon: c.icon },
      create: {
        slug: c.slug,
        name: c.name,
        shortName: c.shortName,
        description: c.description,
        icon: c.icon,
        order: i,
      },
    });
  }

  console.log("→ Demo kullanıcılar…");
  const adminPass = await bcrypt.hash("admin12345", 12);
  await db.user.upsert({
    where: { email: "admin@gebzemdugun.com" },
    update: {},
    create: {
      email: "admin@gebzemdugun.com",
      name: "Süper Admin",
      passwordHash: adminPass,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      emailVerified: new Date(),
    },
  });

  const couplePass = await bcrypt.hash("couple12345", 12);
  await db.user.upsert({
    where: { email: "cift@example.com" },
    update: {},
    create: {
      email: "cift@example.com",
      name: "Ayşe & Mehmet",
      passwordHash: couplePass,
      role: "COUPLE",
      status: "ACTIVE",
      city: "Kocaeli",
      district: "gebze",
      partnerName: "Mehmet",
      guestCount: 250,
      budget: 250000,
      weddingDate: new Date(new Date().getFullYear() + 1, 5, 15),
    },
  });

  const firmOwnerPass = await bcrypt.hash("firma12345", 12);
  const demoFirmOwner = await db.user.upsert({
    where: { email: "firma@example.com" },
    update: {},
    create: {
      email: "firma@example.com",
      name: "Ali Demir",
      passwordHash: firmOwnerPass,
      role: "FIRM_OWNER",
      status: "ACTIVE",
    },
  });

  console.log("→ 36 örnek firma (her kategoriden 1)…");
  for (const [i, cat] of CATEGORIES.entries()) {
    const district = pick(districts, i);
    const districtName = districtNames[district]!;
    const firmTemplates = FIRM_NAMES_BY_GROUP[cat.group] ?? FIRM_NAMES_BY_GROUP.diger!;
    const baseName = pick(firmTemplates, i + cat.group.length);
    const firmName = `${baseName} ${districtName}`;
    const slug = slugify(`${baseName}-${districtName}`).slice(0, 80);

    // her firmaya ayrı bir owner kullanıcı (ya mevcut demo owner ya da unique olarak)
    const ownerEmail = `firma-${cat.slug}@gebzemdugun.com`;
    const owner = await db.user.upsert({
      where: { email: ownerEmail },
      update: {},
      create: {
        email: ownerEmail,
        name: `${firmName} Yetkilisi`,
        passwordHash: firmOwnerPass, // hepsinin parolası firma12345 (demo)
        role: "FIRM_OWNER",
        status: "ACTIVE",
      },
    });

    const dbCat = await db.category.findUnique({ where: { slug: cat.slug } });
    if (!dbCat) continue;

    const neighbourhood = pick(NEIGH_BY_DISTRICT[district] ?? [], i);

    const firm = await db.firm.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        name: firmName,
        shortDescription: `${districtName} merkezli ${cat.name.toLowerCase()} hizmeti — kaliteli, şeffaf fiyat, hızlı yanıt.`,
        description: descriptionFor(cat.name, districtName, firmName),
        founded: 2010 + (i % 14),
        phone: `+90 262 ${rng(200, 999)} ${rng(10, 99).toString().padStart(2, "0")} ${rng(10, 99).toString().padStart(2, "0")}`,
        whatsapp: `+9053${rng(0, 9)}${rng(0, 9)}${rng(0, 9)}${rng(0, 9)}${rng(0, 9)}${rng(0, 9)}${rng(0, 9)}${rng(0, 9)}`,
        email: `info@${slug.replace(/-/g, "")}.com`,
        address: `${neighbourhood ?? districtName} Mh. Cadde No:${rng(1, 99)} ${districtName}/Kocaeli`,
        city: "Kocaeli",
        district,
        neighborhood: neighbourhood ?? null,
        serviceAreas: districts,
        ownerId: owner.id,
        status: "ACTIVE",
        isVerified: i % 3 === 0,
        isFeatured: i % 5 === 0,
        membershipType: i % 7 === 0 ? "PREMIUM" : i % 4 === 0 ? "STANDARD" : "FREE",
        rating: 4 + Math.random(),
        reviewCount: rng(0, 80),
        viewCount: rng(50, 1500),
        categories: {
          create: { categoryId: dbCat.id, isPrimary: true },
        },
      },
    });

    // Hizmet ekle
    const tmpls = SERVICE_TEMPLATES[cat.group] ?? SERVICE_TEMPLATES.diger!;
    for (const [si, t] of tmpls.entries()) {
      const exists = await db.service.findFirst({ where: { firmId: firm.id, name: t.name } });
      if (!exists) {
        await db.service.create({
          data: {
            firmId: firm.id,
            name: t.name,
            description: t.description,
            priceMin: t.min,
            priceMax: t.max,
            unit: t.unit,
            duration: t.duration,
            order: si,
          },
        });
      }
    }
  }

  // Eski örnek firmaları sil ya da düzenle (varsa)
  await db.firm.deleteMany({
    where: {
      slug: { in: ["ornek-balo-salonu", "mira-photography"] },
    },
  });

  console.log("✓ Seed tamam.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
