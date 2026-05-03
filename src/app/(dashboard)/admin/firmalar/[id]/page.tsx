import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ExternalLink, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { adminNavItems } from "../../_nav";
import { ModerationActions } from "./actions";
import { Badge } from "@/components/ui/badge";
import { formatDate, relativeTime } from "@/lib/utils";

export const metadata = { title: "Firma Detayı (Admin)" };
export const dynamic = "force-dynamic";

export default async function AdminFirmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin");
  const role = session.user.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/admin");

  const { id } = await params;
  const firm = await db.firm.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true, phone: true, createdAt: true } },
      categories: { include: { category: { select: { name: true, slug: true } } } },
      _count: { select: { inquiries: true, reviews: true, gallery: true, services: true } },
      documents: true,
      gallery: { take: 6 },
    },
  });
  if (!firm) notFound();

  const navItems = await adminNavItems();

  return (
    <DashboardShell
      title={firm.name}
      subtitle={`${firm.district} · ${firm.email}`}
      navTitle="Yönetim"
      navItems={navItems}
      currentPath="/admin/firmalar"
      actions={
        <Link href={`/firma/${firm.slug}`} target="_blank" rel="noreferrer">
          <button className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs hover:border-primary">
            Profili Gör <ExternalLink className="h-3 w-3" />
          </button>
        </Link>
      }
    >
      <Link href="/admin/firmalar" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" /> Tüm firmalar
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-xl font-semibold">{firm.name}</h2>
              <Badge variant={firm.status === "ACTIVE" ? "success" : firm.status === "PENDING" ? "warning" : "outline"}>
                {firm.status}
              </Badge>
              {firm.isVerified && <Badge variant="success">Doğrulanmış</Badge>}
              {firm.isFeatured && <Badge variant="premium">Premium</Badge>}
              <Badge variant="outline">{firm.membershipType}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{firm.shortDescription}</p>
            <div
              className="prose prose-sm mt-4 max-w-none text-foreground/85"
              dangerouslySetInnerHTML={{ __html: firm.description }}
            />
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display text-base font-semibold">İstatistikler</h3>
            <dl className="mt-3 grid grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Görüntüleme</dt>
                <dd className="font-display text-xl font-semibold">{firm.viewCount}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Teklif</dt>
                <dd className="font-display text-xl font-semibold">{firm._count.inquiries}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Yorum</dt>
                <dd className="font-display text-xl font-semibold">{firm._count.reviews}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Galeri</dt>
                <dd className="font-display text-xl font-semibold">{firm._count.gallery}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Hizmet</dt>
                <dd className="font-display text-xl font-semibold">{firm._count.services}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Puan</dt>
                <dd className="font-display text-xl font-semibold">{firm.rating > 0 ? firm.rating.toFixed(1) : "—"}</dd>
              </div>
            </dl>
          </section>

          {firm.documents.length > 0 && (
            <section className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display text-base font-semibold">Belgeler</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {firm.documents.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium">{d.type}</p>
                      <p className="text-xs text-muted-foreground">{d.notes}</p>
                    </div>
                    <a href={d.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
                      Görüntüle →
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display text-base font-semibold">Moderasyon</h3>
            <div className="mt-3">
              <ModerationActions firmId={firm.id} status={firm.status} isFeatured={firm.isFeatured} isVerified={firm.isVerified} />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display text-base font-semibold">Sahip</h3>
            <div className="mt-3 space-y-2 text-sm">
              <p className="font-medium">{firm.owner.name ?? "(İsim yok)"}</p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-3.5 w-3.5" /> {firm.owner.email}
              </p>
              {firm.owner.phone && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" /> {firm.owner.phone}
                </p>
              )}
              <p className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" /> Üye: {formatDate(firm.owner.createdAt)}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display text-base font-semibold">İletişim</h3>
            <div className="mt-3 space-y-2 text-sm">
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> {firm.phone}</p>
              <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> {firm.email}</p>
              <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                <span>{firm.address}, {firm.district}/{firm.city}</span>
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 text-xs text-muted-foreground">
            <p>Kategoriler: {firm.categories.map((c) => c.category.name).join(", ") || "—"}</p>
            <p className="mt-2">Eklendi: {relativeTime(firm.createdAt)}</p>
            <p>Son güncelleme: {relativeTime(firm.updatedAt)}</p>
          </section>
        </aside>
      </div>
    </DashboardShell>
  );
}
