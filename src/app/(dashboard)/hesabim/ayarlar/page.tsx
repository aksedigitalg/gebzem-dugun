import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { coupleNavItems } from "../_nav";
import { ProfileForm, PasswordForm } from "./forms";

export const metadata = { title: "Ayarlar" };
export const dynamic = "force-dynamic";

export default async function AyarlarPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/cift");
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true },
  });
  if (!user) redirect("/cift");

  const navItems = await coupleNavItems(session.user.id);

  return (
    <DashboardShell
      title="Ayarlar"
      subtitle="Profil bilgileriniz ve hesap güvenliği."
      navTitle="Düğün Yolculuğu"
      navItems={navItems}
      currentPath="/hesabim/ayarlar"
    >
      <div className="space-y-6">
        <ProfileForm name={user.name ?? ""} email={user.email} phone={user.phone ?? ""} />
        <PasswordForm />
      </div>
    </DashboardShell>
  );
}
