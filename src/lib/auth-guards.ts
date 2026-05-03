import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export class ForbiddenError extends Error {
  constructor(msg = "FORBIDDEN") {
    super(msg);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends Error {
  constructor(msg = "NOT_FOUND") {
    super(msg);
    this.name = "NotFoundError";
  }
}

/**
 * Auth.js v5 + Next 15 — server action / RSC içinde oturum zorunluluğu.
 * Cookie-based JWT'yi okur; oturum yoksa /cift'e yönlendirir.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) redirect("/cift");
  return session as typeof session & { user: { id: string; role: string } };
}

export type AppRole =
  | "COUPLE"
  | "FIRM_OWNER"
  | "FIRM_STAFF"
  | "ADMIN"
  | "SUPER_ADMIN";

/**
 * Belirli rollerden birine sahip oturum şartı.
 * Yetkisiz kullanıcıları erişim ekranlarına geri yönlendir.
 */
export async function requireRole(...roles: AppRole[]) {
  const session = await requireAuth();
  if (!roles.includes(session.user.role as AppRole)) {
    if (roles.some((r) => r === "FIRM_OWNER" || r === "FIRM_STAFF")) redirect("/isletme");
    if (roles.some((r) => r === "ADMIN" || r === "SUPER_ADMIN")) redirect("/admin");
    redirect("/cift");
  }
  return session;
}

/**
 * Firma sahipliğini atomik olarak doğrula. WHERE'a ownerId koymadan asla
 * güvenli olmaz (IDOR). Admin override destekli.
 */
export async function requireFirmOwnership(
  firmIdOrSlug: string,
  options: { allowAdmin?: boolean } = { allowAdmin: true },
) {
  const session = await requireAuth();
  const role = session.user.role as AppRole;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  const where =
    options.allowAdmin && isAdmin
      ? {
          OR: [{ id: firmIdOrSlug }, { slug: firmIdOrSlug }],
        }
      : {
          AND: [
            { OR: [{ id: firmIdOrSlug }, { slug: firmIdOrSlug }] },
            {
              OR: [
                { ownerId: session.user.id },
                { staff: { some: { userId: session.user.id } } },
              ],
            },
          ],
        };

  const firm = await db.firm.findFirst({ where });
  if (!firm) throw new NotFoundError();
  return { session, firm, isAdmin };
}

/**
 * Konuşma erişimi kontrolü. Konuşma yalnızca çift veya firma sahibi (ya da admin) tarafından okunabilir.
 */
export async function requireConversationAccess(conversationId: string) {
  const session = await requireAuth();
  const role = session.user.role as AppRole;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  const conv = await db.conversation.findUnique({
    where: { id: conversationId },
    include: { firm: { select: { ownerId: true, staff: { select: { userId: true } } } } },
  });
  if (!conv) throw new NotFoundError();

  const isCouple = conv.userId === session.user.id;
  const isFirmSide =
    conv.firm.ownerId === session.user.id ||
    conv.firm.staff.some((s) => s.userId === session.user.id);

  if (!(isCouple || isFirmSide || isAdmin)) throw new ForbiddenError();
  return { session, conv, isAdmin, side: isCouple ? "COUPLE" : "FIRM" };
}
