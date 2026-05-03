import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { title: "Şifremi Unuttum" };

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Şifremi unuttum</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        E-posta adresini gir, şifre sıfırlama bağlantısını gönderelim.
      </p>

      <form className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">E-posta</Label>
          <Input id="email" name="email" type="email" required placeholder="ornek@eposta.com" />
        </div>
        <Button type="submit" size="lg" className="w-full">
          Sıfırlama bağlantısı gönder
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/cift" className="font-medium text-primary hover:underline">
          ← Giriş sayfasına dön
        </Link>
      </p>
    </div>
  );
}
