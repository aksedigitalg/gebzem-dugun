import { redirect } from "next/navigation";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { coupleNavItems } from "../_nav";
import { markAllNotificationsReadAction } from "@/lib/actions/notification";
import { relativeTime } from "@/lib/utils";

export const metadata = { title: "Bildirimler" };
export const dynamic = "force-dynamic";

export default async function BildirimlerPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/cift");

  const items = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const navItems = await coupleNavItems(session.user.id);

  return (
    <DashboardShell
      title="Bildirimler"
      navTitle="Düğün Yolculuğu"
      navItems={navItems}
      currentPath="/hesabim/bildirimler"
      actions={
        items.some((n) => !n.isRead) ? (
          <form action={markAllNotificationsReadAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:border-primary"
            >
              <CheckCheck className="h-3 w-3" /> Hepsini okundu işaretle
            </button>
          </form>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
          <Bell className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 font-display text-lg font-semibold">Henüz bildirim yok</p>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
          {items.map((n) => {
            const Wrapper = n.link ? Link : "div";
            return (
              <li key={n.id}>
                <Wrapper
                  href={n.link as never}
                  className={`flex items-start gap-3 px-5 py-4 ${!n.isRead ? "bg-primary/5" : ""} transition hover:bg-muted/50`}
                >
                  <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${!n.isRead ? "bg-primary" : "bg-muted"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{relativeTime(n.createdAt)}</p>
                  </div>
                </Wrapper>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardShell>
  );
}
