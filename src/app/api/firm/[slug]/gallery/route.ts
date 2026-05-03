import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ items: [] }, { status: 401 });

  const firm = await db.firm.findFirst({
    where: {
      slug,
      OR: [
        { ownerId: session.user.id },
        { staff: { some: { userId: session.user.id } } },
        // admin ALL
        ...(session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN" ? [{}] : []),
      ],
    },
    include: { gallery: { orderBy: { order: "asc" } } },
  });
  if (!firm) return NextResponse.json({ items: [] }, { status: 404 });
  return NextResponse.json({ items: firm.gallery }, { status: 200, headers: { "Cache-Control": "no-store" } });
}
