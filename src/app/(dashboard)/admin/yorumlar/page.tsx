import { redirect } from "next/navigation";
import { Star } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { adminNavItems } from "../_nav";
import { Badge } from "@/components/ui/badge";
import { relativeTime } from "@/lib/utils";

export const metadata = { title: "Yorum Moderasyonu" };
export const dynamic = "force-dynamic";

export default async function AdminYorumlarPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin");
  const role = session.user.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/admin");

  const reviews = await db.review.findMany({
    include: {
      user: { select: { name: true, email: true } },
      firm: { select: { name: true, slug: true } },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 100,
  });

  const navItems = await adminNavItems();

  return (
    <DashboardShell
      title="Yorum Moderasyonu"
      subtitle="Onay bekleyen ve mevcut yorumlar — şüpheli/uygunsuz içeriği reddet."
      navTitle="Yönetim"
      navItems={navItems}
      currentPath="/admin/yorumlar"
    >
      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
          <Star className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 font-display text-lg font-semibold">Henüz yorum yok</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Çiftler firmalara yorum yazdığında burada moderasyon için listelenecek.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">
                    {r.user.name ?? r.user.email} → <span className="text-primary">{r.firm.name}</span>
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="inline-flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-amber-400" : "stroke-current opacity-30"}`} />
                      ))}
                    </span>
                    <Badge variant={r.status === "APPROVED" ? "success" : r.status === "PENDING" ? "warning" : "outline"}>
                      {r.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">{relativeTime(r.createdAt)}</p>
              </div>
              {r.title && <p className="mt-2 font-medium">{r.title}</p>}
              <p className="mt-1 text-sm text-foreground/85">{r.content}</p>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>ℹ️ Yakında:</strong> Yorumları onaylama/reddetme aksiyon butonları + AI destekli içerik
        filtresi (OpenAI Moderation API) v0.6'da eklenecek.
      </p>
    </DashboardShell>
  );
}
