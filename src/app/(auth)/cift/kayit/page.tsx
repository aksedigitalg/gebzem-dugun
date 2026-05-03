import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CoupleSignupForm } from "./form";

export const metadata: Metadata = {
  title: "Çift Olarak Üye Ol",
  description:
    "Düğün hazırlığını planlayan çiftler için ücretsiz hesap oluştur. Bütçe, davetli ve checklist araçlarına anında eriş.",
};

export default async function CiftSignupPage() {
  const session = await auth();
  if (session?.user) redirect("/hesabim");

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Çift Üyeliği
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          Düğün hazırlığın başlasın
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Saniyeler içinde kaydol; bütçe, davetli, checklist ve geri sayım araçları ücretsiz.
        </p>
      </div>

      <CoupleSignupForm />

      <p className="text-center text-sm text-muted-foreground">
        Zaten hesabın var mı?{" "}
        <Link href="/cift" className="font-medium text-primary hover:underline">
          Çift Girişi
        </Link>
      </p>

      <p className="text-center text-xs text-muted-foreground">
        Firma sahibi misin? <Link href="/isletme/kayit" className="text-secondary hover:underline">İşletme kaydı</Link>
      </p>
    </div>
  );
}
