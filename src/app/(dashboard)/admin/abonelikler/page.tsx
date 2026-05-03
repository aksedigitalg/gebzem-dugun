import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { adminNavItems } from "../_nav";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Abonelikler" };
export const dynamic = "force-dynamic";

export default async function AdminAboneliklerPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin");
  const role = session.user.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/admin");

  const counts = await db.firm.groupBy({
    by: ["membershipType"],
    _count: true,
    orderBy: { membershipType: "asc" },
  });

  const navItems = await adminNavItems();

  return (
    <DashboardShell title="Abonelikler" subtitle="Firma üyelik dağılımı." navTitle="Yönetim" navItems={navItems} currentPath="/admin/abonelikler">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {counts.map((c) => (
          <div key={c.membershipType} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.membershipType}</p>
            <p className="mt-1 font-display text-3xl font-bold">{c._count}</p>
            <p className="mt-1 text-xs text-muted-foreground">firma</p>
          </div>
        ))}
      </div>
      <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>ℹ️ Yakında:</strong> Aktif abonelik listesi, ödeme geçmişi, otomatik yenileme yönetimi (Subscription tablosu üzerinden).
      </p>
    </DashboardShell>
  );
}
