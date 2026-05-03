"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { audit } from "@/lib/audit";

export async function toggleFavoriteAction(firmId: string): Promise<{ ok: boolean; favorited?: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Önce giriş yapmalısın." };

  const existing = await db.favorite.findUnique({
    where: { userId_firmId: { userId: session.user.id, firmId } },
  });

  if (existing) {
    await db.favorite.delete({ where: { id: existing.id } });
    await audit({ userId: session.user.id, actorRole: session.user.role, action: "FAVORITE_REMOVE", resource: "Favorite", resourceId: existing.id, meta: { firmId } });
    revalidatePath("/hesabim/favorilerim");
    return { ok: true, favorited: false };
  } else {
    await db.favorite.create({
      data: { userId: session.user.id, firmId },
    });
    await audit({ userId: session.user.id, actorRole: session.user.role, action: "FAVORITE_ADD", resource: "Favorite", meta: { firmId } });
    revalidatePath("/hesabim/favorilerim");
    return { ok: true, favorited: true };
  }
}
