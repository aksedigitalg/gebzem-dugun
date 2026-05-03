import { redirect } from "next/navigation";
import { Star } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { firmNavItems } from "../_nav";
import { Badge } from "@/components/ui/badge";
import { relativeTime } from "@/lib/utils";

export const metadata = { title: "Yorumlar" };
export const dynamic = "force-dynamic";

export default async function FirmaYorumlarPage() {
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

  const reviews = await db.review.findMany({
    where: { firmId: firm.id },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });

  const navItems = await firmNavItems(firm.id);

  const avg = firm.rating;
  const total = firm.reviewCount;

  return (
    <DashboardShell
      title="Müşteri Yorumları"
      subtitle={total > 0 ? `Ortalama puan ${avg.toFixed(1)} / 5 · ${total} yorum` : "Henüz yorum yok"}
      navTitle="Yönetim"
      navItems={navItems}
      currentPath="/firma-paneli/yorumlar"
    >
      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
          <Star className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 font-display text-lg font-semibold">Henüz yorum yok</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Hizmet verdiğiniz çiftler düğün sonrası yorum bıraktığında burada görünecek.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{r.user.name ?? "Anonim"}</p>
                    <span className="inline-flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-amber-400" : "stroke-current opacity-30"}`} />
                      ))}
                    </span>
                    <Badge variant={r.status === "APPROVED" ? "success" : r.status === "PENDING" ? "warning" : "outline"}>
                      {r.status}
                    </Badge>
                  </div>
                  {r.title && <p className="mt-1 font-medium">{r.title}</p>}
                  <p className="mt-1 text-sm text-foreground/85">{r.content}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{relativeTime(r.createdAt)}</p>
                </div>
              </div>
              {r.reply && (
                <div className="mt-3 rounded-lg border-l-4 border-primary bg-primary/5 p-3">
                  <p className="text-xs font-semibold text-primary">Cevabınız</p>
                  <p className="mt-1 text-sm">{r.reply}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </DashboardShell>
  );
}
