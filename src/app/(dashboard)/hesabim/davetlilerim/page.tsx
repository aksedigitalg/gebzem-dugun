import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { coupleNavItems } from "../_nav";
import { PageStub } from "@/components/dashboard/page-stub";

export const metadata = { title: "Davetlilerim" };
export const dynamic = "force-dynamic";

export default async function DavetlilerimPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/cift");
  const navItems = await coupleNavItems(session.user.id);

  return (
    <DashboardShell title="Davetlilerim" navTitle="Düğün Yolculuğu" navItems={navItems} currentPath="/hesabim/davetlilerim">
      <PageStub
        icon="Users"
        title="Davetli Listesi Yönetimi"
        description="Davetlilerinizi tek panelden yönetin. LCV durumu takibi, gelin/damat tarafı ayrımı, oturma planı ve toplu davetiye gönderimi."
        features={[
          "Excel'den içe aktarma (.xlsx)",
          "Gelin / Damat tarafı kategorilendirme",
          "LCV durumu (geliyor/gelmiyor/bekleniyor)",
          "Masa ve oturma planı düzenleyici",
          "WhatsApp / SMS toplu davet (Premium üyelik)",
        ]}
      />
    </DashboardShell>
  );
}
