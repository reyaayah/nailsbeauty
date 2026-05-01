"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import theme from "@/theme";

/**
 * Wrap any page component with this to require authentication.
 *
 * Usage:
 *   export default withAuth(MyProtectedPage);
 */
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
    return function ProtectedPage(props: P) {
        const { user, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user) {
                router.replace("/auth/login");
            }
        }, [user, loading, router]);

        if (loading || !user) {
            return (
                <div
                    className="min-h-screen flex items-center justify-center"
                    style={{ backgroundColor: theme.colors.light }}
                >
                    <div
                        className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: theme.colors.primary }}
                    />
                </div>
            );
        }

        return <Component {...props} />;
    };
}
