import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { firmNavItems } from "../_nav";
import { PageStub } from "@/components/dashboard/page-stub";

export const metadata = { title: "Müsaitlik Takvimi" };
export const dynamic = "force-dynamic";

export default async function MusaitTakvimPage() {
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
    <DashboardShell title="Müsaitlik Takvimi" navTitle="Yönetim" navItems={navItems} currentPath="/firma-paneli/musait-takvim">
      <PageStub
        icon="Calendar"
        title="Doluluk Takvimi"
        description="Tarih bazlı rezervasyon yönetimi — çiftler firma profilinden 'bu tarih müsait mi?' kontrolünü canlı yapabilecek."
        features={[
          "Tarih tıklayarak hızlı bloklama",
          "Geçici (24 saat HOLD) ve Onaylı rezervasyon",
          "Çakışma uyarıları",
          "Toplu tarih bloklama (tatil, bakım)",
          "Çiftin görebileceği müsaitlik widget'ı",
        ]}
      />
    </DashboardShell>
  );
}
