"use client";

import * as React from "react";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";

type Item = { id: string; url: string; caption?: string | null; altText?: string | null };

export function FirmGallery({ items, firmName }: { items: Item[]; firmName: string }) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 text-muted-foreground">
        <Camera className="h-8 w-8 opacity-40" />
        <p className="mt-2 text-sm">Henüz galeri yüklenmemiş.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {items.map((it, i) => (
          <button
            key={it.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={it.url}
              alt={it.altText ?? firmName}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <Lightbox
          items={items}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNav={(d) =>
            setActiveIndex((curr) => {
              if (curr === null) return null;
              const n = curr + d;
              if (n < 0) return items.length - 1;
              if (n >= items.length) return 0;
              return n;
            })
          }
        />
      )}
    </>
  );
}

function Lightbox({
  items,
  index,
  onClose,
  onNav,
}: {
  items: Item[];
  index: number;
  onClose: () => void;
  onNav: (delta: number) => void;
}) {
  const item = items[index];
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNav(-1);
      if (e.key === "ArrowRight") onNav(1);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onNav]);

  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85" onClick={onClose}>
      <button onClick={onClose} aria-label="Kapat" className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
        <X className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNav(-1);
        }}
        aria-label="Önceki"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNav(1);
        }}
        aria-label="Sonraki"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.url}
        alt={item.altText ?? "Galeri"}
        className="max-h-[88vh] max-w-[92vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      {item.caption && (
        <p className="absolute bottom-6 left-1/2 max-w-[80vw] -translate-x-1/2 rounded-full bg-black/50 px-4 py-1 text-sm text-white">
          {item.caption}
        </p>
      )}
    </div>
  );
}
