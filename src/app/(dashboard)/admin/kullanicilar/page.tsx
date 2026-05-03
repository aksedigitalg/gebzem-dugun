import { redirect } from "next/navigation";
import { Search, Users } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { adminNavItems } from "../_nav";
import { Badge } from "@/components/ui/badge";
import { relativeTime } from "@/lib/utils";

export const metadata = { title: "Kullanıcılar" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; q?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin");
  const role = session.user.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/admin");

  const sp = await searchParams;
  const where = {
    ...(sp.role ? { role: sp.role as never } : {}),
    ...(sp.q
      ? {
          OR: [
            { name: { contains: sp.q, mode: "insensitive" as const } },
            { email: { contains: sp.q, mode: "insensitive" as const } },
            { phone: { contains: sp.q } },
          ],
        }
      : {}),
  };

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      include: { _count: { select: { ownedFirms: true, reviews: true, inquiries: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.user.count({ where }),
  ]);

  const navItems = await adminNavItems();

  return (
    <DashboardShell title="Kullanıcılar" subtitle={`${total} kullanıcı`} navTitle="Yönetim" navItems={navItems} currentPath="/admin/kullanicilar">
      <form method="GET" className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="Ad, e-posta, telefon…"
            className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm"
          />
        </div>
        <select
          name="role"
          defaultValue={sp.role ?? ""}
          className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
        >
          <option value="">Tüm Roller</option>
          <option value="COUPLE">Çift</option>
          <option value="FIRM_OWNER">Firma Sahibi</option>
          <option value="FIRM_STAFF">Firma Ekibi</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Süper Admin</option>
        </select>
        <button type="submit" className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">Filtrele</button>
      </form>

      {users.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center text-sm text-muted-foreground">
          Eşleşen kullanıcı yok.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Kullanıcı</th>
                <th className="px-4 py-3 text-left">Rol</th>
                <th className="px-4 py-3 text-left">Durum</th>
                <th className="px-4 py-3 text-right">Firma</th>
                <th className="px-4 py-3 text-right">Yorum</th>
                <th className="px-4 py-3 text-right">Teklif</th>
                <th className="px-4 py-3 text-right">Üyelik</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.name ?? "(İsim yok)"}</p>
                    <p className="text-[11px] text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="px-4 py-3"><Badge variant="outline">{u.role}</Badge></td>
                  <td className="px-4 py-3">
                    <Badge variant={u.status === "ACTIVE" ? "success" : u.status === "PENDING" ? "warning" : "outline"}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">{u._count.ownedFirms}</td>
                  <td className="px-4 py-3 text-right">{u._count.reviews}</td>
                  <td className="px-4 py-3 text-right">{u._count.inquiries}</td>
                  <td className="px-4 py-3 text-right text-[11px] text-muted-foreground">{relativeTime(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}
