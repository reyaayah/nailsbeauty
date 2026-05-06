import { AdminAuthProvider } from "@/context/AdminAuthContext";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminAuthProvider>
            {children}
        </AdminAuthProvider>
    );
}
