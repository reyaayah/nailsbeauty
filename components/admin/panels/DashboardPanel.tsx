"use client";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Analytics, Order } from "@/types";
import { StatCard, Card, StatusBadge, Table } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";
import { ShoppingBag, Users, Package, ArrowRight, PoundSterling } from "lucide-react";
import { useAdminTab } from "@/context/AdminTabContext";
import theme from "@/theme";

export default function DashboardPanel() {
  const { apiFetch } = useApi();
  const { setTab } = useAdminTab();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    apiFetch("/api/admin/analytics")
      .then(setAnalytics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = analytics
    ? [
      { label: "Total Revenue", value: formatCurrency(analytics.totalRevenue), change: analytics.revenueGrowth, icon: <PoundSterling size={18} />, iconBg: "#D1FAE5", iconColor: "#10B981" },
      { label: "Total Orders", value: analytics.totalOrders.toLocaleString(), change: analytics.ordersGrowth, icon: <ShoppingBag size={18} />, iconBg: "#F0F0F0", iconColor: "#0EA5E9" },
      { label: "Customers", value: analytics.totalCustomers.toLocaleString(), icon: <Users size={18} />, iconBg: "#E0E7FF", iconColor: "#4338CA" },
      { label: "Products Listed", value: analytics.totalProducts.toLocaleString(), icon: <Package size={18} />, iconBg: "#FEF3C7", iconColor: "#B45309" },
    ]
    : [];

  const STATUS_COLORS: Record<string, string> = {
    pending: "#f59e0b", confirmed: "#3b82f6", shipped: "#8b5cf6", delivered: "#10b981", cancelled: theme.colors.pink,
  };

  const recentOrderColumns = [
    {
      key: "id", label: "Order ID",
      render: (o: Order) => (
        <button
          onClick={() => setTab("orders/detail", o.id)}
          style={{ color: theme.colors.primary }}
          className="font-mono text-xs hover:underline"
        >
          {o.id.slice(0, 18)}…
        </button>
      ),
    },
    { key: "status", label: "Status", render: (o: Order) => <StatusBadge status={o.status} /> },
    { key: "total", label: "Total", render: (o: Order) => <span style={{ color: theme.colors.dark }} className="font-medium">{formatCurrency(o.total)}</span> },
    { key: "createdAt", label: "Date", render: (o: Order) => <span style={{ color: theme.colors.muted }} className="text-xs">{formatDate(o.createdAt)}</span> },
  ];

  return (
    <div className="max-w-[1200px] space-y-6">
      <div>
        <h1 style={{ color: theme.colors.dark }} className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p style={{ color: theme.colors.muted }} className="text-sm mt-1">Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-5 h-32 flex flex-col justify-center animate-pulse">
              <div className="h-4 w-24 bg-slate-100 rounded mb-3" />
              <div className="h-7 w-32 bg-slate-100 rounded" />
            </Card>
          ))
          : STAT_CARDS.map((s) => <StatCard key={s.label} {...s} />)
        }
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="mb-6">
            <p style={{ color: theme.colors.dark }} className="font-semibold">Revenue Overview</p>
            <p style={{ color: theme.colors.muted }} className="text-xs">Last 30 days</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={analytics?.revenueByDay ?? []}>
              <defs>
                <linearGradient id="rev-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.colors.primary} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={theme.colors.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.muted} vertical={false} opacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: theme.colors.muted }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: theme.colors.muted }} tickFormatter={(v) => `£${v}`} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: `1px solid ${theme.colors.muted}`, backgroundColor: theme.colors.light }}
                itemStyle={{ color: theme.colors.primary }}
              />
              <Area type="monotone" dataKey="revenue" stroke={theme.colors.primary} strokeWidth={2.5} fill="url(#rev-gradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <p style={{ color: theme.colors.dark }} className="font-semibold mb-1">Order Status</p>
          <p style={{ color: theme.colors.muted }} className="text-xs mb-6">All time breakdown</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={analytics?.ordersByStatus ?? []}>
              <XAxis dataKey="status" tick={{ fontSize: 9, fill: theme.colors.muted }} tickLine={false} axisLine={false} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {(analytics?.ordersByStatus ?? []).map((entry, i) => (
                  <Cell key={i} fill={STATUS_COLORS[entry.status] || theme.colors.muted} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: theme.colors.muted + "40" }}>
            <p style={{ color: theme.colors.dark }} className="font-semibold">Recent Orders</p>
            <button onClick={() => setTab("orders")} style={{ color: theme.colors.primary }} className="text-xs flex items-center gap-1 font-medium">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <Table
            columns={recentOrderColumns}
            data={(analytics?.recentOrders ?? []) as Order[]}
            loading={loading}
            skeletonRows={5}
            keyExtractor={(o) => o.id}
          />
        </Card>

        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: theme.colors.muted + "40" }}>
            <p style={{ color: theme.colors.dark }} className="font-semibold">Top Products</p>
            <button onClick={() => setTab("products")} style={{ color: theme.colors.primary }} className="text-xs flex items-center gap-1 font-medium">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="p-5 space-y-4">
            {(analytics?.topProducts ?? []).map((p, i) => (
              <div key={i} className="flex items-center gap-4">
                <span style={{ color: theme.colors.muted }} className="text-xs font-bold w-4">{i + 1}</span>
                <div className="flex-1">
                  <p style={{ color: theme.colors.dark }} className="text-sm font-medium truncate">{p.name}</p>
                  <p style={{ color: theme.colors.muted }} className="text-xs">{p.sold} sold</p>
                </div>
                <span style={{ color: theme.colors.dark }} className="text-sm font-semibold">{formatCurrency(p.revenue)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
