"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { notify } from "@/lib/notify";
import { audit } from "@/lib/audit";
import { sanitizeText } from "@/lib/sanitize";
import { ipFromHeaders, memoryRateLimit, LIMITS } from "@/lib/rate-limit";
import { requireConversationAccess } from "@/lib/auth-guards";

const sendSchema = z.object({
  conversationId: z.string().optional(),
  firmId: z.string().optional(),
  content: z.string().min(1).max(2000),
});

export type MessageState = { ok?: boolean; error?: string };

/** Yeni mesaj gönder. Konuşma yoksa firmaId ile yarat. */
export async function sendMessageAction(
  _prev: MessageState,
  formData: FormData,
): Promise<MessageState> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { ok: false, error: "Önce giriş yapmalısın." };

    // JWT'de id olup DB'de kullanıcı silinmişse FK violation'a takılırız.
    const sessionUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });
    if (!sessionUser) {
      return { ok: false, error: "Oturum bilgisi geçersiz. Lütfen yeniden giriş yap." };
    }

    const h = await headers();
    const rl = memoryRateLimit(`msg:${session.user.id}`, LIMITS.message.max, LIMITS.message.windowMs);
    if (!rl.ok) return { ok: false, error: "Çok hızlı mesaj atıyorsun. Bir dakika bekle." };

    const parsed = sendSchema.safeParse({
      conversationId: formData.get("conversationId")?.toString() || undefined,
      firmId: formData.get("firmId")?.toString() || undefined,
      content: String(formData.get("content") ?? ""),
    });
    if (!parsed.success) return { ok: false, error: "Mesaj formu hatalı." };

    let conversationId = parsed.data.conversationId;
    let firm: { id: string; ownerId: string; slug: string; name: string } | null = null;

    if (conversationId) {
      try {
        const access = await requireConversationAccess(conversationId);
        firm = await db.firm.findUnique({
          where: { id: access.conv.firmId },
          select: { id: true, ownerId: true, slug: true, name: true },
        });
      } catch (e) {
        console.error("[message] conversation access denied:", e);
        return { ok: false, error: "Bu konuşmaya erişim yok." };
      }
    } else if (parsed.data.firmId) {
      firm = await db.firm.findUnique({
        where: { id: parsed.data.firmId },
        select: { id: true, ownerId: true, slug: true, name: true },
      });
      if (!firm) return { ok: false, error: "Firma bulunamadı." };

      const conv = await db.conversation.upsert({
        where: { userId_firmId: { userId: session.user.id, firmId: firm.id } },
        update: {},
        create: { userId: session.user.id, firmId: firm.id },
      });
      conversationId = conv.id;
    } else {
      return { ok: false, error: "Konuşma veya firma bilgisi eksik." };
    }

    if (!firm) return { ok: false, error: "Firma bulunamadı." };

    // Alıcı: gönderen çift ise firma sahibi, gönderen firma sahibi ise konuşmadaki çift
    const isFirmSide = session.user.id === firm.ownerId;
    const conv = await db.conversation.findUnique({
      where: { id: conversationId! },
      select: { userId: true },
    });
    if (!conv) return { ok: false, error: "Konuşma bulunamadı." };

    // Firma sahibi yoksa (orphan firm) çift kendi kendisine yazmaya çalışmasın.
    if (!firm.ownerId && !isFirmSide) {
      return { ok: false, error: "Bu firma için iletişim kanalı şu an kapalı." };
    }
    const receiverId = isFirmSide ? conv.userId : firm.ownerId;

    // Alıcı kullanıcının var olduğunu doğrula (FK violation önleme).
    const receiver = await db.user.findUnique({
      where: { id: receiverId },
      select: { id: true },
    });
    if (!receiver) {
      return { ok: false, error: "Alıcı kullanıcı bulunamadı." };
    }

    const ipHash = ipFromHeaders(h).slice(0, 32);

    const message = await db.message.create({
      data: {
        conversationId: conversationId!,
        senderId: session.user.id,
        receiverId,
        content: sanitizeText(parsed.data.content, 2000),
      },
    });

    try {
      await db.conversation.update({
        where: { id: conversationId! },
        data: { lastMessageAt: message.createdAt, unreadCount: { increment: 1 } },
      });
    } catch (e) {
      console.error("[message] conversation update failed:", e);
    }

    try {
      await notify({
        userId: receiverId,
        kind: "MESSAGE_NEW",
        title: isFirmSide
          ? `${firm.name} sana yazdı`
          : "Yeni mesaj",
        body: parsed.data.content.slice(0, 120),
        link: isFirmSide ? `/hesabim/mesajlar/${conversationId}` : `/firma-paneli/mesajlar/${conversationId}`,
      });
    } catch (e) {
      console.error("[message] notify failed:", e);
    }

    await audit({
      userId: session.user.id,
      actorRole: session.user.role,
      action: "MESSAGE_SEND",
      resource: "Message",
      resourceId: message.id,
      meta: { conversationId, firmId: firm.id, ipHash },
    });

    revalidatePath(`/firma-paneli/mesajlar/${conversationId}`);
    revalidatePath(`/hesabim/mesajlar/${conversationId}`);
    return { ok: true };
  } catch (error) {
    console.error("[sendMessageAction] failed:", error);
    return { ok: false, error: "Mesaj gönderilemedi. Lütfen tekrar dene." };
  }
}

export async function markConversationReadAction(conversationId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const access = await requireConversationAccess(conversationId).catch(() => null);
  if (!access) return;

  await db.message.updateMany({
    where: {
      conversationId,
      receiverId: session.user.id,
      isRead: false,
    },
    data: { isRead: true, readAt: new Date() },
  });

  await db.conversation.update({
    where: { id: conversationId },
    data: { unreadCount: 0 },
  });

  revalidatePath(`/firma-paneli/mesajlar/${conversationId}`);
  revalidatePath(`/hesabim/mesajlar/${conversationId}`);
}
