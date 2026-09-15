import { useState } from "react";
import { miniAppsType } from ".";
import { useRouter } from "next/navigation";

function Deploy({ miniApp }: { miniApp: miniAppsType }) {
    const router = useRouter()
    const [deploying, setDeploying] = useState(false);
    const [deployError, setDeployError] = useState<string | null>(null);

    async function deploy() {
        setDeploying(true);
        setDeployError(null);

        const res = await fetch(`/api/mini-app/${miniApp.id}/deploy`, { method: "POST" });
        const data = await res.json();

        setDeploying(false);
        if (!res.ok) {
            setDeployError(data.error ?? "Deployment failed");
            return;
        } else {
            router.replace(`/template/${miniApp.template}`)
        }
    }
    return (
        <div className="flex flex-col gap-1.5">
            {deployError && <div className="text-sm text-red-400 max-w-sm">{deployError}</div>}
            <button onClick={deploy} className="text-sm bg-[#0066CC] text-white p-1 px-2.5 rounded-md">
                {deploying ? "deploying.." : "Deploy"}
            </button>
        </div>
    )
}

export default Deploy