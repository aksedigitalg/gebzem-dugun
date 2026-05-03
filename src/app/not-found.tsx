import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-20">
        <div className="text-center">
          <p className="font-display text-7xl font-semibold text-primary">404</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            Sayfa bulunamadı
          </h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            Aradığınız sayfa taşınmış veya silinmiş olabilir. Anasayfaya dönerek
            aramaya devam edebilirsiniz.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/"><Button>Anasayfa</Button></Link>
            <Link href="/iletisim"><Button variant="outline">İletişim</Button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
