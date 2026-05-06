"use client";

import { createContext, useContext, useState } from "react";

type AdminUIContextType = {
    collapsed: boolean;
    setCollapsed: (val: boolean) => void;
};

const AdminUIContext = createContext<AdminUIContextType | null>(null);

export function AdminUIProvider({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <AdminUIContext.Provider value={{ collapsed, setCollapsed }}>
            {children}
        </AdminUIContext.Provider>
    );
}

export function useAdminUI() {
    const ctx = useContext(AdminUIContext);
    if (!ctx) throw new Error("useAdminUI must be used inside AdminUIProvider");
    return ctx;
}