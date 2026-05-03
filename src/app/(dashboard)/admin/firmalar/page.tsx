import Link from "next/link";
import { redirect } from "next/navigation";
import { Search } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { adminNavItems } from "../_nav";
import { Badge } from "@/components/ui/badge";
import { ALL_DISTRICTS } from "@/config/regions";
import { relativeTime } from "@/lib/utils";

export const metadata = { title: "Firmalar" };
export const dynamic = "force-dynamic";

export default async function AdminFirmsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; district?: string; q?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin");
  const role = session.user.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/admin");

  const sp = await searchParams;
  const where = {
    ...(sp.status ? { status: sp.status as never } : {}),
    ...(sp.district ? { district: sp.district } : {}),
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

  const [firms, total] = await Promise.all([
    db.firm.findMany({
      where,
      include: {
        owner: { select: { name: true, email: true } },
        _count: { select: { inquiries: true, reviews: true } },
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 50,
    }),
    db.firm.count({ where }),
  ]);

  const navItems = await adminNavItems();

  return (
    <DashboardShell
      title="Firma Yönetimi"
      subtitle={`${total} firma`}
      navTitle="Yönetim"
      navItems={navItems}
      currentPath="/admin/firmalar"
    >
      {/* Filters */}
      <form method="GET" className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="Firma adı, e-posta, telefon…"
            className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm"
          />
        </div>
        <select
          name="status"
          defaultValue={sp.status ?? ""}
          className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
        >
          <option value="">Tüm Durumlar</option>
          <option value="PENDING">Onay Bekliyor</option>
          <option value="ACTIVE">Aktif</option>
          <option value="PAUSED">Duraklatıldı</option>
          <option value="SUSPENDED">Askıda</option>
          <option value="REJECTED">Reddedildi</option>
        </select>
        <select
          name="district"
          defaultValue={sp.district ?? ""}
          className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
        >
          <option value="">Tüm İlçeler</option>
          {ALL_DISTRICTS.map((d) => (
            <option key={d.slug} value={d.slug}>{d.name}</option>
          ))}
        </select>
        <button type="submit" className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
          Filtrele
        </button>
      </form>

      {firms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center text-sm text-muted-foreground">
          Eşleşen firma yok.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Firma</th>
                <th className="px-4 py-3 text-left">İlçe</th>
                <th className="px-4 py-3 text-left">Sahip</th>
                <th className="px-4 py-3 text-left">Durum</th>
                <th className="px-4 py-3 text-right">Talep</th>
                <th className="px-4 py-3 text-right">Yorum</th>
                <th className="px-4 py-3 text-right">Üyelik</th>
                <th className="px-4 py-3 text-right">Eklendi</th>
              </tr>
            </thead>
            <tbody>
              {firms.map((f) => (
                <tr key={f.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link href={`/admin/firmalar/${f.id}`} className="font-medium hover:text-primary">
                      {f.name}
                    </Link>
                    <p className="text-[11px] text-muted-foreground">{f.email}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{f.district}</td>
                  <td className="px-4 py-3 text-muted-foreground">{f.owner.name ?? f.owner.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={f.status === "ACTIVE" ? "success" : f.status === "PENDING" ? "warning" : "outline"}>
                      {f.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">{f._count.inquiries}</td>
                  <td className="px-4 py-3 text-right">{f._count.reviews}</td>
                  <td className="px-4 py-3 text-right">
                    <Badge variant={f.membershipType === "FREE" ? "outline" : "premium"}>{f.membershipType}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-[11px] text-muted-foreground">{relativeTime(f.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}
