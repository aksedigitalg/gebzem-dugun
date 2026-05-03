import Link from "next/link";
import { redirect } from "next/navigation";
import { Inbox } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { coupleNavItems } from "../_nav";
import { Badge } from "@/components/ui/badge";
import { relativeTime, formatPrice } from "@/lib/utils";

export const metadata = { title: "Tekliflerim" };
export const dynamic = "force-dynamic";

export default async function TekliflerimPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/cift");

  const inquiries = await db.inquiry.findMany({
    where: { userId: session.user.id },
    include: { firm: { select: { id: true, slug: true, name: true, logo: true, district: true } } },
    orderBy: { createdAt: "desc" },
  });

  const navItems = await coupleNavItems(session.user.id);

  return (
    <DashboardShell
      title="Tekliflerim"
      subtitle="Firmalardan istediğiniz tüm teklif yanıtları burada toplanır."
      navTitle="Düğün Yolculuğu"
      navItems={navItems}
      currentPath="/hesabim/tekliflerim"
    >
      {inquiries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
          <Inbox className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 font-display text-lg font-semibold">Henüz teklif istemediniz</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Firma profilinden "Ücretsiz Teklif Al" butonuna tıklayarak başlayabilirsiniz.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {inquiries.map((q) => (
            <li key={q.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link href={`/firma/${q.firm.slug}`} className="font-display text-base font-semibold hover:text-primary">
                      {q.firm.name}
                    </Link>
                    <Badge variant={q.status === "RESPONDED" ? "success" : "warning"}>
                      {q.status === "NEW" ? "Bekliyor" : q.status === "RESPONDED" ? "Yanıt Var" : q.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{q.firm.district} · {relativeTime(q.createdAt)}</p>
                  <div className="mt-3 rounded-lg bg-muted/30 p-3 text-sm">
                    <p className="text-xs font-semibold text-muted-foreground">Mesajınız:</p>
                    <p className="mt-1 line-clamp-3">{q.message}</p>
                  </div>
                  {q.firmResponse && (
                    <div className="mt-2 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-3 text-sm">
                      <p className="text-xs font-semibold text-emerald-800">Firma yanıtı:</p>
                      <p className="mt-1 whitespace-pre-line text-emerald-900">{q.firmResponse}</p>
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {q.weddingDate && <span>📅 {new Date(q.weddingDate).toLocaleDateString("tr-TR")}</span>}
                    {q.guestCount && <span>👥 {q.guestCount} kişi</span>}
                    {q.budget && <span>💰 {formatPrice(q.budget)}</span>}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardShell>
  );
}
