import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Aktif düğün arayan çiftlere doğrudan ulaş",
  "Profil, galeri ve fiyat tablosu yönetimi",
  "Müsaitlik takvimi ile çakışmaları önle",
  "Premium üyelikle üst sıralarda görün",
];

export function CtaFirm() {
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-secondary to-secondary/80 p-8 text-white sm:p-12 lg:p-16">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              Firmalar için
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Düğün sektöründesin? <br /> Müşterilerine en kısa yoldan ulaş.
            </h2>
            <p className="mt-4 max-w-xl text-white/85">
              Gebzem Düğün, Gebze ve çevre ilçelerin yerel pazarına odaklanmış bir
              marketplace'tir. İlanını ücretsiz aç, premium paketlerle büyü.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/isletme/kayit">
                <Button size="lg" variant="accent" className="bg-white text-secondary hover:bg-white/90">
                  Firmanı Ücretsiz Ekle <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/nasil-calisir">
                <Button size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">
                  Nasıl Çalışır?
                </Button>
              </Link>
            </div>
          </div>

          <ul className="space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                <span className="text-sm">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
