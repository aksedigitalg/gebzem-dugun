import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar, Users, Wallet } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { firmNavItems } from "../../_nav";
import { ReplyForm } from "./reply-form";
import { Badge } from "@/components/ui/badge";
import { formatPrice, relativeTime, formatDate } from "@/lib/utils";

export const metadata = { title: "Teklif Detayı" };
export const dynamic = "force-dynamic";

export default async function TeklifDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/isletme");
  const { id } = await params;

  const inquiry = await db.inquiry.findFirst({
    where: {
      id,
      firm: {
        OR: [
          { ownerId: session.user.id },
          { staff: { some: { userId: session.user.id } } },
        ],
      },
    },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      firm: { select: { id: true, slug: true, name: true } },
    },
  });
  if (!inquiry) notFound();

  // İlk açılışta NEW → READ işaretle
  if (inquiry.status === "NEW") {
    await db.inquiry.update({ where: { id: inquiry.id }, data: { status: "READ" } });
  }

  const navItems = await firmNavItems(inquiry.firm.id);

  return (
    <DashboardShell
      title="Teklif Detayı"
      subtitle={`Talebi gönderen: ${inquiry.user.name ?? inquiry.contactEmail}`}
      navTitle="Yönetim"
      navItems={navItems}
      currentPath="/firma-paneli/teklifler"
    >
      <Link
        href="/firma-paneli/teklifler"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Tüm teklifler
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* İçerik */}
        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-6">
            <header className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Talep Mesajı</h2>
              <Badge variant={inquiry.status === "RESPONDED" ? "success" : "warning"}>
                {inquiry.status}
              </Badge>
            </header>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{inquiry.message}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              Gönderildi: {relativeTime(inquiry.createdAt)} ({formatDate(inquiry.createdAt)})
            </p>
          </section>

          {inquiry.firmResponse && (
            <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <h3 className="font-display text-base font-semibold text-emerald-900">Önceki Yanıtınız</h3>
              <p className="mt-2 whitespace-pre-line text-sm text-emerald-900/85">{inquiry.firmResponse}</p>
              {inquiry.responseAt && (
                <p className="mt-2 text-xs text-emerald-700">{relativeTime(inquiry.responseAt)}</p>
              )}
            </section>
          )}

          <ReplyForm
            inquiryId={inquiry.id}
            existingResponse={inquiry.firmResponse}
            firmName={inquiry.firm.name}
          />
        </div>

        {/* Yan panel */}
        <aside className="space-y-3 rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Müşteri Bilgileri</p>
          <p className="font-display text-lg font-semibold">{inquiry.user.name ?? "(İsim yok)"}</p>

          <div className="space-y-2 text-sm">
            <a
              href={`mailto:${inquiry.contactEmail}`}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 hover:border-primary"
            >
              <Mail className="h-4 w-4 text-muted-foreground" /> {inquiry.contactEmail}
            </a>
            <a
              href={`tel:${inquiry.contactPhone}`}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 hover:border-primary"
            >
              <Phone className="h-4 w-4 text-muted-foreground" /> {inquiry.contactPhone}
            </a>
            {inquiry.preferredContact === "whatsapp" && (
              <a
                href={`https://wa.me/${inquiry.contactPhone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border bg-emerald-50 px-3 py-2 text-emerald-700"
              >
                💬 WhatsApp ile yaz (tercih edilen)
              </a>
            )}
          </div>

          <div className="border-t border-border pt-3 space-y-2 text-sm">
            {inquiry.weddingDate && (
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" /> {formatDate(inquiry.weddingDate)}
              </p>
            )}
            {inquiry.guestCount && (
              <p className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" /> {inquiry.guestCount} davetli
              </p>
            )}
            {inquiry.budget && (
              <p className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted-foreground" /> {formatPrice(inquiry.budget)}
              </p>
            )}
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
