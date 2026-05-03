import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Briefcase, ArrowRight } from "lucide-react";
import { auth } from "@/auth";
import { CoupleSigninForm } from "./form";

export const metadata: Metadata = {
  title: "Çift Girişi",
  description:
    "Düğün hazırlığını planlayan çiftler için giriş ekranı. Tekliflerinize, favorilerinize ve listelerinize erişin.",
};

export default async function CiftLoginPage() {
  const session = await auth();
  if (session?.user) {
    if (session.user.role === "FIRM_OWNER" || session.user.role === "FIRM_STAFF") {
      redirect("/firma-paneli");
    }
    if (session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") {
      redirect("/admin/panel");
    }
    redirect("/hesabim");
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Çift Girişi
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          Tekrar hoş geldin 👋
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Hesabına giriş yap; tekliflerini, favorilerini ve düğün araçlarını takip et.
        </p>
      </div>

      <CoupleSigninForm />

      <p className="text-center text-sm text-muted-foreground">
        Henüz hesabın yok mu?{" "}
        <Link href="/cift/kayit" className="font-medium text-primary hover:underline">
          Çift olarak üye ol
        </Link>
      </p>

      {/* İşletme girişine yönlendirme — sayfa altında profesyonel bölüm */}
      <div className="relative pt-6">
        <div className="absolute inset-x-0 top-0 h-px bg-border" />
        <div className="rounded-2xl border border-border bg-muted/40 p-5">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-secondary text-white">
              <Briefcase className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-base font-semibold">Şirket / İşletme misiniz?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Düğün hizmeti veren bir firma sahibiyseniz, ayrı işletme paneline buradan giriş yapın.
              </p>
              <Link
                href="/isletme"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-secondary hover:underline"
              >
                İşletme Girişi
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
