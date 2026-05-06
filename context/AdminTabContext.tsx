"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type AdminTab =
  | "dashboard"
  | "products"
  | "orders"
  | "customers"
  | "collections"
  | "blog"
  | "settings"
  | "products/new"
  | "products/edit"
  | "orders/detail"
  | "customers/detail";

interface AdminTabContextValue {
  activeTab: AdminTab;
  selectedId: string | null;
  setTab: (tab: AdminTab, id?: string) => void;
  goBack: () => void;
}

const AdminTabContext = createContext<AdminTabContextValue | null>(null);

export function AdminTabProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Simple one-level history for back navigation from detail views
  const [prevTab, setPrevTab] = useState<AdminTab>("dashboard");

  const setTab = (tab: AdminTab, id?: string) => {
    setPrevTab(activeTab);
    setActiveTab(tab);
    setSelectedId(id ?? null);
  };

  const goBack = () => {
    setActiveTab(prevTab);
    setSelectedId(null);
  };

  return (
    <AdminTabContext.Provider value={{ activeTab, selectedId, setTab, goBack }}>
      {children}
    </AdminTabContext.Provider>
  );
}

export function useAdminTab() {
  const ctx = useContext(AdminTabContext);
  if (!ctx) throw new Error("useAdminTab must be used within AdminTabProvider");
  return ctx;
}
