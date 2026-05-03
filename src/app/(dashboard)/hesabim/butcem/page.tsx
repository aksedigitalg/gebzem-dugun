import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { coupleNavItems } from "../_nav";
import { PageStub } from "@/components/dashboard/page-stub";

export const metadata = { title: "Bütçem" };
export const dynamic = "force-dynamic";

export default async function ButcemPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/cift");
  const navItems = await coupleNavItems(session.user.id);

  return (
    <DashboardShell title="Bütçem" navTitle="Düğün Yolculuğu" navItems={navItems} currentPath="/hesabim/butcem">
      <PageStub
        icon="Wallet"
        title="Düğün Bütçe Yöneticisi"
        description="Türkiye'ye özel kategorilerle bütçenizi planlayın, harcamalarınızı takip edin, gerçek vs tahmini farkını canlı görün."
        features={[
          "30+ kategoride önceden tanımlı bütçe şablonu",
          "Estimated vs Actual karşılaştırma grafiği",
          "Kategori bazlı yüzdesel dağılım",
          "PDF rapor olarak dışa aktarma",
          "Düğün tarihinize göre uyarı sistemi",
        ]}
        ctaHref="/hesabim/dugun-detaylari"
        ctaLabel="Önce düğün bilgilerini doldur"
      />
    </DashboardShell>
  );
}
