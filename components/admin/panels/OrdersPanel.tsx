"use client";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Order, OrderStatus } from "@/types";
import {
  Button, Card, PageHeader, StatusBadge, Table, EmptyState, Pagination,
} from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search, ShoppingBag, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminTab } from "@/context/AdminTabContext";

const STATUS_TABS: { label: string; value: string; color: string }[] = [
  { label: "All",       value: "",          color: "text-slate-600" },
  { label: "Pending",   value: "pending",   color: "text-amber-600" },
  { label: "Confirmed", value: "confirmed", color: "text-blue-600"  },
  { label: "Shipped",   value: "shipped",   color: "text-purple-600"},
  { label: "Delivered", value: "delivered", color: "text-emerald-600"},
  { label: "Cancelled", value: "cancelled", color: "text-red-600"   },
];

export default function OrdersPanel() {
  const { setTab } = useAdminTab();
  const { apiFetch } = useApi();

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(
    async (p = page, s = status, q = search) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(p), limit: "15" });
        if (s) params.set("status", s);
        if (q) params.set("search", q);
        const data = await apiFetch(`/api/admin/orders?${params}`);
        setOrders(data.orders ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
      } catch {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    },
    [apiFetch]
  );

  useEffect(() => { load(); }, []);

  const columns = [
    {
      key: "id", label: "Order ID",
      render: (o: Order) => <span className="font-mono text-xs text-[--accent] font-medium">{o.id.slice(0, 20)}…</span>,
    },
    {
      key: "shippingAddress", label: "Customer",
      render: (o: Order) => (
        <div>
          <p className="font-medium text-slate-800">{(o as any).userName || o.shippingAddress?.fullName || "—"}</p>
          <p className="text-xs text-slate-400">{(o as any).userEmail || "—"}</p>
        </div>
      ),
    },
    { key: "items",  label: "Items",   render: (o: Order) => <span>{o.items?.length ?? 0} item{(o.items?.length ?? 0) !== 1 ? "s" : ""}</span> },
    { key: "total",  label: "Total",   render: (o: Order) => <span className="font-semibold text-slate-900">{formatCurrency(o.total)}</span> },
    { key: "status", label: "Status",  render: (o: Order) => <StatusBadge status={o.status} /> },
    { key: "paymentMethod", label: "Payment", render: (o: Order) => <span className="text-xs capitalize text-slate-500">{o.paymentMethod || "—"}</span> },
    { key: "createdAt", label: "Date", render: (o: Order) => <span className="text-xs text-slate-400">{formatDate(o.createdAt)}</span> },
  ];

  return (
    <div className="max-w-[1200px] space-y-5">
      <PageHeader
        title="Orders"
        subtitle={`${total} total orders`}
        breadcrumb={["Admin", "Orders"]}
        actions={
          <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={13} />} onClick={() => load(page, status, search)}>
            Refresh
          </Button>
        }
      />

      <Card>
        <div className="flex items-center gap-1 px-4 pt-4 flex-wrap border-b border-[--border] pb-0">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setStatus(tab.value); setPage(1); load(1, tab.value, search); }}
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                status === tab.value
                  ? `${tab.color} border-current`
                  : "text-slate-400 border-transparent hover:text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 p-4 border-b border-[--border]">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setPage(1); load(1, status, search); } }}
              placeholder="Search by order ID, customer name or email…"
              className="w-full h-9 pl-9 pr-3 text-sm border border-[--border] rounded-xl outline-none focus:border-[--accent] focus:ring-2 focus:ring-[--accent]/20"
            />
          </div>
          <Button variant="secondary" size="sm" onClick={() => { setPage(1); load(1, status, search); }}>Search</Button>
        </div>

        <Table
          columns={columns}
          data={orders}
          loading={loading}
          skeletonRows={8}
          onRowClick={(o) => setTab("orders/detail", o.id)}
          keyExtractor={(o) => o.id}
          emptyState={<EmptyState icon={<ShoppingBag size={40} />} title="No orders found" description="Orders will appear here once customers start purchasing." />}
        />

        <Pagination page={page} totalPages={totalPages} total={total} limit={15} onPage={(p) => { setPage(p); load(p, status, search); }} />
      </Card>
    </div>
  );
}
