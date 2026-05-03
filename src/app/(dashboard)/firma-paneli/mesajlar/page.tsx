import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { firmNavItems } from "../_nav";
import { Badge } from "@/components/ui/badge";
import { relativeTime } from "@/lib/utils";

export const metadata = { title: "Mesajlar" };
export const dynamic = "force-dynamic";

export default async function MesajlarPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/isletme");

  const firm = await db.firm.findFirst({
    where: {
      OR: [
        { ownerId: session.user.id },
        { staff: { some: { userId: session.user.id } } },
      ],
    },
  });
  if (!firm) redirect("/firma-paneli");

  const conversations = await db.conversation.findMany({
    where: { firmId: firm.id },
    include: {
      user: { select: { name: true, email: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: [{ lastMessageAt: "desc" }, { createdAt: "desc" }],
  });

  const navItems = await firmNavItems(firm.id);

  return (
    <DashboardShell
      title="Mesajlar"
      subtitle="Çiftlerle olan tüm konuşmalar — hızlı yanıt premium rozeti için kritik."
      navTitle="Yönetim"
      navItems={navItems}
      currentPath="/firma-paneli/mesajlar"
    >
      {conversations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
          <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 font-display text-lg font-semibold">Henüz mesaj yok</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Çiftler firma sayfasından "Mesaj Gönder" tıkladığında burada görünecek.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
          {conversations.map((c) => (
            <li key={c.id}>
              <Link
                href={`/firma-paneli/mesajlar/${c.id}`}
                className="flex items-start gap-3 px-5 py-4 transition hover:bg-muted/50"
              >
                <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {(c.user.name ?? c.user.email).slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate font-medium">{c.user.name ?? c.user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.lastMessageAt ? relativeTime(c.lastMessageAt) : "—"}
                    </p>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                    {c.messages[0]?.content ?? "(henüz mesaj yok)"}
                  </p>
                </div>
                {c.unreadCount > 0 && (
                  <Badge variant="default">{c.unreadCount}</Badge>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DashboardShell>
  );
}
