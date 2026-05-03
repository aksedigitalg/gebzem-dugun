import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Nasıl Çalışır?",
  description:
    "Gebzem Düğün nasıl çalışır? Çiftler ve firmalar için adım adım kullanım rehberi.",
};

export default function NasilCalisirPage() {
  return (
    <article className="container-page max-w-4xl py-16 sm:py-20">
      <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        Nasıl Çalışır?
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Çift olarak da, firma olarak da kullanmak çok kolay. Aşağıda iki taraf için
        akışı bulabilirsin.
      </p>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">Çiftler için</h2>
        <ol className="mt-5 space-y-5">
          {[
            { t: "Hesap aç", d: "Ücretsiz çift hesabı oluştur. Düğün tarihin, davetli sayın ve bütçen üzerinden öneriler kişiselleşir." },
            { t: "Kategori & bölge seç", d: "Mekan, fotoğrafçı, gelinlik gibi 30+ kategoriden ihtiyacını seç; ilçeni belirle." },
            { t: "Karşılaştır & değerlendir", d: "Filtrele, müşteri yorumlarını oku, paket fiyatlarını yan yana koy." },
            { t: "Ücretsiz teklif al", d: "Tek formla 5 firmaya teklif gönder. Yanıtlar dashboardunda toplanır." },
            { t: "Görüş & rezerve et", d: "Mekanı keşfet, müsaitlik takviminden tarihi seç ve rezervasyonu yap." },
            { t: "Düğününü yönet", d: "Bütçe, davetli, checklist ve geri sayım araçlarıyla her şey kontrolünde." },
          ].map((s, i) => (
            <li key={s.t} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-semibold">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-semibold">Firmalar için</h2>
        <ol className="mt-5 space-y-5">
          {[
            { t: "Firma kaydını yap", d: "5 adımlı kayıt formuyla temel bilgilerini, kategorilerini ve hizmet alanını gir." },
            { t: "Belge & vergi bilgisi", d: "Vergi levhası, ticari sicil gibi belgeleri yükle. Onay süreci ortalama 24 saat." },
            { t: "Profilini doldur", d: "Galeri, paket, fiyat ve SSS yönetiminin keyfini çıkar. WYSIWYG editörle her şey elinde." },
            { t: "Tekliflere yanıt ver", d: "Çiftlerden gelen yapılandırılmış teklif isteklerini hızlıca yanıtla; şablon yanıtlardan yararlan." },
            { t: "Premium ile büyü", d: "Standart, Premium veya Pro paketle üst sıralarda görün, kampanya yayınla, detaylı analitik al." },
          ].map((s, i) => (
            <li key={s.t} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-secondary text-white font-semibold">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Link href="/isletme/kayit"><Button size="lg">İşletmemi Ekle</Button></Link>
        </div>
      </section>
    </article>
  );
}
