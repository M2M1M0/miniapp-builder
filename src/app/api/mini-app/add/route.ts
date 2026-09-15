import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, slug, template } = await req.json();
  const newMiniApp = await prisma.miniApp.create({
    data: { slug, template, name },
  });

  return Response.json({ name: newMiniApp.name });
}
