import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { firmNavItems } from "../_nav";
import { PageStub } from "@/components/dashboard/page-stub";

export const metadata = { title: "Ayarlar" };
export const dynamic = "force-dynamic";

export default async function FirmAyarlarPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/isletme");

  const firm = await db.firm.findFirst({
    where: {
      OR: [
        { ownerId: session.user.id },
        { staff: { some: { userId: session.user.id } } },
      ],
    },
  });
  if (!firm) redirect("/firma-paneli");
  const navItems = await firmNavItems(firm.id);

  return (
    <DashboardShell title="Ayarlar" navTitle="Yönetim" navItems={navItems} currentPath="/firma-paneli/ayarlar">
      <PageStub
        icon="Settings"
        title="Firma Ayarları"
        description="Bildirim tercihleri, ekip yönetimi, çalışma saatleri ve gelişmiş seçenekler — yakında."
        features={[
          "E-posta / SMS / Push bildirim tercihleri",
          "Ekip üyesi davet ve rol yönetimi (PRO)",
          "Çalışma saatleri ve tatil günleri",
          "Otomatik yanıt şablonları",
          "Veri dışa aktarma (KVKK)",
        ]}
        ctaHref="/firma-paneli/profilim"
        ctaLabel="Şimdilik Profilim'i Düzenle"
      />
    </DashboardShell>
  );
}
