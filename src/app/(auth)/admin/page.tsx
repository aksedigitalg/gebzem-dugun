import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Shield } from "lucide-react";
import { auth } from "@/auth";
import { AdminSigninForm } from "./form";

export const metadata: Metadata = {
  title: "Yönetici Girişi",
  description: "Platform yönetim paneli girişi.",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user) {
    if (session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") {
      redirect("/admin/panel");
    }
    if (session.user.role === "FIRM_OWNER" || session.user.role === "FIRM_STAFF") {
      redirect("/firma-paneli");
    }
    redirect("/hesabim");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-white">
          <Shield className="h-5 w-5" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
          Yönetici Girişi
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Yetkili hesap bilgilerinle giriş yap.
        </p>
      </div>

      <AdminSigninForm />

      <p className="text-center text-[11px] text-muted-foreground">
        Bu sayfa yalnızca platform yöneticileri içindir. Yetkisiz giriş denemeleri kaydedilir.
      </p>
    </div>
  );
}
