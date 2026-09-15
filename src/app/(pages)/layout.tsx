import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <header className="border-b bg-white px-6 py-4">
                <div className="mx-auto flex max-w-4xl items-center justify-between">
                    <Link href="/dashboard" className="font-semibold">
                        We Builder
                    </Link>
                    <LogoutButton />
                </div>
            </header>
            <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
        </div>
    );
}
