import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function testSendMessage() {
  const user = await db.user.findUnique({ where: { email: "cift@example.com" }});
  const firm = await db.firm.findFirst({ where: { slug: "kuleli-konak-gebze" }});
  console.log("User:", user.id, "Firm:", firm.id, "Owner:", firm.ownerId);

  // simulate sendMessageAction's DB ops
  const conv = await db.conversation.upsert({
    where: { userId_firmId: { userId: user.id, firmId: firm.id }},
    update: {},
    create: { userId: user.id, firmId: firm.id },
  });
  console.log("Conv:", conv.id);

  const isFirmSide = user.id === firm.ownerId;
  const conv2 = await db.conversation.findUnique({ where: { id: conv.id }, select: { userId: true }});
  const receiverId = isFirmSide ? conv2.userId : firm.ownerId;
  console.log("Receiver:", receiverId);

  const receiver = await db.user.findUnique({ where: { id: receiverId }, select: { id: true }});
  console.log("Receiver exists:", !!receiver);

  if (!receiver) {
    console.log("=== BUG: Owner user does not exist in DB! ===");
    return;
  }

  const m = await db.message.create({
    data: {
      conversationId: conv.id,
      senderId: user.id,
      receiverId,
      content: "Test mesajı: " + Date.now(),
    },
  });
  console.log("Message OK:", m.id);

  await db.conversation.update({
    where: { id: conv.id },
    data: { lastMessageAt: m.createdAt, unreadCount: { increment: 1 }},
  });

  // simulate notify
  await db.notification.create({
    data: {
      userId: receiverId,
      kind: "MESSAGE_NEW",
      title: "Yeni mesaj",
      body: "Test",
      link: `/firma-paneli/mesajlar/${conv.id}`,
    },
  });
  console.log("Notify OK");

  await db.$disconnect();
}

testSendMessage().catch((e) => { console.error("FAILED:", e); process.exit(1); });
