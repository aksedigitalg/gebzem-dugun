import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata = { title: "Hesabım" };

const cards = [
  { href: "/hesabim/dugun-detaylari", title: "Düğün Detayları", desc: "Tarih, mekan, davetli sayısı" },
  { href: "/hesabim/favorilerim", title: "Favorilerim", desc: "Beğendiğin firmalar" },
  { href: "/hesabim/tekliflerim", title: "Tekliflerim", desc: "Aldığın firma yanıtları" },
  { href: "/hesabim/mesajlar", title: "Mesajlar", desc: "Firmalarla yazışma" },
  { href: "/hesabim/butcem", title: "Bütçem", desc: "Düğün bütçe takibi" },
  { href: "/hesabim/davetlilerim", title: "Davetlilerim", desc: "Davetli listesi & LCV" },
  { href: "/hesabim/checklist", title: "Checklist", desc: "Yapılacaklar" },
  { href: "/hesabim/yorumlarim", title: "Yorumlarım", desc: "Yazdığın yorumlar" },
  { href: "/hesabim/ayarlar", title: "Ayarlar", desc: "Profil & güvenlik" },
];

export default async function HesabimPage() {
  const session = await auth();
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Merhaba {session?.user?.name?.split(" ")[0] ?? "👋"}
      </h1>
      <p className="mt-1 text-muted-foreground">Hesabını ve düğün hazırlığını buradan yönet.</p>

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
