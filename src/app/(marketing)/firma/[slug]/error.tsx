"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FirmaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[firm-profile error]", error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-amber-100 text-amber-700">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h1 className="mt-4 font-display text-2xl font-semibold">Bir şeyler ters gitti</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Bu firma sayfası yüklenirken beklenmedik bir hata oluştu. Tekrar denemek
        sorunu çözebilir.
      </p>
      {error.digest && (
        <p className="mt-1 text-[11px] text-muted-foreground/70">
          Hata kodu: {error.digest}
        </p>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button onClick={reset} size="sm">
          <RefreshCw className="h-4 w-4" /> Tekrar Dene
        </Button>
        <Link href="/">
          <Button variant="outline" size="sm">
            <Home className="h-4 w-4" /> Anasayfa
          </Button>
        </Link>
      </div>
    </div>
  );
}
