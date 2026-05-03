"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function markNotificationReadAction(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;
  await db.notification.updateMany({
    where: { id, userId: session.user.id, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
  revalidatePath("/hesabim/bildirimler");
}

export async function markAllNotificationsReadAction(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;
  await db.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
  revalidatePath("/hesabim/bildirimler");
}
