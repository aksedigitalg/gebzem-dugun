import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Calendar, Heart, Inbox, MessageSquare } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell, StatCard } from "@/components/dashboard/dashboard-shell";
import { coupleNavItems } from "./_nav";
import { Badge } from "@/components/ui/badge";
import { relativeTime, formatDate } from "@/lib/utils";

export const metadata = { title: "Hesabım" };
export const dynamic = "force-dynamic";

export default async function HesabimPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/cift");

  const [user, inquiriesCount, conversationsCount, favoritesCount, recentInquiries, recentMessages] = await Promise.all([
    db.user.findUnique({ where: { id: session.user.id } }),
    db.inquiry.count({ where: { userId: session.user.id } }),
    db.conversation.count({ where: { userId: session.user.id } }),
    db.favorite.count({ where: { userId: session.user.id } }),
    db.inquiry.findMany({
      where: { userId: session.user.id },
      include: { firm: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.conversation.findMany({
      where: { userId: session.user.id, lastMessageAt: { not: null } },
      include: {
        firm: { select: { name: true, slug: true, logo: true } },
        messages: { take: 1, orderBy: { createdAt: "desc" } },
      },
      orderBy: { lastMessageAt: "desc" },
      take: 5,
    }),
  ]);

  const navItems = await coupleNavItems(session.user.id);
  const daysToWedding = user?.weddingDate
    ? Math.ceil((new Date(user.weddingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <DashboardShell
      title={`Merhaba ${user?.name?.split(" ")[0] ?? "👋"}`}
      subtitle={
        user?.weddingDate
          ? `Düğününüze ${daysToWedding && daysToWedding > 0 ? `${daysToWedding} gün` : "bugün"} kaldı! 💍`
          : "Düğün hazırlığını buradan yönetin."
      }
      navTitle="Düğün Yolculuğu"
      navItems={navItems}
      currentPath="/hesabim"
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Tekliflerim" value={inquiriesCount} icon="Inbox" accent="primary" />
        <StatCard label="Mesajlarım" value={conversationsCount} icon="MessageSquare" accent="emerald" />
        <StatCard label="Favorilerim" value={favoritesCount} icon="Heart" accent="amber" />
        <StatCard
          label="Düğün tarihi"
          value={user?.weddingDate ? formatDate(user.weddingDate, { day: "numeric", month: "short", year: "numeric" }) : "—"}
          icon="Calendar"
          accent="secondary"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-semibold">Son Teklif Yanıtları</h2>
            <Link href="/hesabim/tekliflerim" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              Tümü <ArrowUpRight className="h-3 w-3" />
            </Link>
          </header>
          {recentInquiries.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              Henüz teklif istemediniz. Bir firmaya gidip{" "}
              <Link href="/" className="text-primary hover:underline">teklif iste</Link>.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recentInquiries.map((q) => (
                <li key={q.id} className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <Link href={`/firma/${q.firm.slug}`} className="font-medium hover:text-primary">
                      {q.firm.name}
                    </Link>
                    <Badge variant={q.status === "RESPONDED" ? "success" : "warning"}>
                      {q.status === "NEW" ? "Bekliyor" : q.status === "RESPONDED" ? "Yanıt Var" : q.status}
                    </Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{q.firmResponse ?? q.message}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{relativeTime(q.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-semibold">Son Mesajlar</h2>
            <Link href="/hesabim/mesajlar" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              Tümü <ArrowUpRight className="h-3 w-3" />
            </Link>
          </header>
          {recentMessages.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">Henüz mesaj yok.</div>
          ) : (
            <ul className="divide-y divide-border">
              {recentMessages.map((c) => (
                <li key={c.id}>
                  <Link href={`/hesabim/mesajlar/${c.id}`} className="flex items-start gap-3 px-5 py-4 transition hover:bg-muted/50">
                    <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-secondary/10 text-xs font-semibold text-secondary">
                      {c.firm.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate font-medium">{c.firm.name}</p>
                        {c.unreadCount > 0 && <Badge variant="default">{c.unreadCount}</Badge>}
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {c.messages[0]?.content ?? "—"}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}
