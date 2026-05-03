import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { adminNavItems } from "../_nav";
import { PageStub } from "@/components/dashboard/page-stub";

export const metadata = { title: "Site Ayarları" };
export const dynamic = "force-dynamic";

export default async function AdminAyarlarPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin");
  const role = session.user.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/admin");
  const navItems = await adminNavItems();

  return (
    <DashboardShell title="Site Ayarları" navTitle="Yönetim" navItems={navItems} currentPath="/admin/ayarlar">
      <PageStub
        icon="Settings"
        title="Genel Site Ayarları"
        description="Site genelindeki konfigürasyon — yakında."
        features={[
          "Anasayfa hero metni / banner kontrolü",
          "Bakım modu açma/kapama",
          "E-posta tema şablonları",
          "Komisyon oranları (premium üyelik)",
          "Coğrafi alan genişletme (yeni ilçe ekleme)",
        ]}
      />
    </DashboardShell>
  );
}
