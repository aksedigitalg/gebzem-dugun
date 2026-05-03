import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart, ArrowRight } from "lucide-react";
import { auth } from "@/auth";
import { FirmSigninForm } from "./form";
import { DemoCredentials } from "@/components/auth/demo-credentials";

export const metadata: Metadata = {
  title: "İşletme Girişi",
  description:
    "Düğün sektöründe hizmet veren firmalar için işletme paneli girişi. Tekliflerinizi, mesajlarınızı ve takviminizi yönetin.",
};

export default async function IsletmeLoginPage() {
  const session = await auth();
  if (session?.user) {
    if (session.user.role === "COUPLE") redirect("/hesabim");
    if (session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") {
      redirect("/admin/panel");
    }
    redirect("/firma-paneli");
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
          İşletme Girişi
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          Firma paneline giriş
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tekliflerinizi yanıtlayın, müsaitlik takviminizi güncelleyin, müşteri mesajlarına anında cevap verin.
        </p>
      </div>

      <FirmSigninForm />

      <DemoCredentials variant="firm" />

      <p className="text-center text-sm text-muted-foreground">
        Henüz işletme hesabınız yok mu?{" "}
        <Link href="/isletme/kayit" className="font-medium text-secondary hover:underline">
          İşletme Kaydı
        </Link>
      </p>

      <div className="relative pt-6">
        <div className="absolute inset-x-0 top-0 h-px bg-border" />
        <div className="rounded-2xl border border-border bg-muted/40 p-5">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-primary text-white">
              <Heart className="h-4 w-4" fill="currentColor" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-base font-semibold">Çift olarak mı giriyorsun?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Düğün hazırlığı yapan bir çiftseniz, çift girişine geçmelisiniz.
              </p>
              <Link
                href="/cift"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Çift Girişi
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
