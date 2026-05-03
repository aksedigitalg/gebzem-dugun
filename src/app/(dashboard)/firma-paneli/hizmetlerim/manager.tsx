"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertServiceAction, deleteServiceAction } from "@/lib/actions/firm";
import { formatPrice } from "@/lib/utils";

type Service = {
  id: string;
  name: string;
  description: string;
  priceMin: number | null;
  priceMax: number | null;
  unit: string | null;
  duration: string | null;
};

function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <Save className="h-4 w-4" />
      {pending ? "Kaydediliyor…" : label}
    </Button>
  );
}

export function ServicesManager({ firmId, services }: { firmId: string; services: Service[] }) {
  const [adding, setAdding] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{services.length} hizmet tanımlı</p>
        {!adding && (
          <Button onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" /> Yeni Hizmet
          </Button>
        )}
      </div>

      {adding && (
        <ServiceForm
          firmId={firmId}
          onClose={() => setAdding(false)}
        />
      )}

      <ul className="space-y-3">
        {services.map((s) => (
          <li key={s.id}>
            {editingId === s.id ? (
              <ServiceForm firmId={firmId} service={s} onClose={() => setEditingId(null)} />
            ) : (
              <ServiceCard
                service={s}
                onEdit={() => setEditingId(s.id)}
                onDelete={async () => {
                  if (!confirm("Bu hizmeti silmek istediğine emin misin?")) return;
                  const res = await deleteServiceAction(s.id, firmId);
                  if (res.ok) location.reload();
                  else alert(res.error ?? "Silinemedi.");
                }}
              />
            )}
          </li>
        ))}
      </ul>

      {services.length === 0 && !adding && (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
          Henüz hizmet eklenmemiş. "Yeni Hizmet" butonuyla ilkini ekle.
        </div>
      )}
    </div>
  );
}

function ServiceCard({
  service,
  onEdit,
  onDelete,
}: {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-5">
      <div className="min-w-0 flex-1">
        <p className="font-display text-base font-semibold">{service.name}</p>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{service.description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {(service.priceMin || service.priceMax) && (
            <span>
              {service.priceMin && service.priceMax && service.priceMin !== service.priceMax
                ? `${formatPrice(service.priceMin)} – ${formatPrice(service.priceMax)}`
                : formatPrice((service.priceMin ?? service.priceMax)!)}
              {service.unit && <> · {service.unit}</>}
            </span>
          )}
          {service.duration && <span>{service.duration}</span>}
        </div>
      </div>
      <div className="flex flex-shrink-0 gap-2">
        <Button size="sm" variant="outline" onClick={onEdit}>Düzenle</Button>
        <Button size="sm" variant="outline" onClick={onDelete} className="text-red-600 hover:bg-red-50">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function ServiceForm({
  firmId,
  service,
  onClose,
}: {
  firmId: string;
  service?: Service;
  onClose: () => void;
}) {
  const [state, formAction] = useActionState(upsertServiceAction, {});

  React.useEffect(() => {
    if (state.ok) {
      onClose();
      location.reload();
    }
  }, [state.ok, onClose]);

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-primary/40 bg-primary/5 p-5">
      <input type="hidden" name="firmId" value={firmId} />
      {service && <input type="hidden" name="id" value={service.id} />}

      <h3 className="font-display text-base font-semibold">
        {service ? "Hizmeti Düzenle" : "Yeni Hizmet"}
      </h3>

      <div className="space-y-1.5">
        <Label htmlFor="name">Hizmet Adı</Label>
        <Input id="name" name="name" defaultValue={service?.name} required minLength={2} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Açıklama</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={service?.description}
          required
          minLength={5}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="priceMin">Fiyat Min ₺</Label>
          <Input id="priceMin" name="priceMin" type="number" min={0} defaultValue={service?.priceMin ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="priceMax">Fiyat Max ₺</Label>
          <Input id="priceMax" name="priceMax" type="number" min={0} defaultValue={service?.priceMax ?? ""} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="unit">Birim (kişi başı / etkinlik / saat...)</Label>
          <Input id="unit" name="unit" defaultValue={service?.unit ?? ""} maxLength={40} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="duration">Süre (4 saat / tüm gün...)</Label>
          <Input id="duration" name="duration" defaultValue={service?.duration ?? ""} maxLength={40} />
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{state.error}</p>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>Vazgeç</Button>
        <SubmitBtn label={service ? "Kaydet" : "Ekle"} />
      </div>
    </form>
  );
}
