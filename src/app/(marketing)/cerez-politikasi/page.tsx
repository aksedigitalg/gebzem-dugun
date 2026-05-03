import type { Metadata } from "next";

export const metadata: Metadata = { title: "Çerez Politikası" };

export default function CerezPolitikasiPage() {
  return (
    <article className="container-page max-w-3xl py-16 prose prose-neutral">
      <h1 className="font-display text-4xl font-semibold">Çerez Politikası</h1>
      <p className="text-sm text-muted-foreground">Son güncelleme: {new Date().getFullYear()}</p>

      <p>
        Bu sayfa, platformumuzda kullanılan çerezler hakkında bilgi verir.
      </p>

      <h2>Çerez Nedir?</h2>
      <p>
        Çerezler, ziyaret ettiğiniz web sitelerinin tarayıcınıza yerleştirdiği
        küçük metin dosyalarıdır. Tercihlerinizi hatırlamak ve performansı
        artırmak için kullanılırlar.
      </p>

      <h2>Kullandığımız Çerez Türleri</h2>
      <ul>
        <li><strong>Zorunlu çerezler:</strong> Oturum yönetimi ve güvenlik için.</li>
        <li><strong>Performans çerezleri:</strong> Site performansı (Google Analytics, PostHog).</li>
        <li><strong>Pazarlama çerezleri:</strong> İlgi alanlarınıza göre içerik (opsiyoneldir).</li>
      </ul>

      <h2>Çerez Tercihlerinizi Yönetme</h2>
      <p>
        Çoğu modern tarayıcı çerezleri yönetmenize olanak tanır. Ayrıca site içi
        çerez bannerımızdan da tercihlerinizi anlık olarak güncelleyebilirsiniz.
      </p>
    </article>
  );
}
