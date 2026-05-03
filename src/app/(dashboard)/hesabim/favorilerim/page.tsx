import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { coupleNavItems } from "../_nav";
import { FirmCard } from "@/components/shared/firm-card";
import { firmCardSelect } from "@/lib/firm";

export const metadata = { title: "Favorilerim" };
export const dynamic = "force-dynamic";

export default async function FavorilerimPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/cift");

  const favorites = await db.favorite.findMany({
    where: { userId: session.user.id },
    include: { firm: { select: firmCardSelect } },
    orderBy: { createdAt: "desc" },
  });

  const navItems = await coupleNavItems(session.user.id);

  return (
    <DashboardShell
      title="Favorilerim"
      subtitle="Beğendiğiniz, takip etmek istediğiniz firmalar."
      navTitle="Düğün Yolculuğu"
      navItems={navItems}
      currentPath="/hesabim/favorilerim"
    >
      {favorites.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
          <Heart className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 font-display text-lg font-semibold">Henüz favori firma yok</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Firma sayfalarındaki kalp ikonuna tıklayarak buraya kaydedebilirsin.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Firmaları Keşfet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((f) => (
            <FirmCard key={f.id} firm={f.firm} />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
