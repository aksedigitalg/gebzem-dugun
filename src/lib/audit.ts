import "server-only";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import type { AuditStatus } from "@prisma/client";

type AuditInput = {
  userId?: string | null;
  actorRole?: string | null;
  impersonatorId?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  status?: AuditStatus;
  meta?: Record<string, unknown>;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  requestId?: string | null;
};

/**
 * Audit log yazıcı — best-effort. Hata olursa sessizce loglar (audit yazımı
 * asıl iş akışını engellememeli).
 */
export async function audit(input: AuditInput): Promise<void> {
  try {
    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      h.get("x-real-ip") ??
      null;
    const userAgent = h.get("user-agent") ?? null;

    await db.auditLog.create({
      data: {
        userId: input.userId ?? null,
        actorRole: input.actorRole ?? null,
        impersonatorId: input.impersonatorId ?? null,
        action: input.action,
        resource: input.resource,
        resourceId: input.resourceId ?? null,
        status: input.status ?? "SUCCESS",
        meta: (input.meta ?? null) as never,
        before: (input.before ?? null) as never,
        after: (input.after ?? null) as never,
        ip,
        userAgent,
        requestId: input.requestId ?? null,
      },
    });
  } catch (err) {
    console.error("[audit] write failed:", err);
  }
}
