"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Spinner } from "@/components/ui";
import theme from "@/theme";
import { useAdminUI } from "@/context/AdminUIContext";

export function AdminShell({ children }: { children: React.ReactNode }) {
    const { user, isAdmin, loading } = useAdminAuth();
    const { collapsed } = useAdminUI();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            router.replace("/login");
        }
    }, [loading, user, isAdmin, router]);

    if (loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: theme.colors.dark }}
            >
                <div className="flex flex-col items-center gap-4">
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: theme.colors.primary }}
                    >
                        <Spinner size={22} />
                    </div>
                    <p
                        style={{ color: theme.colors.subtitle }}
                        className="text-sm animate-pulse opacity-60"
                    >
                        Loading admin panel…
                    </p>
                </div>
            </div>
        );
    }

    if (!user || !isAdmin) return null;

    return (
        <div
            className="min-h-screen flex"
            style={{ backgroundColor: theme.colors.light }}
        >
            <Sidebar />

            {/* ✅ FIXED: no extra left gap */}
            <div
                className="flex-1 flex flex-col min-h-screen transition-all duration-300"
                style={{
                    paddingLeft: collapsed ? "64px" : "240px",
                }}
            >
                <Header />

                <main className="flex-1 p-6 animate-fade-up">
                    {children}
                </main>
            </div>
        </div>
    );
}