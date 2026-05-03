import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { firmNavItems } from "../../_nav";
import { ChatThread } from "@/components/chat/chat-thread";

export const metadata = { title: "Sohbet" };
export const dynamic = "force-dynamic";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/isletme");
  const { id } = await params;

  const conv = await db.conversation.findFirst({
    where: {
      id,
      firm: {
        OR: [
          { ownerId: session.user.id },
          { staff: { some: { userId: session.user.id } } },
        ],
      },
    },
    include: {
      user: { select: { name: true, email: true } },
      firm: { select: { id: true, name: true } },
      messages: {
        where: { deletedAt: null },
        orderBy: { createdAt: "asc" },
        take: 200,
        select: { id: true, senderId: true, content: true, createdAt: true, isRead: true },
      },
    },
  });
  if (!conv) notFound();

  const navItems = await firmNavItems(conv.firm.id);

  return (
    <DashboardShell
      title={`${conv.user.name ?? conv.user.email} ile sohbet`}
      navTitle="Yönetim"
      navItems={navItems}
      currentPath="/firma-paneli/mesajlar"
    >
      <Link
        href="/firma-paneli/mesajlar"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Tüm konuşmalar
      </Link>

      <ChatThread
        conversationId={conv.id}
        messages={conv.messages}
        meId={session.user.id}
        counterpartyName={conv.user.name ?? conv.user.email}
        counterpartyInitials={(conv.user.name ?? conv.user.email).slice(0, 2).toUpperCase()}
      />
    </DashboardShell>
  );
}
