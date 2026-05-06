"use client";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import theme from "@/theme";

const TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/products": "Products",
  "/admin/orders": "Orders",
  "/admin/customers": "Customers",
  "/admin/collections": "Collections",
  "/admin/blog": "Blog",
  "/admin/settings": "Settings",
};

export function Header() {
  const pathname = usePathname();
  const { user } = useAdminAuth();

  const title = Object.entries(TITLES).find(
    ([k]) => pathname === k || pathname.startsWith(k + "/")
  )?.[1] ?? "Admin";

  return (
    <header
      style={{ backgroundColor: theme.colors.light, borderColor: theme.colors.muted }}
      className="h-14 border-b flex items-center justify-between px-6 gap-4 sticky top-0 z-20"
    >
      {/* Title using the 'dark' color */}
      <h2
        style={{ color: theme.colors.dark }}
        className="font-semibold text-base"
      >
        {title}
      </h2>

      <div className="flex items-center gap-2">
        {/* Bell Button */}
        <button
          className="relative w-8 h-8 flex items-center justify-center rounded-xl hover:opacity-80 transition-opacity"
          style={{ color: theme.colors.dark }}
        >
          <Bell size={17} />
          {/* Notification Dot using 'pink' */}
          <span
            style={{ backgroundColor: theme.colors.pink }}
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
          />
        </button>

        <div
          style={{ borderColor: theme.colors.muted }}
          className="flex items-center gap-2 pl-2 border-l"
        >
          {/* User Avatar using 'primary' background and 'light' text */}
          <div
            style={{ backgroundColor: theme.colors.primary, color: theme.colors.light }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          >
            {user?.email?.[0]?.toUpperCase() ?? "A"}
          </div>
        </div>
      </div>
    </header>
  );
}