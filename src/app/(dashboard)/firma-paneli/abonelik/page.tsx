import { redirect } from "next/navigation";
import { Crown, Award, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { firmNavItems } from "../_nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Abonelik" };
export const dynamic = "force-dynamic";

const PLANS = [
  {
    key: "FREE",
    name: "Ücretsiz",
    price: 0,
    icon: ShieldCheck,
    color: "text-muted-foreground",
    features: [
      "Temel firma profili",
      "Ayda 5 teklif görüntüleme",
      "Standart sıralama",
      "Galeri (10 fotoğrafa kadar)",
    ],
  },
  {
    key: "STANDARD",
    name: "Standart",
    price: 399,
    icon: Sparkles,
    color: "text-primary",
    features: [
      "Sınırsız teklif görüntüleme",
      "Kapak fotoğrafı + sınırsız galeri",
      "Müsaitlik takvimi",
      "Temel istatistikler",
      "Kampanya yayınlama (1 aktif)",
    ],
  },
  {
    key: "PREMIUM",
    name: "Premium",
    price: 799,
    icon: Award,
    color: "text-amber-500",
    popular: true,
    features: [
      "Standart paketin tüm avantajları",
      "Üst sıralarda gösterim",
      "'Premium' rozeti",
      "Detaylı analitik (görüntülenme, dönüşüm)",
      "Sınırsız kampanya",
      "Öncelikli destek",
    ],
  },
  {
    key: "PRO",
    name: "Pro",
    price: 1499,
    icon: Crown,
    color: "text-purple-600",
    features: [
      "Premium paketin tüm avantajları",
      "Çoklu kategori (3+ kategori)",
      "Ekip yönetimi (5+ kullanıcı)",
      "Featured rozeti — anasayfada yer",
      "Özel domain (firma.gebzemdugun.com)",
      "API erişimi",
      "Anlık WhatsApp bildirim entegrasyonu",
    ],
  },
];

export default async function AbonelikPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/isletme");

  const firm = await db.firm.findFirst({
    where: {
      OR: [
        { ownerId: session.user.id },
        { staff: { some: { userId: session.user.id } } },
      ],
    },
    include: { subscription: true },
  });
  if (!firm) redirect("/firma-paneli");
  const navItems = await firmNavItems(firm.id);

  const currentPlan = firm.membershipType;

  return (
    <DashboardShell
      title="Abonelik"
      subtitle={`Mevcut paket: ${currentPlan}`}
      navTitle="Yönetim"
      navItems={navItems}
      currentPath="/firma-paneli/abonelik"
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((p) => {
          const Icon = p.icon;
          const isCurrent = currentPlan === p.key;
          return (
            <div
              key={p.key}
              className={`rounded-2xl border p-6 transition ${
                isCurrent
                  ? "border-primary bg-primary/5 shadow-md"
                  : p.popular
                  ? "border-amber-300 bg-amber-50/30"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-5 w-5 ${p.color}`} />
                <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                {p.popular && <Badge variant="premium">En popüler</Badge>}
                {isCurrent && <Badge variant="success">Mevcut paketin</Badge>}
              </div>
              <p className="mt-3 font-display text-3xl font-bold">
                {p.price === 0 ? "Ücretsiz" : formatPrice(p.price)}
                {p.price > 0 && <span className="text-sm font-normal text-muted-foreground"> / ay</span>}
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                {isCurrent ? (
                  <Button variant="outline" className="w-full" disabled>
                    Mevcut Paket
                  </Button>
                ) : p.price === 0 ? (
                  <Button variant="outline" className="w-full" disabled>
                    Ücretsiz
                  </Button>
                ) : (
                  <Button className="w-full" disabled>
                    Yakında — iyzico entegrasyonu
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>ℹ️ Bilgi:</strong> Ödeme entegrasyonu (iyzico) Faz 3'te canlıya alınacak. Şu an tüm hesaplar
        FREE paketle çalışıyor; pro/premium özellikler v0.6'dan itibaren aktif olacak.
      </p>
    </DashboardShell>
  );
}
