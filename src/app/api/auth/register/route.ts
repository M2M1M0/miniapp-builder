import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  const { phone, password, name } = await req.json();

  if (!phone || !password) {
    return Response.json({ error: "Phone and password are required" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    return Response.json({ error: "Phone already registered" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { phone, passwordHash, name } });
  await createSession(user.id);

  return Response.json({ id: user.id, phone: user.phone }, { status: 201 });
}
