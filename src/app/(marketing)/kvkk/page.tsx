import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "GebzemDugun.com Kişisel Verilerin Korunması Kanunu (KVKK) Aydınlatma Metni.",
};

export default function KvkkPage() {
  return (
    <article className="container-page max-w-3xl py-16 prose prose-neutral dark:prose-invert">
      <h1 className="font-display text-4xl font-semibold">KVKK Aydınlatma Metni</h1>
      <p className="text-sm text-muted-foreground">Son güncelleme: {new Date().getFullYear()}</p>

      <h2>1. Veri Sorumlusu</h2>
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca,{" "}
        <strong>{siteConfig.fullName}</strong> ("Platform") veri sorumlusudur.
      </p>

      <h2>2. İşlenen Kişisel Veriler</h2>
      <ul>
        <li><strong>Kimlik bilgileri:</strong> ad, soyad</li>
        <li><strong>İletişim bilgileri:</strong> e-posta, telefon, adres</li>
        <li><strong>İşlem bilgileri:</strong> profil tercihleri, mesajlaşma içeriği, teklif verileri</li>
        <li><strong>Pazarlama:</strong> çerez, IP, tarayıcı ve cihaz bilgisi</li>
      </ul>

      <h2>3. İşleme Amaçları</h2>
      <ul>
        <li>Kullanıcı kaydı ve hesap yönetimi</li>
        <li>Çift–firma eşleştirmesi ve teklif iletimi</li>
        <li>Üyelik ve faturalama süreçleri</li>
        <li>Hizmet kalitesi takibi ve iyileştirme</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi</li>
      </ul>

      <h2>4. Aktarım</h2>
      <p>
        Kişisel verileriniz; iş ortakları (ödeme, e-posta, SMS sağlayıcıları), yetkili
        kamu kurumları ve hukuki yükümlülüklerin gerektirdiği taraflarla yasal
        sınırlar içinde paylaşılabilir.
      </p>

      <h2>5. Haklarınız</h2>
      <p>
        KVKK 11. maddesi kapsamında verilerinize erişme, düzeltme, silme,
        anonimleştirme ve aktarımı sınırlandırma haklarına sahipsiniz. Talepleriniz
        için <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> adresine başvurabilirsiniz.
      </p>

      <h2>6. Veri Saklama Süresi</h2>
      <p>
        Kişisel verileriniz, ilgili mevzuat ve hizmet sürekliliği gereği olarak
        gereken süreyle sınırlı şekilde saklanır; süre dolduğunda silinir, yok
        edilir veya anonim hale getirilir.
      </p>
    </article>
  );
}
