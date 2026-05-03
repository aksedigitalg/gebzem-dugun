import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Building2, Eye, Inbox, MessageSquare, Star, ShieldCheck, Award,
  ArrowUpRight, ExternalLink, AlertCircle,
} from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell, StatCard } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { firmNavItems } from "./_nav";
import { relativeTime } from "@/lib/utils";

export const metadata = { title: "Firma Paneli" };
export const dynamic = "force-dynamic";

export default async function FirmaPanelOverview() {
  const session = await auth();
  if (!session?.user?.id) redirect("/isletme");
  const role = session.user.role;
  if (role !== "FIRM_OWNER" && role !== "FIRM_STAFF" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
    redirect("/cift");
  }

  // İlk firmayı al (ileride çoklu firma desteği gelebilir)
  const firm = await db.firm.findFirst({
    where: {
      OR: [
        { ownerId: session.user.id },
        { staff: { some: { userId: session.user.id } } },
      ],
    },
    include: {
      _count: {
        select: {
          inquiries: { where: { status: { in: ["NEW", "READ"] } } },
          reviews: true,
          favorites: true,
          conversations: true,
        },
      },
    },
  });

  if (!firm) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center">
        <Building2 className="mx-auto h-10 w-10 text-muted-foreground/40" />
        <h2 className="mt-3 font-display text-2xl font-semibold">Firma bilgilerin eksik</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Hesabın işletme rolünde ama henüz bir firma profilin yok. Tamamla, yayına çık.
        </p>
        <Link href="/firma-paneli/profilim/yeni" className="mt-4 inline-block">
          <Button>Firma Profilini Oluştur</Button>
        </Link>
      </div>
    );
  }

  const newInquiries = await db.inquiry.findMany({
    where: { firmId: firm.id, status: { in: ["NEW", "READ"] } },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentMessages = await db.conversation.findMany({
    where: { firmId: firm.id, lastMessageAt: { not: null } },
    include: {
      user: { select: { name: true, email: true } },
      messages: { take: 1, orderBy: { createdAt: "desc" } },
    },
    orderBy: { lastMessageAt: "desc" },
    take: 5,
  });

  const recentReviews = await db.review.findMany({
    where: { firmId: firm.id, status: "APPROVED" },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const navItems = await firmNavItems(firm.id);

  const isPending = firm.status === "PENDING";
  const isSuspended = firm.status === "SUSPENDED" || firm.status === "REJECTED";

  return (
    <DashboardShell
      title="Firma Paneli"
      subtitle={`${firm.name} — son güncelleme: ${relativeTime(firm.updatedAt)}`}
      navTitle="Yönetim"
      navItems={navItems}
      currentPath="/firma-paneli"
      actions={
        <Link href={`/firma/${firm.slug}`} target="_blank" rel="noreferrer">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4" />
            Profilimi Gör
          </Button>
        </Link>
      }
    >
      {/* Status banner */}
      {isPending && (
        <div className="mb-4 flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-700" />
          <div>
            <p className="font-semibold text-amber-900">Firma onay bekliyor</p>
            <p className="mt-0.5 text-amber-800">
              Profilin admin onayından geçtikten sonra yayına alınır. Genellikle 24 saat içinde tamamlanır.
            </p>
          </div>
        </div>
      )}
      {isSuspended && (
        <div className="mb-4 flex gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-700" />
          <div>
            <p className="font-semibold text-red-900">
              {firm.status === "REJECTED" ? "Başvurunuz reddedildi" : "Firma askıya alındı"}
            </p>
            <p className="mt-0.5 text-red-800">Detay için destek ekibiyle iletişime geçin.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Profil görüntülenme" value={firm.viewCount} icon="Eye" accent="primary" />
        <StatCard label="Yeni teklif" value={firm._count.inquiries} icon="Inbox" hint="Yanıt bekleyen" accent="amber" />
        <StatCard label="Mesaj kutusu" value={firm._count.conversations} icon="MessageSquare" accent="emerald" />
        <StatCard
          label="Puan"
          value={firm.rating > 0 ? firm.rating.toFixed(1) : "—"}
          hint={`${firm.reviewCount} yorum`}
          icon="Star"
          accent="amber"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Yeni teklifler */}
        <section className="rounded-2xl border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-semibold">Yeni Teklif İstekleri</h2>
            <Link href="/firma-paneli/teklifler" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              Tümü <ArrowUpRight className="h-3 w-3" />
            </Link>
          </header>
          {newInquiries.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              Şu an yanıt bekleyen teklif yok.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {newInquiries.map((q) => (
                <li key={q.id}>
                  <Link
                    href={`/firma-paneli/teklifler/${q.id}`}
                    className="flex items-start gap-3 px-5 py-4 transition hover:bg-muted/50"
                  >
                    <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {(q.user.name ?? q.contactEmail).slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">
                          {q.user.name ?? q.contactEmail}
                        </p>
                        <Badge variant={q.status === "NEW" ? "warning" : "outline"}>
                          {q.status === "NEW" ? "Yeni" : "Okundu"}
                        </Badge>
                      </div>
                      <p className="line-clamp-2 text-xs text-muted-foreground">{q.message}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{relativeTime(q.createdAt)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Son mesajlar */}
        <section className="rounded-2xl border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-semibold">Son Mesajlar</h2>
            <Link href="/firma-paneli/mesajlar" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              Tümü <ArrowUpRight className="h-3 w-3" />
            </Link>
          </header>
          {recentMessages.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              Henüz mesaj yok.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recentMessages.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/firma-paneli/mesajlar/${c.id}`}
                    className="flex items-start gap-3 px-5 py-4 transition hover:bg-muted/50"
                  >
                    <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-secondary/10 text-xs font-semibold text-secondary">
                      {(c.user.name ?? c.user.email).slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-medium">
                          {c.user.name ?? c.user.email}
                        </p>
                        {c.unreadCount > 0 && (
                          <Badge variant="default" className="text-[10px]">{c.unreadCount}</Badge>
                        )}
                      </div>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {c.messages[0]?.content ?? "—"}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {c.lastMessageAt && relativeTime(c.lastMessageAt)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Son yorumlar */}
        <section className="rounded-2xl border border-border bg-card lg:col-span-2">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-semibold">Son Yorumlar</h2>
            <Link href="/firma-paneli/yorumlar" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              Tümü <ArrowUpRight className="h-3 w-3" />
            </Link>
          </header>
          {recentReviews.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              Henüz yorum yok. İlk yorumlar zamanla profilinde görünecek.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recentReviews.map((r) => (
                <li key={r.id} className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{r.user.name}</p>
                    <span className="inline-flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-amber-400" : "stroke-current opacity-30"}`} />
                      ))}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-foreground/85">{r.content}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{relativeTime(r.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Membership */}
      <section className="mt-6 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-secondary/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Üyelik</p>
            <p className="mt-1 inline-flex items-center gap-2 font-display text-lg font-semibold">
              {firm.membershipType === "PREMIUM" || firm.membershipType === "PRO" ? (
                <Award className="h-5 w-5 text-amber-500" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              )}
              {firm.membershipType}
            </p>
          </div>
          {firm.membershipType === "FREE" && (
            <Link href="/firma-paneli/abonelik">
              <Button>Premium'a Geç</Button>
            </Link>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
