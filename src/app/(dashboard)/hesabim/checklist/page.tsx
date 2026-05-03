import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { coupleNavItems } from "../_nav";
import { ChecklistManager } from "./manager";

export const metadata = { title: "Düğün Checklist" };
export const dynamic = "force-dynamic";

const DEFAULT_TASKS = [
  { title: "Mekan rezervasyonu yap", category: "Mekan" },
  { title: "Düğün fotoğrafçısı seç", category: "Fotoğraf" },
  { title: "Davetli listesini hazırla", category: "Davetli" },
  { title: "Davetiye tasarımı ve baskı", category: "Davetiye" },
  { title: "Gelinlik / damatlık seçimi", category: "Kıyafet" },
  { title: "Müzik / DJ ayarla", category: "Müzik" },
  { title: "Pasta sipariş et", category: "İkram" },
  { title: "Nikah memuru başvurusu", category: "Resmi" },
  { title: "Çiçek aranjmanı planla", category: "Süsleme" },
  { title: "Balayı planı yap", category: "Balayı" },
];

export default async function ChecklistPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/cift");

  let items = await db.checklistItem.findMany({
    where: { userId: session.user.id },
    orderBy: [{ completed: "asc" }, { dueDate: "asc" }, { createdAt: "asc" }],
  });

  // İlk girişte default şablonu hediye et
  if (items.length === 0) {
    await db.checklistItem.createMany({
      data: DEFAULT_TASKS.map((t, i) => ({
        userId: session.user.id,
        title: t.title,
        category: t.category,
        order: i,
      })),
    });
    items = await db.checklistItem.findMany({
      where: { userId: session.user.id },
      orderBy: [{ completed: "asc" }, { dueDate: "asc" }, { createdAt: "asc" }],
    });
  }

  const navItems = await coupleNavItems(session.user.id);

  return (
    <DashboardShell
      title="Düğün Checklist"
      subtitle="Yapılacaklar listenizi tek panelden yönetin. İlk seferde size 10 önerilen görev yüklendi."
      navTitle="Düğün Yolculuğu"
      navItems={navItems}
      currentPath="/hesabim/checklist"
    >
      <ChecklistManager items={items} />
    </DashboardShell>
  );
}
