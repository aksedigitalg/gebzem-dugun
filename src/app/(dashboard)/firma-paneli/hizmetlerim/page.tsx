import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { firmNavItems } from "../_nav";
import { ServicesManager } from "./manager";

export const metadata = { title: "Hizmetler" };
export const dynamic = "force-dynamic";

export default async function HizmetlerimPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/isletme");

  const firm = await db.firm.findFirst({
    where: {
      OR: [
        { ownerId: session.user.id },
        { staff: { some: { userId: session.user.id } } },
      ],
    },
    include: { services: { orderBy: { order: "asc" } } },
  });
  if (!firm) redirect("/firma-paneli");

  const navItems = await firmNavItems(firm.id);

  return (
    <DashboardShell
      title="Hizmetler & Paketler"
      subtitle="Çiftler firma sayfanda hangi hizmetlerin var, fiyat aralığı ne, açıkça görsün."
      navTitle="Yönetim"
      navItems={navItems}
      currentPath="/firma-paneli/hizmetlerim"
    >
      <ServicesManager firmId={firm.id} services={firm.services} />
    </DashboardShell>
  );
}
