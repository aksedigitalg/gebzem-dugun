import type { Metadata } from "next";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "İletişim",
  description: `${siteConfig.fullName} ile iletişime geç. Soru, öneri ve işbirlikleri için bize yaz.`,
};

export default function IletisimPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Bize ulaş
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Sorularınız, önerileriniz veya işbirliği talepleriniz için aşağıdaki formu
          kullanabilirsiniz.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          {[
            { icon: Mail, label: "E-posta", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
            { icon: Phone, label: "Telefon", value: siteConfig.phone, href: `tel:${siteConfig.phone}` },
            { icon: MessageCircle, label: "WhatsApp", value: siteConfig.whatsapp, href: `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}` },
            { icon: MapPin, label: "Adres", value: siteConfig.address },
          ].map((c) => (
            <div key={c.label} className="flex gap-3 rounded-xl border border-border bg-card p-4">
              <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <c.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</p>
                {c.href ? (
                  <a href={c.href} className="text-sm font-medium text-foreground hover:text-primary">
                    {c.value}
                  </a>
                ) : (
                  <span className="text-sm font-medium text-foreground">{c.value}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <form className="rounded-2xl border border-border bg-card p-6 sm:p-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="subject">Konu</Label>
              <Input id="subject" name="subject" required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="message">Mesajınız</Label>
              <Textarea id="message" name="message" rows={5} required />
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Formu göndererek KVKK aydınlatma metnini okuduğunuzu kabul etmiş sayılırsınız.
          </p>
          <Button type="submit" size="lg" className="mt-4 w-full sm:w-auto">
            Mesaj Gönder
          </Button>
        </form>
      </div>
    </div>
  );
}
