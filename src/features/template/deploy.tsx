import { useState } from "react";
import { miniAppsType } from ".";
import Link from "next/link";

function Deploy({ miniApp }: { miniApp: miniAppsType }) {
    const [deploying, setDeploying] = useState(false);
    // const [status, setStatus] = useState(miniApp.deployStatus);
    const [deployError, setDeployError] = useState<string | null>(null);
    const [url, setUrl] = useState(miniApp.deploymentUrl);

    async function deploy() {
        setDeploying(true);
        setDeployError(null);
        // setStatus("DEPLOYING");

        const res = await fetch(`/api/mini-app/${miniApp.id}/deploy`, { method: "POST" });
        const data = await res.json();

        setDeploying(false);
        if (!res.ok) {
            // setStatus("ERROR");
            setDeployError(data.error ?? "Deployment failed");
            return;
        }
        // setStatus(data.status);
        setUrl(data.url ?? null);
    }
    return (
        <div>
            {deployError && <span className="text-sm text-red-400 max-w-sm">{deployError}</span>}
            {url && <Link href={url!} className="text-sm">{url}</Link>}
            <button onClick={deploy} className="text-sm bg-[#0066CC] text-white p-1 px-2.5 rounded-md">
                {deploying ? "deploying.." : "Deploy"}
            </button>
        </div>
    )
}

export default Deploy