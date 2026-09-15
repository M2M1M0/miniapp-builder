"use client"

import { useState } from "react";
import MiniApps from "./mini-apps";
import { useRouter } from "next/navigation";

export type miniAppsType = {
    slug: string;
    template: string;
    name: string;
    id: string;
    themeColor: string;
    logoUrl: string | null;
    vercelProjectId: string | null;
    lastDeploymentId: string | null;
    deployStatus: string;
    deploymentUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}

function Template({ template, miniApps }: { template: string, miniApps: miniAppsType[] }) {
    const router = useRouter()
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    async function createMiniApp(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const res = await fetch("/api/mini-app/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ template, slug, name }),
        });

        setLoading(false);
        if (!res.ok) {
            const data = await res.json();
            setError(data.error ?? "Adding MiniApp Failed");
            return;
        } else {
            setName("")
            setSlug("")
            router.replace(`/template/${template}`)
        }

    }

    return (
        <div className="relative w-full h-full flex flex-col gap-5">

            <p>
                List of mini app in: <strong className="capitalize">{template?.replace("-", " ")}</strong>
            </p>

            <MiniApps miniApps={miniApps} />

            <form onSubmit={createMiniApp} className="flex flex-col gap-3 max-w-md">
                <input
                    className="rounded border px-3 py-2"
                    placeholder="Mini App Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    className="rounded border px-3 py-2"
                    placeholder="Slug ( mini app unique identifier like new-mini-app )"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex justify-end">
                    <button className="rounded bg-gray-900 p-2 px-3 text-white disabled:opacity-50" disabled={loading}>
                        {loading ? "Loading..." : "Create"}
                    </button>
                </div>
            </form>
        </div >
    )
}

export default Template