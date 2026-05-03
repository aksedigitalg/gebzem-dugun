import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { firmNavItems } from "../_nav";
import { ProfileForm } from "./form";
import { ALL_DISTRICTS } from "@/config/regions";

export const metadata = { title: "Profil & Bilgiler" };
export const dynamic = "force-dynamic";

export default async function ProfilimPage() {
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
    <DashboardShell
      title="Profil & Bilgiler"
      subtitle="Firma bilgilerini güncel tut — burada yapılan değişiklikler anında firma profilinde görünür."
      navTitle="Yönetim"
      navItems={navItems}
      currentPath="/firma-paneli/profilim"
    >
      <ProfileForm firm={firm} districts={ALL_DISTRICTS.map((d) => ({ slug: d.slug, name: d.name }))} />
    </DashboardShell>
  );
}
