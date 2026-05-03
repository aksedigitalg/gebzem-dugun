"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { sanitizeText } from "@/lib/sanitize";

const upsertSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2).max(280),
  description: z.string().max(1000).optional().or(z.literal("")),
  category: z.string().max(80).optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal("")),
});

export async function upsertChecklistItemAction(_prev: { ok?: boolean; error?: string }, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Giriş yapmalısın." };

  const parsed = upsertSchema.safeParse({
    id: formData.get("id")?.toString() || undefined,
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? ""),
    dueDate: String(formData.get("dueDate") ?? ""),
  });
  if (!parsed.success) return { ok: false, error: "Form hatalı." };

  const dueDate = parsed.data.dueDate ? new Date(parsed.data.dueDate) : null;

  if (parsed.data.id) {
    await db.checklistItem.update({
      where: { id: parsed.data.id, userId: session.user.id },
      data: {
        title: sanitizeText(parsed.data.title, 280),
        description: parsed.data.description ? sanitizeText(parsed.data.description, 1000) : null,
        category: parsed.data.category || null,
        dueDate,
      },
    });
  } else {
    await db.checklistItem.create({
      data: {
        userId: session.user.id,
        title: sanitizeText(parsed.data.title, 280),
        description: parsed.data.description ? sanitizeText(parsed.data.description, 1000) : null,
        category: parsed.data.category || null,
        dueDate,
      },
    });
  }
  revalidatePath("/hesabim/checklist");
  return { ok: true };
}

export async function toggleChecklistItemAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false };
  const item = await db.checklistItem.findFirst({ where: { id, userId: session.user.id } });
  if (!item) return { ok: false };
  await db.checklistItem.update({ where: { id }, data: { completed: !item.completed } });
  revalidatePath("/hesabim/checklist");
  return { ok: true };
}

export async function deleteChecklistItemAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false };
  await db.checklistItem.deleteMany({ where: { id, userId: session.user.id } });
  revalidatePath("/hesabim/checklist");
  return { ok: true };
}
