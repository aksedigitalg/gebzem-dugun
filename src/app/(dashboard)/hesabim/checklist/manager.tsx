"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  upsertChecklistItemAction,
  toggleChecklistItemAction,
  deleteChecklistItemAction,
} from "@/lib/actions/checklist";

type Item = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  dueDate: Date | null;
  completed: boolean;
};

function AddBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <Plus className="h-4 w-4" />
      {pending ? "Ekleniyor…" : "Ekle"}
    </Button>
  );
}

export function ChecklistManager({ items }: { items: Item[] }) {
  const [state, formAction] = useActionState<{ ok?: boolean; error?: string }, FormData>(upsertChecklistItemAction, {});
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  const completed = items.filter((i) => i.completed).length;
  const total = items.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">İlerleme</p>
            <p className="font-display text-2xl font-semibold">
              {completed} / {total} görev tamamlandı
            </p>
          </div>
          <span className="font-display text-3xl font-bold text-primary">{progress}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <form ref={formRef} action={formAction} className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-display text-base font-semibold">Yeni Görev Ekle</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px_180px_auto]">
          <div className="space-y-1">
            <Label htmlFor="title" className="sr-only">Görev başlığı</Label>
            <Input id="title" name="title" required minLength={2} placeholder="Yapılacak görev…" />
          </div>
          <Input name="category" placeholder="Kategori (ör. Mekan)" />
          <Input name="dueDate" type="date" />
          <AddBtn />
        </div>
        {state.error && (
          <p className="mt-2 text-xs text-red-600">{state.error}</p>
        )}
      </form>

      <ul className="space-y-2">
        {items.map((it) => (
          <ChecklistRow key={it.id} item={it} />
        ))}
      </ul>
    </div>
  );
}

function ChecklistRow({ item }: { item: Item }) {
  const [optimisticDone, setOptimisticDone] = React.useState(item.completed);
  return (
    <li
      className={`flex items-start gap-3 rounded-xl border bg-card p-4 transition ${
        optimisticDone ? "border-emerald-200 bg-emerald-50/40" : "border-border"
      }`}
    >
      <form
        action={async () => {
          setOptimisticDone((v) => !v);
          await toggleChecklistItemAction(item.id);
        }}
      >
        <button type="submit" className="mt-0.5 flex-shrink-0" aria-label="Tamamlandı işaretle">
          <span
            className={`grid h-5 w-5 place-items-center rounded-md border-2 transition-colors ${
              optimisticDone
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-border hover:border-primary"
            }`}
          >
            {optimisticDone && "✓"}
          </span>
        </button>
      </form>

      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${optimisticDone ? "text-muted-foreground line-through" : "text-foreground"}`}>
          {item.title}
        </p>
        {item.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
        )}
        <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
          {item.category && <span>{item.category}</span>}
          {item.dueDate && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(item.dueDate).toLocaleDateString("tr-TR")}
            </span>
          )}
        </div>
      </div>

      <form
        action={async () => {
          await deleteChecklistItemAction(item.id);
        }}
      >
        <button type="submit" className="flex-shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600" aria-label="Sil">
          <Trash2 className="h-4 w-4" />
        </button>
      </form>
    </li>
  );
}
