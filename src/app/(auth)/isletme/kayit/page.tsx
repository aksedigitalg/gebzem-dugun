import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { FirmSignupForm } from "./form";

export const metadata: Metadata = {
  title: "İşletme Kaydı",
  description:
    "Düğün sektörü firmalar için ücretsiz işletme kaydı. GebzemDugun.com'da Gebze ve çevre ilçelerin çiftlerine doğrudan ulaşın.",
};

const benefits = [
  "Aktif düğün arayan çiftlere doğrudan ulaş",
  "Profil, paket ve fiyat tablosu yönetimi",
  "Müsaitlik takvimi ile çakışmaları önle",
  "Premium üyelikle üst sıralarda görün",
];

export default async function IsletmeKayitPage() {
  const session = await auth();
  if (session?.user) {
    if (session.user.role === "FIRM_OWNER" || session.user.role === "FIRM_STAFF") {
      redirect("/firma-paneli");
    }
    if (session.user.role === "COUPLE") redirect("/hesabim");
    if (session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") {
      redirect("/admin/panel");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
          <Sparkles className="h-3 w-3" />
          Ücretsiz başla, istediğin zaman premium'a geç
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          İşletmeni GebzemDugun'a ekle
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          5 dakikada profilini oluştur; 24 saat içinde onaylanıp yayına çık.
        </p>
      </div>

      <ul className="space-y-2 rounded-xl border border-border bg-muted/40 p-4">
        {benefits.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
            {b}
          </li>
        ))}
      </ul>

      <FirmSignupForm />

      <p className="text-center text-sm text-muted-foreground">
        Zaten işletme hesabın var mı?{" "}
        <Link href="/isletme" className="font-medium text-secondary hover:underline">
          İşletme Girişi
        </Link>
      </p>

      <p className="text-center text-xs text-muted-foreground">
        Çift misin? <Link href="/cift/kayit" className="text-primary hover:underline">Çift kaydı</Link>
      </p>
    </div>
  );
}
