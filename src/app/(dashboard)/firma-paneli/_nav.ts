import { db } from "@/lib/db";
import type { NavItem } from "@/components/dashboard/dashboard-shell";

export async function firmNavItems(firmId: string): Promise<NavItem[]> {
  const [unreadInquiries, unreadMessages] = await Promise.all([
    db.inquiry.count({ where: { firmId, status: { in: ["NEW", "READ"] } } }),
    db.conversation.aggregate({
      _sum: { unreadCount: true },
      where: { firmId },
    }),
  ]);

  return [
    { href: "/firma-paneli", label: "Genel Bakış", icon: "LayoutDashboard", exact: true },
    { href: "/firma-paneli/profilim", label: "Profil & Bilgiler", icon: "Building2" },
    { href: "/firma-paneli/galeri", label: "Galeri", icon: "Image" },
    { href: "/firma-paneli/hizmetlerim", label: "Hizmetler & Paketler", icon: "Tag" },
    { href: "/firma-paneli/teklifler", label: "Teklifler", icon: "Inbox", badge: unreadInquiries },
    { href: "/firma-paneli/mesajlar", label: "Mesajlar", icon: "MessageSquare", badge: unreadMessages._sum.unreadCount ?? 0 },
    { href: "/firma-paneli/yorumlar", label: "Yorumlar", icon: "Star" },
    { href: "/firma-paneli/musait-takvim", label: "Müsaitlik Takvimi", icon: "Calendar" },
    { href: "/firma-paneli/abonelik", label: "Abonelik", icon: "Crown" },
    { href: "/firma-paneli/ayarlar", label: "Ayarlar", icon: "Settings" },
  ];
}
