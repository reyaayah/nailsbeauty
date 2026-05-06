"use client";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useAdminTab, AdminTab } from "@/context/AdminTabContext";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Layers,
  BookOpen, Settings, LogOut, Sparkles, ChevronRight,
  PanelLeftClose, PanelLeft, ShieldAlert
} from "lucide-react";
import { useState } from "react";
import theme from "@/theme";

const NAV: { tab: AdminTab; label: string; icon: React.ElementType }[] = [
  { tab: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { tab: "products", label: "Products", icon: Package },
  { tab: "orders", label: "Orders", icon: ShoppingBag },
  { tab: "customers", label: "Customers", icon: Users },
  { tab: "collections", label: "Collections", icon: Layers },
  { tab: "blog", label: "Blog", icon: BookOpen },
  { tab: "settings", label: "Settings", icon: Settings },
];

const PARENT_TAB: Partial<Record<AdminTab, AdminTab>> = {
  "products/new": "products",
  "products/edit": "products",
  "orders/detail": "orders",
  "customers/detail": "customers",
};

export function Sidebar() {
  const { user, logout } = useAdminAuth();
  const { activeTab, setTab } = useAdminTab();
  const [collapsed, setCollapsed] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false); // New State

  const effectiveTab = PARENT_TAB[activeTab] ?? activeTab;

  // Handle the actual logout action
  const handleLogout = async () => {
    setShowConfirmLogout(false);
    await logout();
  };

  return (
    <>
      <aside
        style={{ backgroundColor: theme.colors.dark }}
        className={cn(
          "fixed top-0 left-0 bottom-0 z-30 flex flex-col transition-all duration-300 shadow-xl",
          collapsed ? "w-16" : "w-[240px]"
        )}
      >
        {/* Logo Section */}
        <div
          style={{ borderColor: "rgba(247, 243, 237, 0.1)" }}
          className={cn("flex items-center gap-3 h-14 border-b px-4 flex-shrink-0", collapsed && "justify-center px-2")}
        >
          <div
            style={{ backgroundColor: theme.colors.primary }}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
          >
            <Sparkles size={15} style={{ color: theme.colors.light }} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p style={{ color: theme.colors.light }} className="font-semibold text-sm leading-none tracking-tight">
                Gloss & Grace
              </p>
              <p style={{ color: theme.colors.subtitle }} className="text-[10px] mt-1 uppercase tracking-widest opacity-60">
                Admin
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {NAV.map(({ tab, label, icon: Icon }) => {
            const active = effectiveTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setTab(tab)}
                title={collapsed ? label : undefined}
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl px-3 h-10 text-sm transition-all duration-150 group",
                  collapsed && "justify-center px-2",
                  active ? "font-medium" : "opacity-60 hover:opacity-100"
                )}
                style={{
                  backgroundColor: active ? "rgba(219, 161, 162, 0.15)" : "transparent",
                  color: active ? theme.colors.primary : theme.colors.light,
                }}
              >
                <Icon
                  size={18}
                  className="flex-shrink-0"
                  style={{ color: active ? theme.colors.primary : theme.colors.light }}
                />
                {!collapsed && <span className="flex-1 truncate text-left">{label}</span>}
                {!collapsed && active && <ChevronRight size={14} />}
              </button>
            );
          })}
        </nav>

        {/* Footer / User Profile */}
        <div
          style={{ borderColor: "rgba(247, 243, 237, 0.1)" }}
          className="border-t p-2 flex-shrink-0 space-y-1"
        >
          {!collapsed && (
            <div className="px-3 py-3 flex items-center gap-2.5">
              <div
                style={{ backgroundColor: theme.colors.muted, color: theme.colors.dark }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              >
                {user?.email?.[0]?.toUpperCase() ?? "A"}
              </div>
              <div className="min-w-0">
                <p style={{ color: theme.colors.light }} className="text-xs font-medium truncate opacity-90">
                  {user?.email}
                </p>
                <p style={{ color: theme.colors.subtitle }} className="text-[10px] opacity-50">
                  Super Admin
                </p>
              </div>
            </div>
          )}

          {/* Trigger the confirmation modal instead of direct logout */}
          <button
            onClick={() => setShowConfirmLogout(true)}
            style={{ color: theme.colors.light }}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 h-9 rounded-xl text-sm opacity-60 hover:opacity-100 hover:bg-red-500/10 hover:text-red-300 transition-all",
              collapsed && "justify-center"
            )}
          >
            <LogOut size={16} />
            {!collapsed && "Sign out"}
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: theme.colors.light }}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 h-9 rounded-xl text-sm opacity-40 hover:opacity-80 transition-all",
              collapsed && "justify-center"
            )}
          >
            {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── ADMIN LOGOUT CONFIRMATION MODAL ── */}
      {showConfirmLogout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowConfirmLogout(false)}
          />

          <div
            className="relative w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border"
            style={{ backgroundColor: theme.colors.light, borderColor: "rgba(0,0,0,0.05)" }}
          >
            <div className="p-8 flex flex-col items-center text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 rotate-12"
                style={{ backgroundColor: theme.colors.dark }}
              >
                <ShieldAlert size={32} style={{ color: theme.colors.primary }} />
              </div>

              <h3 className="text-2xl font-serif mb-2" style={{ color: theme.colors.dark }}>
                End Session?
              </h3>
              <p className="text-sm font-light leading-relaxed mb-8" style={{ color: theme.colors.dark, opacity: 0.7 }}>
                You are about to sign out of the administrative portal. Unsaved changes to products or settings may be lost.
              </p>

              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={handleLogout}
                  className="w-full py-4 rounded-xl text-white text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-black/20"
                  style={{ backgroundColor: theme.colors.dark }}
                >
                  Confirm Sign Out
                </button>

                <button
                  onClick={() => setShowConfirmLogout(false)}
                  className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors hover:bg-black/5"
                  style={{ color: theme.colors.muted }}
                >
                  Stay Logged In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}