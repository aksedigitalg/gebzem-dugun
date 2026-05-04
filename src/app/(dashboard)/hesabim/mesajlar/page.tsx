import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { coupleNavItems } from "../_nav";
import { Badge } from "@/components/ui/badge";
import { relativeTime } from "@/lib/utils";

export const metadata = { title: "Mesajlar" };
export const dynamic = "force-dynamic";

export default async function CoupleMessagesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/cift");

  let conversations: Awaited<ReturnType<typeof db.conversation.findMany>> = [];
  try {
    conversations = await db.conversation.findMany({
      where: { userId: session.user.id },
      include: {
        firm: { select: { id: true, slug: true, name: true, logo: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: [{ lastMessageAt: "desc" }, { createdAt: "desc" }],
    });
  } catch (e) {
    console.error("[hesabim/mesajlar] conversation fetch failed:", e);
  }

  // Bozuk veri (firm cascade kaçmış) konuşmaları ele
  const safeConversations = conversations.filter(
    (c): c is typeof c & { firm: NonNullable<(typeof c)["firm"]> } => Boolean(c.firm),
  );

  let navItems: Awaited<ReturnType<typeof coupleNavItems>> = [];
  try {
    navItems = await coupleNavItems(session.user.id);
  } catch (e) {
    console.error("[hesabim/mesajlar] navItems failed:", e);
  }

  return (
    <DashboardShell
      title="Mesajlarım"
      subtitle="Firmalarla olan tüm yazışmalarınız."
      navTitle="Düğün Yolculuğu"
      navItems={navItems}
      currentPath="/hesabim/mesajlar"
    >
      {safeConversations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
          <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 font-display text-lg font-semibold">Henüz konuşma yok</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Firma profilinden "Mesaj Gönder" butonuyla iletişime geçebilirsiniz.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
          {safeConversations.map((c) => (
            <li key={c.id}>
              <Link
                href={`/hesabim/mesajlar/${c.id}`}
                className="flex items-start gap-3 px-5 py-4 transition hover:bg-muted/50"
              >
                <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-secondary/10 text-sm font-semibold text-secondary">
                  {c.firm.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate font-medium">{c.firm.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.lastMessageAt ? relativeTime(c.lastMessageAt) : "—"}
                    </p>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                    {c.messages[0]?.content ?? "(henüz mesaj yok)"}
                  </p>
                </div>
                {c.unreadCount > 0 && <Badge variant="default">{c.unreadCount}</Badge>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DashboardShell>
  );
}
