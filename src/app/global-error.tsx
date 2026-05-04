"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="tr">
      <body
        style={{
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafaf9",
          color: "#111",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              margin: "0 auto",
              borderRadius: 999,
              background: "#fef3c7",
              color: "#b45309",
              display: "grid",
              placeItems: "center",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            !
          </div>
          <h1 style={{ marginTop: 16, fontSize: 22, fontWeight: 600 }}>
            Beklenmedik bir hata oluştu
          </h1>
          <p style={{ marginTop: 8, color: "#666", fontSize: 14 }}>
            Sayfa yüklenirken bir sorun yaşadık. Tekrar dene ya da anasayfaya dön.
          </p>
          {error.digest && (
            <p style={{ marginTop: 4, color: "#999", fontSize: 11 }}>
              Hata kodu: {error.digest}
            </p>
          )}
          <div
            style={{
              marginTop: 20,
              display: "flex",
              gap: 8,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                padding: "10px 18px",
                borderRadius: 8,
                background: "#b89b7a",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Tekrar Dene
            </button>
            <Link
              href="/"
              style={{
                padding: "10px 18px",
                borderRadius: 8,
                border: "1px solid #ddd",
                color: "#111",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Anasayfa
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
