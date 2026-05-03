import Link from "next/link";
import { Calculator, Users, ListChecks, Hourglass, GitCompare } from "lucide-react";

const tools = [
  {
    icon: Calculator,
    title: "Düğün Bütçe Hesaplayıcı",
    desc: "Türkiye'ye özel kategorilerle gerçekçi bütçe planlaması.",
    href: "/dugun-butce-hesaplayici",
  },
  {
    icon: Users,
    title: "Davetli Listesi",
    desc: "Excel'den içe aktar, LCV ve oturma planını yönet.",
    href: "/dugun-davetli-listesi",
  },
  {
    icon: ListChecks,
    title: "Düğün Checklist",
    desc: "12 ay öncesinden bir hafta öncesine, hatırlatıcılı yapılacaklar.",
    href: "/dugun-checklist",
  },
  {
    icon: Hourglass,
    title: "Geri Sayım",
    desc: "Düğün gününe kalan zamanı gör, motivasyonunu yüksek tut.",
    href: "/dugun-geri-sayim",
  },
  {
    icon: GitCompare,
    title: "Karşılaştırma Aracı",
    desc: "3 firmayı yan yana koy; fiyat, hizmet ve puanı karşılaştır.",
    href: "/dugun-mekan-karsilastir",
  },
];

export function ToolsSection() {
  return (
    <section className="bg-muted/40 py-16 sm:py-20">
      <div className="container-page">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Düğün hazırlığı için ücretsiz araçlar
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Karar verirken sana yol gösterecek pratik hesaplayıcılar ve listeler.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {tools.map(({ icon: Icon, title, desc, href }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
