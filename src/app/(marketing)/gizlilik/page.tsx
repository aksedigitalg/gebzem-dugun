import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Gizlilik Politikası" };

export default function GizlilikPage() {
  return (
    <article className="container-page max-w-3xl py-16 prose prose-neutral">
      <h1 className="font-display text-4xl font-semibold">Gizlilik Politikası</h1>
      <p className="text-sm text-muted-foreground">Son güncelleme: {new Date().getFullYear()}</p>

      <p>
        {siteConfig.fullName} olarak, kullanıcılarımızın gizliliğine büyük önem
        veriyoruz. Bu politika, hangi verileri topladığımızı, nasıl kullandığımızı
        ve haklarınızı açıklar.
      </p>

      <h2>Topladığımız Bilgiler</h2>
      <ul>
        <li>Hesap oluşturma ve giriş bilgileri</li>
        <li>Profil ve tercih bilgileri (düğün tarihi, davetli sayısı, bütçe)</li>
        <li>İletişim ve teklif kayıtları</li>
        <li>Otomatik toplanan veriler: çerez, IP, cihaz/tarayıcı bilgisi</li>
      </ul>

      <h2>Kullanım Amaçları</h2>
      <p>
        Bilgileriniz; hizmetin sağlanması, çift–firma eşleştirmesi, hesap güvenliği,
        yasal yükümlülükler ve hizmet kalitesinin iyileştirilmesi amacıyla
        kullanılır.
      </p>

      <h2>Çerezler</h2>
      <p>
        Platformumuzda zorunlu, performans ve pazarlama çerezleri kullanılmaktadır.
        Detaylar için <a href="/cerez-politikasi">Çerez Politikası</a> sayfamıza bakabilirsiniz.
      </p>

      <h2>Üçüncü Taraf Hizmetler</h2>
      <p>
        Analitik (Google Analytics, PostHog), hata izleme (Sentry), e-posta (Resend),
        SMS (Netgsm), ödeme (iyzico/PayTR) gibi sağlayıcılarla yalnızca hizmet için
        gerekli minimum veri paylaşılır.
      </p>

      <h2>İletişim</h2>
      <p>
        Sorularınız için <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>
    </article>
  );
}
