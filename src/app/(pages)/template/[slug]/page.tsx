import Template from "@/features/template"
import { prisma } from "@/lib/prisma";

type Props = {
    params: Promise<{ slug: string }>;
};

async function page({ params }: Props) {
    const { slug } = await params;

    const miniApps = await prisma.miniApp.findMany({
        where: { template: slug },
        orderBy: { createdAt: "desc" },
    });
    console.log(miniApps)
    return (
        <Template template={slug} miniApps={miniApps} />
    )
}

export default page;