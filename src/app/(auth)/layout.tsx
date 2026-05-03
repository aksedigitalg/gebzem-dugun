import Link from "next/link";
import { Heart } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between bg-gradient-to-br from-secondary via-secondary to-secondary/85 p-10 text-white lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15">
            <Heart className="h-4 w-4 text-white" fill="currentColor" />
          </span>
          <span className="font-display text-xl font-semibold">{siteConfig.fullName}</span>
        </Link>
        <div className="max-w-md">
          <h2 className="font-display text-3xl font-semibold leading-tight">
            Düğün hazırlığının her adımı, daha kolay.
          </h2>
          <p className="mt-3 text-sm text-white/80">
            Gebze ve çevresinde 100+ doğrulanmış firma, ücretsiz teklif sistemi, bütçe
            ve davetli yönetimi — tek bir hesapta.
          </p>
        </div>
        <p className="text-xs text-white/60">© {new Date().getFullYear()} {siteConfig.fullName}</p>
      </aside>

      <main className="flex flex-col items-center justify-center px-6 py-10 sm:px-10">
        <Link href="/" className="mb-10 flex items-center gap-2 lg:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
            <Heart className="h-4 w-4" fill="currentColor" />
          </span>
          <span className="font-display text-xl font-semibold">{siteConfig.fullName}</span>
        </Link>
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
