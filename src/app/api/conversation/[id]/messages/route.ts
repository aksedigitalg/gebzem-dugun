import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireConversationAccess, ForbiddenError, NotFoundError } from "@/lib/auth-guards";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await requireConversationAccess(id);
    const messages = await db.message.findMany({
      where: { conversationId: id, deletedAt: null },
      orderBy: { createdAt: "asc" },
      take: 200,
      select: {
        id: true,
        senderId: true,
        content: true,
        createdAt: true,
        isRead: true,
      },
    });
    return NextResponse.json({ messages }, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    if (err instanceof NotFoundError) return NextResponse.json({ error: "not found" }, { status: 404 });
    if (err instanceof ForbiddenError) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
