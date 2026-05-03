import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { coupleNavItems } from "../_nav";
import { WeddingDetailsForm } from "./form";
import { ALL_DISTRICTS } from "@/config/regions";

export const metadata = { title: "Düğün Detayları" };
export const dynamic = "force-dynamic";

export default async function DugunDetaylariPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/cift");
  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/cift");

  const navItems = await coupleNavItems(session.user.id);

  return (
    <DashboardShell
      title="Düğün Detayları"
      subtitle="Bu bilgiler firma teklif önerilerini ve bütçe planlamasını kişiselleştirmek için kullanılır."
      navTitle="Düğün Yolculuğu"
      navItems={navItems}
      currentPath="/hesabim/dugun-detaylari"
    >
      <WeddingDetailsForm
        defaultValues={{
          weddingDate: user.weddingDate ? user.weddingDate.toISOString().slice(0, 10) : "",
          partnerName: user.partnerName ?? "",
          guestCount: user.guestCount ?? null,
          budget: user.budget ?? null,
          city: user.city ?? "Kocaeli",
          district: user.district ?? "",
          about: user.about ?? "",
        }}
        districts={ALL_DISTRICTS.map((d) => ({ slug: d.slug, name: d.name }))}
      />
    </DashboardShell>
  );
}
