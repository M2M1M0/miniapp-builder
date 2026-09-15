import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  const { phone, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return Response.json({ error: "Invalid phone or password" }, { status: 401 });
  }

  await createSession(user.id);
  return Response.json({ id: user.id, phone: user.phone });
}
