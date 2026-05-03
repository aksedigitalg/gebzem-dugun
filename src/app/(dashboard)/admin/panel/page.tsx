import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Admin Paneli" };

const cards = [
  { href: "/admin/firmalar", title: "Firmalar", desc: "Tüm kayıtlı firmalar" },
  { href: "/admin/firmalar/onay-bekleyenler", title: "Onay Bekleyen Firmalar", desc: "Yeni başvurular" },
  { href: "/admin/yorumlar", title: "Yorum Moderasyonu", desc: "Onay/red yönetimi" },
  { href: "/admin/kullanicilar", title: "Kullanıcılar", desc: "Tüm kullanıcılar" },
  { href: "/admin/kategoriler", title: "Kategoriler", desc: "Kategori yönetimi" },
  { href: "/admin/blog", title: "Blog", desc: "Blog içerik yönetimi" },
  { href: "/admin/abonelikler", title: "Abonelikler", desc: "Premium üyelikler" },
  { href: "/admin/odemeler", title: "Ödemeler", desc: "Ödeme geçmişi" },
  { href: "/admin/ayarlar", title: "Site Ayarları", desc: "Genel ayarlar" },
];

export default async function AdminPage() {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/admin");

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Admin Paneli</h1>
      <p className="mt-1 text-muted-foreground">Platform yönetim merkezi.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{c.title}</CardTitle>
                <CardDescription>{c.desc}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-primary">Aç →</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
