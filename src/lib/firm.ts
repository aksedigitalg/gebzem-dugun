import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

/** Public firm card — kategori listeleme/öne çıkanlar için minimum alan seti */
export const firmCardSelect = {
  id: true,
  slug: true,
  name: true,
  shortDescription: true,
  city: true,
  district: true,
  neighborhood: true,
  logo: true,
  coverImage: true,
  rating: true,
  reviewCount: true,
  isVerified: true,
  isFeatured: true,
  membershipType: true,
  categories: {
    select: { isPrimary: true, category: { select: { slug: true, name: true } } },
  },
} satisfies Prisma.FirmSelect;

export type FirmCard = Prisma.FirmGetPayload<{ select: typeof firmCardSelect }>;

/** Firma sıralama kuralı: önce featured, sonra premium, sonra rating, sonra reviewCount */
export const firmListOrder: Prisma.FirmOrderByWithRelationInput[] = [
  { isFeatured: "desc" },
  { membershipType: "desc" }, // PRO/PREMIUM enum sırasıyla üstte
  { rating: "desc" },
  { reviewCount: "desc" },
  { createdAt: "desc" },
];

export const ACTIVE_FIRM_FILTER: Prisma.FirmWhereInput = {
  status: "ACTIVE",
};

export async function getFirmsByCategory(
  categorySlug: string,
  opts: { district?: string; take?: number; skip?: number } = {},
): Promise<{ items: FirmCard[]; total: number }> {
  const where: Prisma.FirmWhereInput = {
    ...ACTIVE_FIRM_FILTER,
    categories: { some: { category: { slug: categorySlug } } },
    ...(opts.district ? { district: opts.district } : {}),
  };

  const [items, total] = await Promise.all([
    db.firm.findMany({
      where,
      select: firmCardSelect,
      orderBy: firmListOrder,
      take: opts.take ?? 24,
      skip: opts.skip ?? 0,
    }),
    db.firm.count({ where }),
  ]);

  return { items, total };
}

export async function getFirmsByDistrict(
  districtSlug: string,
  opts: { take?: number } = {},
): Promise<FirmCard[]> {
  return db.firm.findMany({
    where: {
      ...ACTIVE_FIRM_FILTER,
      OR: [
        { district: districtSlug },
        { serviceAreas: { has: districtSlug } },
      ],
    },
    select: firmCardSelect,
    orderBy: firmListOrder,
    take: opts.take ?? 24,
  });
}

export async function getFeaturedFirms(take = 8): Promise<FirmCard[]> {
  return db.firm.findMany({
    where: { ...ACTIVE_FIRM_FILTER, isFeatured: true },
    select: firmCardSelect,
    orderBy: firmListOrder,
    take,
  });
}

export async function getFirmBySlug(slug: string) {
  return db.firm.findFirst({
    where: { slug, status: "ACTIVE" },
    include: {
      categories: { include: { category: true } },
      gallery: { orderBy: { order: "asc" } },
      videos: true,
      services: { orderBy: { order: "asc" } },
      packages: { orderBy: { order: "asc" } },
      faqs: { orderBy: { order: "asc" } },
      reviews: {
        where: { status: "APPROVED" },
        include: {
          user: { select: { name: true, image: true } },
          photos: true,
        },
        orderBy: { createdAt: "desc" },
        take: 12,
      },
      announcements: {
        where: { isActive: true, endDate: { gte: new Date() } },
      },
      owner: { select: { id: true, name: true, image: true } },
      _count: { select: { reviews: true, favorites: true } },
    },
  });
}

export type FirmDetail = NonNullable<Awaited<ReturnType<typeof getFirmBySlug>>>;
