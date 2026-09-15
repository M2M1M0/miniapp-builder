import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  createProject,
  setEnvVars,
  triggerDeployment,
  getDeployment,
} from "@/lib/vercel";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ miniAppId: string }> },
) {
  const session = await getSession();
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { miniAppId } = await params;
  const miniApp = await prisma.miniApp.findUnique({ where: { id: miniAppId } });
  if (!miniApp) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.miniApp.update({
    where: { id: miniAppId },
    data: { deployStatus: "DEPLOYING" },
  });

  try {
    const projectName = `${miniApp.template}-${miniApp.slug}`;
    const project = miniApp.vercelProjectId
      ? { id: miniApp.vercelProjectId }
      : await createProject(projectName, {
          owner: process.env.TEMPLATE_REPO_OWNER!,
          repo: miniApp.template!,
        });

    await setEnvVars(project.id, {
      MINI_APP_ID: miniApp.id,
      NEXT_PUBLIC_APP_URL: `${process.env.NEXT_PUBLIC_APP_URL}/api`,
    });

    const deployment = await triggerDeployment(projectName, project.id, {
      owner: process.env.TEMPLATE_REPO_OWNER!,
      repo: miniApp.template!,
    });

    await prisma.miniApp.update({
      where: { id: miniAppId },
      data: { vercelProjectId: project.id, lastDeploymentId: deployment.id },
    });

    // Simple poll loop. In production, prefer a Vercel webhook
    // (integration-configuration webhook) over polling.
    let d = deployment;
    for (
      let i = 0;
      i < 30 && !["READY", "ERROR", "CANCELED"].includes(d.readyState);
      i++
    ) {
      await new Promise((r) => setTimeout(r, 2000));
      d = await getDeployment(deployment.id);
    }

    const finalStatus = d.readyState === "READY" ? "READY" : "ERROR";
    const deploymentUrl = d.readyState === "READY" ? `https://${d.url}` : null;

    await prisma.miniApp.update({
      where: { id: miniAppId },
      data: { deployStatus: finalStatus, deploymentUrl },
    });

    return Response.json({ status: finalStatus, url: deploymentUrl });
  } catch (err) {
    await prisma.miniApp.update({
      where: { id: miniAppId },
      data: { deployStatus: "ERROR" },
    });
    const message = err instanceof Error ? err.message : "Deployment failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
