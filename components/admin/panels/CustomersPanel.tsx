"use client";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Customer } from "@/types";
import {
  Button, Card, PageHeader, Badge, Table, EmptyState, Pagination,
} from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search, Users, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminTab } from "@/context/AdminTabContext";

export default function CustomersPanel() {
  const { setTab } = useAdminTab();
  const { apiFetch } = useApi();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(
    async (p = page, q = search) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(p), limit: "15" });
        if (q) params.set("search", q);
        const data = await apiFetch(`/api/admin/customers?${params}`);
        setCustomers(data.customers ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
      } catch {
        toast.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    },
    [apiFetch]
  );

  useEffect(() => { load(); }, []);

  const columns = [
    {
      key: "displayName", label: "Customer",
      render: (c: Customer) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[--accent-light] flex items-center justify-center text-[--accent] font-bold text-sm flex-shrink-0">
            {(c.displayName || c.email || "?")[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-slate-900">{c.displayName || "—"}</p>
            <p className="text-xs text-slate-400">{c.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "provider", label: "Auth",
      render: (c: Customer) => (
        <Badge variant={c.provider === "google" ? "info" : "default"}>
          {c.provider === "google" ? "Google" : "Email"}
        </Badge>
      ),
    },
    { key: "orderCount", label: "Orders",        render: (c: Customer) => <span className="font-medium">{c.orderCount ?? 0}</span> },
    { key: "totalSpent", label: "Lifetime Value", render: (c: Customer) => <span className="font-medium text-emerald-600">{formatCurrency(c.totalSpent ?? 0)}</span> },
    { key: "createdAt",  label: "Joined",         render: (c: Customer) => <span className="text-xs text-slate-400">{formatDate(c.createdAt)}</span> },
    {
      key: "status", label: "Status",
      render: (c: Customer) => c.isBlocked
        ? <Badge variant="error">Blocked</Badge>
        : <Badge variant="success">Active</Badge>,
    },
  ];

  return (
    <div className="max-w-[1100px] space-y-5">
      <PageHeader
        title="Customers"
        subtitle={`${total} registered customers`}
        breadcrumb={["Admin", "Customers"]}
        actions={
          <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={13} />} onClick={() => load()}>
            Refresh
          </Button>
        }
      />

      <Card>
        <div className="flex items-center gap-3 p-4 border-b border-[--border]">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setPage(1); load(1, search); } }}
              placeholder="Search by name or email…"
              className="w-full h-9 pl-9 pr-3 text-sm border border-[--border] rounded-xl outline-none focus:border-[--accent] focus:ring-2 focus:ring-[--accent]/20"
            />
          </div>
          <Button variant="secondary" size="sm" onClick={() => { setPage(1); load(1, search); }}>Search</Button>
        </div>

        <Table
          columns={columns}
          data={customers}
          loading={loading}
          skeletonRows={8}
          onRowClick={(c) => setTab("customers/detail", c.uid)}
          keyExtractor={(c) => c.uid}
          emptyState={<EmptyState icon={<Users size={40} />} title="No customers found" />}
        />
        <Pagination page={page} totalPages={totalPages} total={total} limit={15} onPage={(p) => { setPage(p); load(p, search); }} />
      </Card>
    </div>
  );
}
