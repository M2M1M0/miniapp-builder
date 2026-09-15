const VERCEL_API = "https://api.vercel.com";
const TOKEN = process.env.VERCEL_API_TOKEN!;

const jsonHeaders = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

export type VercelDeployment = {
  id: string;
  url: string;
  alias?: string[];
  aliasAssigned?: boolean;
  readyState:
    | "QUEUED"
    | "INITIALIZING"
    | "BUILDING"
    | "READY"
    | "ERROR"
    | "CANCELED";
};

export type TemplateRepo = {
  owner: string;
  repo: string;
  /** Default branch to deploy from. Defaults to "main". */
  ref?: string;
};

export const TEMPLATES = {
  default: {
    owner: process.env.TEMPLATE_REPO_OWNER!,
    repo: process.env.TEMPLATE_REPO_NAME!,
  },
} satisfies Record<string, TemplateRepo>;

export function resolveTemplate(key: string): TemplateRepo {
  const template = (TEMPLATES as Record<string, TemplateRepo>)[key];
  if (!template) {
    throw new Error(`Unknown template: ${key}`);
  }
  return template;
}

export async function createProject(name: string, template: TemplateRepo) {
  const res = await fetch(`${VERCEL_API}/v10/projects`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({
      name,
      gitRepository: {
        type: "github",
        repo: `${template.owner}/${template.repo}`,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Vercel createProject failed: ${await res.text()}`);
  }

  return res.json() as Promise<{
    id: string;
    name: string;
  }>;
}

export async function setEnvVars(
  projectId: string,
  vars: Record<string, string>,
) {
  const res = await fetch(`${VERCEL_API}/v10/projects/${projectId}/env`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(
      Object.entries(vars).map(([key, value]) => ({
        key,
        value,
        type: "plain",
        target: ["production", "preview"],
      })),
    ),
  });

  if (!res.ok) {
    throw new Error(`Vercel setEnvVars failed: ${await res.text()}`);
  }
}

export async function triggerDeployment(
  name: string,
  projectId: string,
  template: TemplateRepo,
) {
  const res = await fetch(
    `${VERCEL_API}/v13/deployments?skipAutoDetectionConfirmation=1`,
    {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({
        name,
        project: projectId,
        target: "production",
        gitSource: {
          type: "github",
          org: template.owner,
          repo: template.repo,
          ref: template.ref ?? "main",
        },
      }),
    },
  );

  if (!res.ok) {
    throw new Error(`Vercel triggerDeployment failed: ${await res.text()}`);
  }

  return res.json() as Promise<VercelDeployment>;
}

export async function getDeployment(deploymentId: string) {
  const res = await fetch(`${VERCEL_API}/v13/deployments/${deploymentId}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Vercel getDeployment failed: ${await res.text()}`);
  }

  return res.json() as Promise<VercelDeployment>;
}
