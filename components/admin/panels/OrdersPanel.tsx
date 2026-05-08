"use client";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Order, OrderStatus } from "@/types";
import {
  Button, Card, PageHeader, StatusBadge, Table, EmptyState, Pagination,
} from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search, ShoppingBag, RefreshCw, Tag, Gift } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminTab } from "@/context/AdminTabContext";

const STATUS_TABS: { label: string; value: string; color: string }[] = [
  { label: "All", value: "", color: "text-slate-600" },
  { label: "Pending", value: "pending", color: "text-amber-600" },
  { label: "Confirmed", value: "confirmed", color: "text-blue-600" },
  { label: "Shipped", value: "shipped", color: "text-purple-600" },
  { label: "Delivered", value: "delivered", color: "text-emerald-600" },
  { label: "Cancelled", value: "cancelled", color: "text-red-600" },
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
  // Dedicated gift filter — sent as isGift=true param, NOT mixed into search text
  const [giftsOnly, setGiftsOnly] = useState(false);

  const load = useCallback(
    async (p: number, s: string, q: string, gifts: boolean) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(p), limit: "10" });
        if (s) params.set("status", s);
        if (q) params.set("search", q);
        // Pass isGift as an explicit boolean param so the API can filter on the field,
        // not as a text search string
        if (gifts) params.set("isGift", "true");
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

  useEffect(() => { load(1, "", "", false); }, []);

  const handleGiftsToggle = () => {
    const next = !giftsOnly;
    setGiftsOnly(next);
    setPage(1);
    load(1, status, search, next);
  };

  const handleStatusChange = (s: string) => {
    setStatus(s);
    setPage(1);
    load(1, s, search, giftsOnly);
  };

  const handleSearch = () => {
    setPage(1);
    load(1, status, search, giftsOnly);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    load(p, status, search, giftsOnly);
  };

  const columns = [
    {
      key: "id",
      label: "Order ID",
      render: (o: Order) => (
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs text-[--accent] font-medium">
            {o.id.slice(0, 20)}…
          </span>
          {(o as any).isGift && (
            <span
              title="Gift order"
              className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-pink-50 text-pink-500 border border-pink-200 px-1.5 py-0.5 rounded-full"
            >
              <Gift size={9} />
              Gift
            </span>
          )}
        </div>
      ),
    },
    {
      key: "shippingAddress",
      label: "Customer",
      render: (o: Order) => (
        <div>
          <p className="font-medium text-slate-800">
            {(o as any).userName || o.shippingAddress?.fullName || "—"}
          </p>
          <p className="text-xs text-slate-400">{(o as any).userEmail || "—"}</p>
        </div>
      ),
    },
    {
      key: "items",
      label: "Items",
      render: (o: Order) => (
        <span>{o.items?.length ?? 0} item{(o.items?.length ?? 0) !== 1 ? "s" : ""}</span>
      ),
    },
    {
      key: "total",
      label: "Total",
      render: (o: Order) => (
        <div>
          <span className="font-semibold text-slate-900">{formatCurrency(o.total)}</span>
          {(o as any).discountCode && (
            <div className="flex items-center gap-1 mt-0.5">
              <Tag size={10} className="text-emerald-500" />
              <span className="text-[10px] font-mono text-emerald-600 font-semibold">
                {(o as any).discountCode}
              </span>
              {(o as any).discountLabel && (
                <span className="text-[10px] text-slate-400">· {(o as any).discountLabel}</span>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (o: Order) => <StatusBadge status={o.status} />,
    },
    {
      key: "paymentMethod",
      label: "Payment",
      render: (o: Order) => (
        <span className="text-xs capitalize text-slate-500">{o.paymentMethod || "—"}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (o: Order) => (
        <span className="text-xs text-slate-400">{formatDate(o.createdAt)}</span>
      ),
    },
  ];

  return (
    <div className="max-w-[1200px] space-y-5">
      <PageHeader
        title="Orders"
        subtitle={`${total} total order${total !== 1 ? "s" : ""}${giftsOnly ? " · Gift orders" : ""}`}
        breadcrumb={["Admin", "Orders"]}
        actions={
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RefreshCw size={13} />}
            onClick={() => load(page, status, search, giftsOnly)}
          >
            Refresh
          </Button>
        }
      />

      <Card>
        {/* Status tab bar */}
        <div className="flex items-center gap-1 px-4 pt-4 flex-wrap border-b border-[--border] pb-0">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleStatusChange(tab.value)}
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${status === tab.value
                ? `${tab.color} border-current`
                : "text-slate-400 border-transparent hover:text-slate-600"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search + Gift filter bar */}
        <div className="flex items-center gap-3 p-4 border-b border-[--border]">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              placeholder="Search by order ID, customer name, email, or discount code…"
              className="w-full h-9 pl-9 pr-3 text-sm border border-[--border] rounded-xl outline-none focus:border-[--accent] focus:ring-2 focus:ring-[--accent]/20"
            />
          </div>
          <Button variant="secondary" size="sm" onClick={handleSearch}>
            Search
          </Button>

          {/* Gift toggle — active state shown with pink highlight */}
          <button
            onClick={handleGiftsToggle}
            className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-sm font-medium border transition-all ${giftsOnly
              ? "bg-pink-50 border-pink-300 text-pink-600"
              : "bg-white border-[--border] text-slate-500 hover:text-pink-500 hover:border-pink-200"
              }`}
          >
            <Gift size={13} />
            Gifts only
            {giftsOnly && (
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 inline-block" />
            )}
          </button>
        </div>

        <Table
          columns={columns}
          data={orders}
          loading={loading}
          skeletonRows={8}
          onRowClick={(o) => setTab("orders/detail", o.id)}
          keyExtractor={(o) => o.id}
          emptyState={
            <EmptyState
              icon={giftsOnly ? <Gift size={40} /> : <ShoppingBag size={40} />}
              title={giftsOnly ? "No gift orders found" : "No orders found"}
              description={
                giftsOnly
                  ? "No orders marked as gifts yet."
                  : "Orders will appear here once customers start purchasing."
              }
            />
          }
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={10}
          onPage={handlePageChange}
        />
      </Card>
    </div>
  );
}