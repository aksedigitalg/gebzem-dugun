import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Firma Paneli" };

const cards = [
  { href: "/firma-paneli/profilim", title: "Profilim", desc: "Firma profilini düzenle" },
  { href: "/firma-paneli/galeri", title: "Galeri", desc: "Fotoğraf & video yönetimi" },
  { href: "/firma-paneli/hizmetlerim", title: "Hizmetlerim", desc: "Hizmet & paket fiyatları" },
  { href: "/firma-paneli/teklifler", title: "Gelen Teklifler", desc: "Çift istekleri" },
  { href: "/firma-paneli/mesajlar", title: "Mesajlar", desc: "Anlık mesajlaşma" },
  { href: "/firma-paneli/musait-takvim", title: "Müsaitlik Takvimi", desc: "Doluluk yönetimi" },
  { href: "/firma-paneli/yorumlar", title: "Yorumlar", desc: "Müşteri yorumları" },
  { href: "/firma-paneli/abonelik", title: "Abonelik", desc: "Premium üyelik" },
  { href: "/firma-paneli/istatistikler", title: "İstatistikler", desc: "Performans analitiği" },
];

export default function FirmaPaneliPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Firma Paneli</h1>
      <p className="mt-1 text-muted-foreground">
        Firmanızı tek panelden yönetin: profil, teklifler, takvim ve daha fazlası.
      </p>

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
