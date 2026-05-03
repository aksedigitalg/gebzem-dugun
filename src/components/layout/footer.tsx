import Link from "next/link";
import { Heart, Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { CATEGORIES } from "@/config/categories";
import { ALL_DISTRICTS, PRIMARY_DISTRICTS } from "@/config/regions";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="container-page py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
                <Heart className="h-4 w-4" fill="currentColor" />
              </span>
              <span className="font-display text-xl font-semibold tracking-tight">
                {siteConfig.fullName}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 text-foreground/80 hover:text-primary">
                <Mail className="h-4 w-4" /> {siteConfig.email}
              </a>
              <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 text-foreground/80 hover:text-primary">
                <Phone className="h-4 w-4" /> {siteConfig.phone}
              </a>
              <span className="flex items-center gap-2 text-foreground/80">
                <MapPin className="h-4 w-4" /> {siteConfig.address}
              </span>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <a aria-label="Instagram" href={siteConfig.social.instagram} className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-primary hover:text-primary-foreground">
                <Instagram className="h-4 w-4" />
              </a>
              <a aria-label="Facebook" href={siteConfig.social.facebook} className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-primary hover:text-primary-foreground">
                <Facebook className="h-4 w-4" />
              </a>
              <a aria-label="YouTube" href={siteConfig.social.youtube} className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-primary hover:text-primary-foreground">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Popüler Kategoriler</h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 8).map((c) => (
                <li key={c.slug}>
                  <Link href={`/kategori/${c.slug}`} className="text-sm text-muted-foreground hover:text-primary">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Bölgeler</h3>
            <ul className="space-y-2">
              {ALL_DISTRICTS.map((d) => (
                <li key={d.slug}>
                  <Link href={`/bolge/${d.slug}`} className="text-sm text-muted-foreground hover:text-primary">
                    {d.name} {d.priority === 1 ? "Düğün Hizmetleri" : ""}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Kurumsal</h3>
            <ul className="space-y-2">
              <li><Link href="/hakkimizda" className="text-sm text-muted-foreground hover:text-primary">Hakkımızda</Link></li>
              <li><Link href="/nasil-calisir" className="text-sm text-muted-foreground hover:text-primary">Nasıl Çalışır?</Link></li>
              <li><Link href="/isletme/kayit" className="text-sm text-muted-foreground hover:text-primary">İşletmeni Ekle</Link></li>
              <li><Link href="/iletisim" className="text-sm text-muted-foreground hover:text-primary">İletişim</Link></li>
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">Blog</Link></li>
            </ul>

            <h3 className="mb-4 mt-6 text-sm font-semibold">Yasal</h3>
            <ul className="space-y-2">
              <li><Link href="/gizlilik" className="text-sm text-muted-foreground hover:text-primary">Gizlilik Politikası</Link></li>
              <li><Link href="/kvkk" className="text-sm text-muted-foreground hover:text-primary">KVKK Aydınlatma Metni</Link></li>
              <li><Link href="/kullanim-sartlari" className="text-sm text-muted-foreground hover:text-primary">Kullanım Şartları</Link></li>
              <li><Link href="/cerez-politikasi" className="text-sm text-muted-foreground hover:text-primary">Çerez Politikası</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/60 pt-8">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Hızlı Erişim — Kategori × Bölge
          </h3>
          <div className="flex flex-wrap gap-2">
            {PRIMARY_DISTRICTS.flatMap((d) =>
              CATEGORIES.slice(0, 4).map((c) => (
                <Link
                  key={`${d.slug}-${c.slug}`}
                  href={`/kategori/${c.slug}/${d.slug}`}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
                >
                  {d.name} {c.shortName ?? c.name}
                </Link>
              )),
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.fullName}. Tüm hakları saklıdır.</p>
          <p>Gebze ve çevresinde sevgiyle ❤️ tasarlandı.</p>
        </div>
      </div>
    </footer>
  );
}
