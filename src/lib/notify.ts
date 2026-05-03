import "server-only";
import { db } from "@/lib/db";
import type { NotificationKind } from "@prisma/client";

type NotifyInput = {
  userId: string;
  kind: NotificationKind;
  title: string;
  body: string;
  link?: string | null;
  meta?: Record<string, unknown>;
};

export async function notify(input: NotifyInput) {
  return db.notification.create({
    data: {
      userId: input.userId,
      kind: input.kind,
      title: input.title,
      body: input.body,
      link: input.link ?? null,
      meta: (input.meta ?? null) as never,
    },
  });
}

export async function notifyMany(inputs: NotifyInput[]) {
  if (inputs.length === 0) return;
  return db.notification.createMany({
    data: inputs.map((i) => ({
      userId: i.userId,
      kind: i.kind,
      title: i.title,
      body: i.body,
      link: i.link ?? null,
      meta: (i.meta ?? null) as never,
    })),
  });
}

export async function unreadCount(userId: string): Promise<number> {
  return db.notification.count({ where: { userId, isRead: false } });
}
