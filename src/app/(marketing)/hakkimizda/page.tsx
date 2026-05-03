import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: `${siteConfig.fullName} hakkında: Gebze, Darıca, Çayırova ve Dilovası'nın yerel düğün marketplace platformu.`,
};

export default function HakkimizdaPage() {
  return (
    <article className="container-page max-w-3xl py-16 sm:py-20">
      <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        {siteConfig.fullName} Hakkında
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {siteConfig.fullName}, Gebze ve çevre ilçelerde evlenecek çiftleri sektörün
        en güvenilir firmalarıyla buluşturan, %100 yerel odaklı bir düğün hizmetleri
        marketplace'idir.
      </p>

      <h2 className="mt-12 font-display text-2xl font-semibold">Misyonumuz</h2>
      <p className="mt-3 text-muted-foreground">
        Düğün hazırlığı maraton gibidir; onlarca firmayla iletişim, fiyat
        karşılaştırması ve müsaitlik kontrolü çiftleri yorar. Bizim hedefimiz tüm
        bu süreci tek bir platformdan, şeffaf ve stresiz bir biçimde yönetilebilir
        kılmak.
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold">Neden yerel?</h2>
      <p className="mt-3 text-muted-foreground">
        Gebze, Darıca, Çayırova ve Dilovası kendine özgü bir düğün kültürüne sahip;
        mekan tercihinden müzik beklentisine kadar pek çok detay bölgeye göre
        farklılaşır. Ulusal platformlar bu yerel dokuyu yakalayamaz — biz tam da
        bu boşluğu doldurmak için varız.
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold">Çiftler için ne sunuyoruz?</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
        <li>30+ kategoride doğrulanmış firma listeleri</li>
        <li>Tek formla 5 firmaya ücretsiz teklif gönderme</li>
        <li>Gerçek müşteri yorumları ve fotoğraflar</li>
        <li>Bütçe, davetli, checklist ve geri sayım gibi pratik araçlar</li>
        <li>Müsaitlik takvimi ile rezervasyon çakışmasını önleme</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-semibold">Firmalar için ne sunuyoruz?</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
        <li>Aktif düğün arayan çiftlere doğrudan erişim</li>
        <li>Profil, galeri, paket ve fiyat tablosu yönetimi</li>
        <li>Yorum, mesaj ve teklif yönetim paneli</li>
        <li>Premium üyelik ile üst sıralarda görünme imkanı</li>
        <li>Performans istatistikleri ve aylık raporlar</li>
      </ul>

      <p className="mt-12 text-sm text-muted-foreground">
        Sorularınız mı var?{" "}
        <a href={`mailto:${siteConfig.email}`} className="text-primary hover:underline">
          {siteConfig.email}
        </a>{" "}
        adresinden bize ulaşın.
      </p>
    </article>
  );
}
