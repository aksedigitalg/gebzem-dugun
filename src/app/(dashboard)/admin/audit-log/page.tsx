import { redirect } from "next/navigation";
import { Shield } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { adminNavItems } from "../_nav";
import { Badge } from "@/components/ui/badge";
import { relativeTime } from "@/lib/utils";

export const metadata = { title: "Audit Log" };
export const dynamic = "force-dynamic";

export default async function AuditLogPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin");
  const role = session.user.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/admin");

  const logs = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: { select: { name: true, email: true } } },
  });

  const navItems = await adminNavItems();

  return (
    <DashboardShell
      title="Audit Log"
      subtitle="Tüm önemli sistem hareketleri (firma onay, profil değişiklik, mesaj, teklif…)."
      navTitle="Yönetim"
      navItems={navItems}
      currentPath="/admin/audit-log"
    >
      {logs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
          <Shield className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 font-display text-lg font-semibold">Henüz kayıt yok</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Zaman</th>
                <th className="px-4 py-3 text-left">Kullanıcı</th>
                <th className="px-4 py-3 text-left">Rol</th>
                <th className="px-4 py-3 text-left">Aksiyon</th>
                <th className="px-4 py-3 text-left">Kaynak</th>
                <th className="px-4 py-3 text-left">Durum</th>
                <th className="px-4 py-3 text-left">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-border last:border-b-0 text-xs hover:bg-muted/30">
                  <td className="px-4 py-3 text-muted-foreground">{relativeTime(l.createdAt)}</td>
                  <td className="px-4 py-3">{l.user?.name ?? l.user?.email ?? "—"}</td>
                  <td className="px-4 py-3"><Badge variant="outline">{l.actorRole ?? "—"}</Badge></td>
                  <td className="px-4 py-3 font-medium">{l.action}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {l.resource}
                    {l.resourceId && <span className="text-muted-foreground/70"> #{l.resourceId.slice(-6)}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={l.status === "SUCCESS" ? "success" : "outline"}>{l.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{l.ip ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}
