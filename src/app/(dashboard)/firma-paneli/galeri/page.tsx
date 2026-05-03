import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { firmNavItems } from "../_nav";
import { GalleryManager } from "./manager";

export const metadata = { title: "Galeri" };
export const dynamic = "force-dynamic";

export default async function GaleriPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/isletme");

  const firm = await db.firm.findFirst({
    where: {
      OR: [
        { ownerId: session.user.id },
        { staff: { some: { userId: session.user.id } } },
      ],
    },
    include: { gallery: { orderBy: { order: "asc" } } },
  });
  if (!firm) redirect("/firma-paneli");

  const navItems = await firmNavItems(firm.id);

  return (
    <DashboardShell
      title="Galeri Yönetimi"
      subtitle="Çiftlerin ilk göreceği görseller — kaliteli fotoğraflar dönüşümü ciddi yükseltir."
      navTitle="Yönetim"
      navItems={navItems}
      currentPath="/firma-paneli/galeri"
    >
      <GalleryManager firmId={firm.id} firmSlug={firm.slug} items={firm.gallery} />
    </DashboardShell>
  );
}
