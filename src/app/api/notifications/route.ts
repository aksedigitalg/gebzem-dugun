import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }

  const items = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      kind: true,
      title: true,
      body: true,
      link: true,
      isRead: true,
      createdAt: true,
    },
  });

  const unread = items.filter((n) => !n.isRead).length;
  return NextResponse.json({ items, unread }, { status: 200, headers: { "Cache-Control": "no-store" } });
}
