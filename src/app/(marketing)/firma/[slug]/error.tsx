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

      {/* DEBUG: Gerçek hata mesajını ekrana getiriyoruz, prod log'lara
          erişimimiz yok ama kullanıcı bu metni paylaşabilir. */}
      {(error.message || error.digest) && (
        <details className="mt-4 max-w-xl rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-3 text-left text-xs text-amber-900">
          <summary className="cursor-pointer font-medium">Teknik detay (geliştirici için)</summary>
          {error.digest && (
            <p className="mt-2">
              <strong>Digest:</strong> {error.digest}
            </p>
          )}
          {error.message && (
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-all text-[11px]">
              {error.message}
            </pre>
          )}
          {error.stack && (
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-all text-[11px] opacity-70">
              {error.stack.split("\n").slice(0, 6).join("\n")}
            </pre>
          )}
        </details>
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
