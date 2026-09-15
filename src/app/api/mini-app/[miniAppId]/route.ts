import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ miniAppId: string }> },
) {
  const { miniAppId } = await params;
  console.log(miniAppId, "-------------------");
  const miniApp = await prisma.miniApp.findUnique({
    where: { id: miniAppId },
    select: {
      id: true,
      name: true,
      template: true,
      slug: true,
      themeColor: true,
      logoUrl: true,
    },
  });

  if (!miniApp) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(miniApp);
}
