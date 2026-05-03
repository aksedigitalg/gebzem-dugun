import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Kullanım Şartları" };

export default function KullanimSartlariPage() {
  return (
    <article className="container-page max-w-3xl py-16 prose prose-neutral">
      <h1 className="font-display text-4xl font-semibold">Kullanım Şartları</h1>
      <p className="text-sm text-muted-foreground">Son güncelleme: {new Date().getFullYear()}</p>

      <p>
        Bu kullanım şartları, {siteConfig.fullName} ("Platform") üzerinde sunulan
        hizmetlerin kullanımına ilişkin koşulları belirler. Platformu kullanarak bu
        şartları kabul etmiş sayılırsınız.
      </p>

      <h2>Hesap & Sorumluluk</h2>
      <p>
        Hesabınızın güvenliği sizin sorumluluğunuzdadır. Yanıltıcı bilgi vermek,
        sahte profil oluşturmak veya başka kullanıcıları taklit etmek yasaktır.
      </p>

      <h2>İçerik Politikası</h2>
      <p>
        Platforma yüklediğiniz içeriklerden (yazılar, fotoğraflar, yorumlar) bizzat
        siz sorumlusunuz. Telif hakkı, kişilik hakları veya yasalara aykırı içerik
        derhal kaldırılır ve hesap askıya alınabilir.
      </p>

      <h2>Firmaların Sorumlulukları</h2>
      <p>
        Firma kullanıcıları, paylaştıkları bilgilerin doğruluğundan, sundukları
        hizmetin kalitesinden ve müşteri memnuniyetinden sorumludur. Platform,
        anlaşmazlıklarda yalnızca aracı pozisyonundadır.
      </p>

      <h2>Hizmetin Değişikliği</h2>
      <p>
        {siteConfig.fullName}, hizmet kapsamında değişiklik yapma, yeni özellik
        ekleme veya kaldırma hakkını saklı tutar.
      </p>

      <h2>Uyuşmazlıklar</h2>
      <p>
        Bu şartlar Türk hukukuna tabidir. Uyuşmazlıklarda Kocaeli mahkemeleri ve
        icra daireleri yetkilidir.
      </p>
    </article>
  );
}
