import Link from "next/link";
import { redirect } from "next/navigation";
import { Inbox } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { firmNavItems } from "../_nav";
import { Badge } from "@/components/ui/badge";
import { relativeTime, formatPrice } from "@/lib/utils";

export const metadata = { title: "Teklifler" };
export const dynamic = "force-dynamic";

export default async function TekliflerPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/isletme");

  const firm = await db.firm.findFirst({
    where: {
      OR: [
        { ownerId: session.user.id },
        { staff: { some: { userId: session.user.id } } },
      ],
    },
  });
  if (!firm) redirect("/firma-paneli");

  const inquiries = await db.inquiry.findMany({
    where: { firmId: firm.id },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const navItems = await firmNavItems(firm.id);

  return (
    <DashboardShell
      title="Gelen Teklifler"
      subtitle="Çiftlerden gelen teklif istekleri. 24 saat içinde yanıt vermek dönüşümünü ciddi artırır."
      navTitle="Yönetim"
      navItems={navItems}
      currentPath="/firma-paneli/teklifler"
    >
      {inquiries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
          <Inbox className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 font-display text-lg font-semibold">Henüz teklif yok</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Profil bilgilerini güncel tut, galeriyi zengin yap — talepler gelmeye başladığında burada görünecek.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {inquiries.map((q) => (
            <li key={q.id}>
              <Link
                href={`/firma-paneli/teklifler/${q.id}`}
                className="block rounded-xl border border-border bg-card p-5 transition hover:border-primary hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-display text-base font-semibold">
                        {q.user.name ?? q.contactEmail}
                      </p>
                      <StatusBadge status={q.status} />
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{q.message}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {q.weddingDate && (
                        <span>📅 {new Date(q.weddingDate).toLocaleDateString("tr-TR")}</span>
                      )}
                      {q.guestCount && <span>👥 {q.guestCount} kişi</span>}
                      {q.budget && <span>💰 {formatPrice(q.budget)}</span>}
                      <span>· {relativeTime(q.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DashboardShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: "default" | "warning" | "success" | "outline" }> = {
    NEW: { label: "Yeni", variant: "warning" },
    READ: { label: "Okundu", variant: "outline" },
    RESPONDED: { label: "Yanıtlandı", variant: "success" },
    CONVERTED: { label: "Anlaşıldı", variant: "success" },
    REJECTED: { label: "Reddedildi", variant: "outline" },
    EXPIRED: { label: "Süresi Doldu", variant: "outline" },
  };
  const v = map[status] ?? { label: status, variant: "outline" };
  return <Badge variant={v.variant}>{v.label}</Badge>;
}
