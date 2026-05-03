import { Search, MessageSquare, CalendarCheck, Heart } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "1. Ara & Karşılaştır",
    description:
      "Kategori ve bölgeye göre filtrele, gerçek müşteri yorumlarını oku, fiyatları yan yana karşılaştır.",
  },
  {
    icon: MessageSquare,
    title: "2. Ücretsiz Teklif Al",
    description:
      "Beğendiğin firmalara tek formla teklif iste; 24 saat içinde fiyat ve müsaitlik bilgisini al.",
  },
  {
    icon: CalendarCheck,
    title: "3. Görüş & Rezerve Et",
    description:
      "Mekan keşfi yap, görüşmeni planla, müsait tarihi takvimden gör ve rezervasyonu yap.",
  },
  {
    icon: Heart,
    title: "4. Düğününün Tadını Çıkar",
    description:
      "Bütçe, davetli ve checklist araçlarıyla tüm süreci tek panelden yönet, anına odaklan.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-muted/40 py-16 sm:py-20">
      <div className="container-page">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            4 adımda hayalindeki düğüne
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Stresi en aza indir, kararını bilgiyle ver. Her şey ücretsiz, yorucu telefon
            trafiği yok.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className="relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="absolute -top-4 right-5 grid h-8 w-8 place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow">
                {i + 1}
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
