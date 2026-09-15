import { miniAppsType } from ".";
import Deploy from "./deploy";

function MiniApps({ miniApps }: { miniApps: miniAppsType[] }) {
    return (
        <div>
            {miniApps.length === 0 ? (
                <div className="text-gray-600 h-48 flex items-center justify-center">You haven&apos;t created a mini app yet.</div>
            ) : (
                <ul className="flex flex-col gap-3">
                    {miniApps.map((miniApp) => (
                        <li key={miniApp.id}>
                            <div
                                className="block rounded border bg-white p-4 hover:border-gray-400"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{miniApp.name}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500">{miniApp.deployStatus}</span>
                                        {miniApp.deployStatus !== "READY" &&
                                            <Deploy miniApp={miniApp} />
                                        }
                                    </div>
                                </div>
                                {miniApp.deploymentUrl && <span className="text-sm text-blue-600">{miniApp.deploymentUrl}</span>}

                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default MiniApps