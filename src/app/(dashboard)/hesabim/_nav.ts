import { db } from "@/lib/db";
import type { NavItem } from "@/components/dashboard/dashboard-shell";

export async function coupleNavItems(userId: string): Promise<NavItem[]> {
  const [pendingInquiries, unreadMessages, unreadNotifications] = await Promise.all([
    db.inquiry.count({ where: { userId, status: { in: ["NEW", "READ", "RESPONDED"] } } }),
    db.conversation.aggregate({
      _sum: { unreadCount: true },
      where: { userId },
    }),
    db.notification.count({ where: { userId, isRead: false } }),
  ]);

  return [
    { href: "/hesabim", label: "Genel Bakış", icon: "LayoutDashboard", exact: true },
    { href: "/hesabim/tekliflerim", label: "Tekliflerim", icon: "Inbox", badge: pendingInquiries },
    { href: "/hesabim/mesajlar", label: "Mesajlar", icon: "MessageSquare", badge: unreadMessages._sum.unreadCount ?? 0 },
    { href: "/hesabim/favorilerim", label: "Favorilerim", icon: "Heart" },
    { href: "/hesabim/bildirimler", label: "Bildirimler", icon: "Bell", badge: unreadNotifications },
    { href: "/hesabim/dugun-detaylari", label: "Düğün Detayları", icon: "Calendar" },
    { href: "/hesabim/butcem", label: "Bütçem", icon: "Wallet" },
    { href: "/hesabim/davetlilerim", label: "Davetlilerim", icon: "Users" },
    { href: "/hesabim/checklist", label: "Checklist", icon: "ListChecks" },
    { href: "/hesabim/ayarlar", label: "Ayarlar", icon: "Settings" },
  ];
}
