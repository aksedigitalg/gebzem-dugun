import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Firmanı Ekle — Gebze Düğün Sektörünün Lider Platformu",
  description: "GebzemDugun.com'a firmanı ekle, Gebze ve çevresindeki çiftlere doğrudan ulaş.",
};

const benefits = [
  "Profil, galeri, video, paket ve fiyat tablosu yönetimi",
  "Aktif düğün arayan çiftlerden gelen yapılandırılmış teklif istekleri",
  "Müsaitlik takvimi ile çift rezervasyonu önleme",
  "Yorum sistemi ile sosyal kanıt ve güven",
  "Premium üyelik ile üst sıralarda görünme",
  "Detaylı analitik (görüntülenme, tıklama, dönüşüm)",
];

export default function FirmaEklePage() {
  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        <Sparkles className="h-3.5 w-3.5" />
        Ücretsiz başla, istediğin zaman premium'a geç
      </div>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
        Firmanı GebzemDugun'a ekle
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        5 dakikada profilini oluştur; 24 saat içinde onaylanıp yayına çık. İlk üyelik
        ücretsiz — istersen sonra Premium'a yükselt.
      </p>

      <ul className="mt-6 space-y-2.5">
        {benefits.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            {b}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-2">
        <Link href="/kayit?role=firm">
          <Button size="lg" className="w-full">
            Hemen Başla <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/giris">
          <Button size="lg" variant="outline" className="w-full">
            Zaten hesabım var
          </Button>
        </Link>
      </div>
    </div>
  );
}
