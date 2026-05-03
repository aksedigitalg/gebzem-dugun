import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CATEGORIES } from "../src/config/categories";
import { ALL_DISTRICTS, NEIGHBORHOODS } from "../src/config/regions";

const db = new PrismaClient();

async function main() {
  console.log("→ Seeding regions…");
  for (const d of ALL_DISTRICTS) {
    await db.region.upsert({
      where: { slug: d.slug },
      update: {},
      create: { slug: d.slug, name: d.name, type: d.type, description: d.description },
    });
  }
  for (const n of NEIGHBORHOODS) {
    const parent = n.parent
      ? await db.region.findUnique({ where: { slug: n.parent } })
      : null;
    await db.region.upsert({
      where: { slug: n.slug },
      update: {},
      create: {
        slug: n.slug,
        name: n.name,
        type: n.type,
        parentId: parent?.id,
      },
    });
  }

  console.log("→ Seeding categories…");
  for (const [i, c] of CATEGORIES.entries()) {
    await db.category.upsert({
      where: { slug: c.slug },
      update: {},
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

  console.log("→ Creating super admin…");
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

  console.log("→ Creating sample couple…");
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

  console.log("→ Creating sample firm owner & firm…");
  const firmPass = await bcrypt.hash("firma12345", 12);
  const firmOwner = await db.user.upsert({
    where: { email: "firma@example.com" },
    update: {},
    create: {
      email: "firma@example.com",
      name: "Ali Demir",
      passwordHash: firmPass,
      role: "FIRM_OWNER",
      status: "ACTIVE",
    },
  });

  const dmCat = await db.category.findUnique({ where: { slug: "dugun-mekanlari" } });
  const fotoCat = await db.category.findUnique({ where: { slug: "dugun-fotografcilari" } });

  await db.firm.upsert({
    where: { slug: "ornek-balo-salonu" },
    update: {},
    create: {
      slug: "ornek-balo-salonu",
      name: "Örnek Balo Salonu",
      shortDescription:
        "Gebze'nin merkezinde 500 kişilik kapasitesiyle modern düğün salonu — havuzlu bahçe ve VIP gelin odası.",
      description:
        "Örnek Balo Salonu olarak Gebze'nin tam merkezinde, 500 kişiye kadar kapasiteli salonumuzda düğün, nişan, kına ve özel davetlerinizi unutulmaz kılıyoruz. Dış cephesiyle modern, içeride klasik şıklığı yakalayan dekorasyonu, geniş havuzlu bahçesi ve özel ışıklandırma sistemiyle her bütçeye uygun paketler sunuyoruz.",
      phone: "+90 262 000 00 00",
      whatsapp: "+905000000000",
      email: "info@ornekbalosalonu.com",
      address: "Hacıhalil Mh., Atatürk Cd. No:1, Gebze",
      city: "Kocaeli",
      district: "gebze",
      neighborhood: "hacihalil",
      serviceAreas: ["gebze", "darica", "cayirova", "dilovasi"],
      logo: "https://images.unsplash.com/photo-1519741497674-611481863552?w=200&q=80",
      coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
      ownerId: firmOwner.id,
      membershipType: "PREMIUM",
      isVerified: true,
      isFeatured: true,
      status: "ACTIVE",
      rating: 4.9,
      reviewCount: 127,
      categories: dmCat
        ? { create: { categoryId: dmCat.id, isPrimary: true } }
        : undefined,
    },
  });

  await db.firm.upsert({
    where: { slug: "mira-photography" },
    update: {},
    create: {
      slug: "mira-photography",
      name: "Mira Photography",
      shortDescription: "Sinematik düğün fotoğrafçılığı, dış çekim ve drone — Darıca merkezli stüdyo.",
      description:
        "Mira Photography olarak 8 yıllık tecrübemizle düğün, nişan, dış çekim ve drone hizmetlerini bir arada sunuyoruz. Sinematik tarzımız ve hızlı teslimatımızla Darıca'nın tercih edilen stüdyosuyuz.",
      phone: "+90 262 000 00 01",
      email: "info@mira.studio",
      address: "Bayramoğlu Mh., Sahil Cd. No:10, Darıca",
      city: "Kocaeli",
      district: "darica",
      neighborhood: "bayramoglu",
      serviceAreas: ["darica", "gebze", "tuzla"],
      coverImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80",
      ownerId: firmOwner.id,
      membershipType: "STANDARD",
      isVerified: true,
      status: "ACTIVE",
      rating: 4.8,
      reviewCount: 84,
      categories: fotoCat
        ? { create: { categoryId: fotoCat.id, isPrimary: true } }
        : undefined,
    },
  });

  console.log("✓ Seed tamamlandı.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
