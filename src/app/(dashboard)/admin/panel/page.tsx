import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Building2, Inbox, MessageSquare, Star, Users, Crown } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell, StatCard } from "@/components/dashboard/dashboard-shell";
import { adminNavItems } from "../_nav";
import { Badge } from "@/components/ui/badge";
import { relativeTime } from "@/lib/utils";

export const metadata = { title: "Admin Paneli" };
export const dynamic = "force-dynamic";

export default async function AdminPanelPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin");
  const role = session.user.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/admin");

  const [
    totalFirms,
    pendingFirms,
    activeFirms,
    totalUsers,
    totalInquiries,
    pendingReviews,
    recentFirms,
    recentInquiries,
    recentAudit,
  ] = await Promise.all([
    db.firm.count(),
    db.firm.count({ where: { status: "PENDING" } }),
    db.firm.count({ where: { status: "ACTIVE" } }),
    db.user.count(),
    db.inquiry.count(),
    db.review.count({ where: { status: "PENDING" } }),
    db.firm.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        slug: true,
        name: true,
        district: true,
        status: true,
        createdAt: true,
        membershipType: true,
      },
    }),
    db.inquiry.findMany({
      include: {
        firm: { select: { name: true, slug: true } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const navItems = await adminNavItems();

  return (
    <DashboardShell
      title="Yönetim Paneli"
      subtitle="Platform sağlık özeti — anomalileri yakala, hızlı müdahale et."
      navTitle="Yönetim"
      navItems={navItems}
      currentPath="/admin/panel"
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Toplam Firma" value={totalFirms} hint={`${activeFirms} aktif`} icon="Building2" accent="primary" />
        <StatCard label="Onay Bekleyen" value={pendingFirms} icon="Clock" accent="amber" />
        <StatCard label="Toplam Kullanıcı" value={totalUsers} icon="Users" accent="emerald" />
        <StatCard label="Bekleyen Yorum" value={pendingReviews} icon="Star" accent="secondary" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-semibold">Yeni Firmalar</h2>
            <Link href="/admin/firmalar" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              Tümü <ArrowUpRight className="h-3 w-3" />
            </Link>
          </header>
          <ul className="divide-y divide-border">
            {recentFirms.map((f) => (
              <li key={f.id}>
                <Link href={`/admin/firmalar/${f.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-muted/40">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{f.name}</p>
                    <p className="text-[11px] text-muted-foreground">{f.district} · {relativeTime(f.createdAt)}</p>
                  </div>
                  <Badge variant={f.status === "PENDING" ? "warning" : f.status === "ACTIVE" ? "success" : "outline"}>
                    {f.status}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-semibold">Son Teklifler</h2>
            <span className="text-xs text-muted-foreground">{totalInquiries} toplam</span>
          </header>
          <ul className="divide-y divide-border">
            {recentInquiries.map((q) => (
              <li key={q.id} className="px-5 py-3">
                <p className="text-sm">
                  <strong>{q.user.name ?? q.contactEmail}</strong> →{" "}
                  <Link href={`/firma/${q.firm.slug}`} className="text-primary hover:underline">
                    {q.firm.name}
                  </Link>
                </p>
                <p className="text-[11px] text-muted-foreground">{relativeTime(q.createdAt)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card lg:col-span-2">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-semibold">Audit Log (Son 8 hareket)</h2>
            <Link href="/admin/audit-log" className="text-xs text-primary hover:underline">Tümü →</Link>
          </header>
          <ul className="divide-y divide-border">
            {recentAudit.map((a) => (
              <li key={a.id} className="px-5 py-3 text-sm">
                <p>
                  <strong>{a.user?.name ?? a.user?.email ?? "(sistem)"}</strong>
                  <span className="text-muted-foreground"> · {a.action} </span>
                  <span className="text-foreground">{a.resource}</span>
                  {a.resourceId && <span className="text-muted-foreground"> #{a.resourceId.slice(-6)}</span>}
                </p>
                <p className="text-[11px] text-muted-foreground">{relativeTime(a.createdAt)} · {a.actorRole ?? "—"}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DashboardShell>
  );
}
