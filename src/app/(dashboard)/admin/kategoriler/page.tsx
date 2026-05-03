import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { adminNavItems } from "../_nav";

export const metadata = { title: "Kategoriler" };
export const dynamic = "force-dynamic";

export default async function AdminKategorilerPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin");
  const role = session.user.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/admin");

  const cats = await db.category.findMany({
    include: { _count: { select: { firms: true } } },
    orderBy: { order: "asc" },
  });
  const navItems = await adminNavItems();

  return (
    <DashboardShell title="Kategoriler" subtitle={`${cats.length} kategori tanımlı`} navTitle="Yönetim" navItems={navItems} currentPath="/admin/kategoriler">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {cats.map((c) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{c.shortName ?? "—"}</p>
            <p className="mt-1 font-medium">{c.name}</p>
            <p className="mt-2 text-xs text-muted-foreground">{c._count.firms} firma</p>
          </div>
        ))}
      </div>
      <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>ℹ️ Not:</strong> Kategoriler `src/config/categories.ts`'den seed ile yüklenir. CRUD UI v0.6'da gelecek.
      </p>
    </DashboardShell>
  );
}
