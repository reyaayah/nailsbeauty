// (admin)/admin/layout.tsx
import { AdminShell } from "@/components/layout/AdminShell";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { AdminTabProvider } from "@/context/AdminTabContext";
import { AdminUIProvider } from "@/context/AdminUIContext"; // ← already exists in your project

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminUIProvider>          {/* ← add this */}
        <AdminTabProvider>
          <AdminShell>{children}</AdminShell>
        </AdminTabProvider>
      </AdminUIProvider>
    </AdminAuthProvider>
  );
}