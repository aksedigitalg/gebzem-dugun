import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { coupleNavItems } from "../../_nav";
import { ChatThread } from "@/components/chat/chat-thread";

export const metadata = { title: "Sohbet" };
export const dynamic = "force-dynamic";

export default async function CoupleChatPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/cift");
  const { id } = await params;

  const conv = await db.conversation.findFirst({
    where: { id, userId: session.user.id },
    include: {
      firm: { select: { id: true, slug: true, name: true, logo: true } },
      messages: {
        where: { deletedAt: null },
        orderBy: { createdAt: "asc" },
        take: 200,
        select: { id: true, senderId: true, content: true, createdAt: true, isRead: true },
      },
    },
  });
  if (!conv) notFound();

  const navItems = await coupleNavItems(session.user.id);

  return (
    <DashboardShell
      title={conv.firm.name}
      subtitle={`Bu firma ile sohbet`}
      navTitle="Düğün Yolculuğu"
      navItems={navItems}
      currentPath="/hesabim/mesajlar"
    >
      <Link href="/hesabim/mesajlar" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" /> Tüm konuşmalar
      </Link>
      <ChatThread
        conversationId={conv.id}
        messages={conv.messages}
        meId={session.user.id}
        counterpartyName={conv.firm.name}
        counterpartyInitials={conv.firm.name.slice(0, 2).toUpperCase()}
      />
    </DashboardShell>
  );
}
