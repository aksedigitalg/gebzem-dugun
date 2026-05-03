import { db } from "@/lib/db";
import type { NavItem } from "@/components/dashboard/dashboard-shell";

export async function adminNavItems(): Promise<NavItem[]> {
  const [pendingFirms, pendingReviews] = await Promise.all([
    db.firm.count({ where: { status: "PENDING" } }),
    db.review.count({ where: { status: "PENDING" } }),
  ]);

  return [
    { href: "/admin/panel", label: "Genel Bakış", icon: "LayoutDashboard", exact: true },
    { href: "/admin/firmalar", label: "Firmalar", icon: "Building2", badge: pendingFirms },
    { href: "/admin/yorumlar", label: "Yorum Moderasyonu", icon: "Star", badge: pendingReviews },
    { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: "Users" },
    { href: "/admin/kategoriler", label: "Kategoriler", icon: "Tag" },
    { href: "/admin/blog", label: "Blog", icon: "FileText" },
    { href: "/admin/abonelikler", label: "Abonelikler", icon: "Crown" },
    { href: "/admin/audit-log", label: "Audit Log", icon: "Shield" },
    { href: "/admin/ayarlar", label: "Site Ayarları", icon: "Settings" },
  ];
}
