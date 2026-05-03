"use client";

import * as React from "react";
import { Upload, Trash2, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadGalleryItemAction, deleteGalleryItemAction } from "@/lib/actions/firm";

type Item = { id: string; url: string; caption: string | null; altText: string | null };

export function GalleryManager({
  firmId,
  firmSlug,
  items: initialItems,
}: {
  firmId: string;
  firmSlug: string;
  items: Item[];
}) {
  const [items, setItems] = React.useState(initialItems);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of Array.from(files).slice(0, 10)) {
        const fd = new FormData();
        fd.append("firmId", firmId);
        fd.append("file", file);
        const res = await uploadGalleryItemAction(fd);
        if (!res.ok && res.error) {
          setError(res.error);
          break;
        }
      }
      // refresh
      const res = await fetch(`/api/firm/${firmSlug}/gallery`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items ?? []);
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu fotoğrafı kaldırmak istediğinden emin misin?")) return;
    const res = await deleteGalleryItemAction(id);
    if (res.ok) {
      setItems((s) => s.filter((i) => i.id !== id));
    } else {
      alert(res.error ?? "Silinemedi.");
    }
  }

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl border-2 border-dashed border-border bg-muted/30 p-8 text-center transition hover:border-primary"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground/40" />
        <p className="mt-3 font-display text-lg font-semibold">Fotoğraf yükle</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Sürükle-bırak veya butona tıkla. JPG/PNG/WebP, en fazla 8 MB. Tek seferde 10 fotoğrafa kadar.
        </p>
        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="mt-4"
        >
          <Upload className="h-4 w-4" />
          {uploading ? "Yükleniyor…" : "Fotoğraf Seç"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
      </div>

      {items.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">Henüz fotoğraf yüklenmemiş.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {items.map((it) => (
            <div key={it.id} className="group relative aspect-square overflow-hidden rounded-xl bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.url} alt={it.altText ?? ""} loading="lazy" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => handleDelete(it.id)}
                className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-red-600 opacity-0 shadow transition group-hover:opacity-100 hover:bg-red-600 hover:text-white"
                aria-label="Sil"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
