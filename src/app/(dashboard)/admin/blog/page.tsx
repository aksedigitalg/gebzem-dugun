import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { adminNavItems } from "../_nav";
import { PageStub } from "@/components/dashboard/page-stub";

export const metadata = { title: "Blog Yönetimi" };
export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin");
  const role = session.user.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/admin");

  const navItems = await adminNavItems();

  return (
    <DashboardShell title="Blog Yönetimi" navTitle="Yönetim" navItems={navItems} currentPath="/admin/blog">
      <PageStub
        icon="FileText"
        title="Blog İçerik Yönetimi"
        description="Düğün rehberleri, ilham içerikleri ve sektör haberleri için CMS arayüzü."
        features={[
          "WYSIWYG editör (Tiptap)",
          "Kategori, etiket, kapak görseli",
          "Taslak / yayında / arşiv durumları",
          "SEO meta + Open Graph",
          "Yayın tarihi planlama",
        ]}
      />
    </DashboardShell>
  );
}
