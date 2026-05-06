"use client";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Product } from "@/types";
import {
  Button, Card, PageHeader, Badge, Table, EmptyState,
  Pagination, ConfirmDialog,
} from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Search, Pencil, Trash2, Package2, RefreshCw, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminTab } from "@/context/AdminTabContext";

const CATEGORIES = ["All", "Press-on Nails", "Tools & Accessories"];

export default function ProductsPanel() {
  const { setTab } = useAdminTab();
  const { apiFetch } = useApi();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(
    async (p = page, s = search, cat = category) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(p), limit: "12" });
        if (s) params.set("search", s);
        if (cat) params.set("category", cat);
        const data = await apiFetch(`/api/admin/products?${params}`);
        setProducts(data.products ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    },
    [apiFetch]
  );

  useEffect(() => { load(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load(1, search, category);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/admin/products/${deleteTarget.id}`, { method: "DELETE" });
      toast.success("Product deleted");
      setDeleteTarget(null);
      load(page, search, category);
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "name", label: "Product",
      render: (p: Product) => (
        <div className="flex items-center gap-3">
          {p.image ? (
            <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-[--border] flex-shrink-0" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[--accent-light] flex items-center justify-center flex-shrink-0">
              <Package2 size={16} className="text-[--accent]" />
            </div>
          )}
          <div>
            <p className="font-medium text-slate-900 leading-none">{p.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{p.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: "price", label: "Price",
      render: (p: Product) => (
        <div>
          <p className="font-medium text-slate-900">{formatCurrency(p.price)}</p>
          {p.originalPrice && <p className="text-xs text-slate-400 line-through">{formatCurrency(p.originalPrice)}</p>}
        </div>
      ),
    },
    {
      key: "stock", label: "Stock",
      render: (p: Product) => {
        const s = p.stock ?? 0;
        return <span className={s === 0 ? "text-red-500 font-medium" : s < 5 ? "text-amber-600 font-medium" : "text-slate-700"}>{s}</span>;
      },
    },
    {
      key: "rating", label: "Rating",
      render: (p: Product) => (
        <div className="flex items-center gap-1 text-sm">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-slate-700">{p.rating ?? "—"}</span>
          {p.reviews ? <span className="text-slate-400 text-xs">({p.reviews})</span> : null}
        </div>
      ),
    },
    {
      key: "flags", label: "Tags",
      render: (p: Product) => (
        <div className="flex flex-wrap gap-1">
          {p.isNew && <Badge variant="info">New</Badge>}
          {p.isBestSeller && <Badge variant="warning">Best Seller</Badge>}
          {p.onSale && <Badge variant="error">Sale</Badge>}
          {p.isActive === false && <Badge>Inactive</Badge>}
        </div>
      ),
    },
    {
      key: "createdAt", label: "Added",
      render: (p: Product) => <span className="text-xs text-slate-400">{formatDate(p.createdAt)}</span>,
    },
    {
      key: "actions", label: "", headerClassName: "text-right", className: "text-right",
      render: (p: Product) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="xs" leftIcon={<Pencil size={13} />} onClick={(e) => { e.stopPropagation(); setTab("products/edit", p.id); }}>
            Edit
          </Button>
          <Button
            variant="ghost" size="xs"
            leftIcon={<Trash2 size={13} className="text-red-400" />}
            className="text-red-400 hover:bg-red-50"
            onClick={(e) => { e.stopPropagation(); setDeleteTarget(p); }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[1200px] space-y-5">
      <PageHeader
        title="Products"
        subtitle={`${total} products in catalog`}
        breadcrumb={["Admin", "Products"]}
        actions={
          <Button leftIcon={<Plus size={15} />} onClick={() => setTab("products/new")}>
            Add Product
          </Button>
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-[--border]">
          <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-[200px]">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full h-9 pl-9 pr-3 text-sm border border-[--border] rounded-xl outline-none focus:border-[--accent] focus:ring-2 focus:ring-[--accent]/20 transition-all"
              />
            </div>
            <Button type="submit" variant="secondary" size="sm">Search</Button>
          </form>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => { const val = c === "All" ? "" : c; setCategory(val); setPage(1); load(1, search, val); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  (c === "All" ? category === "" : category === c)
                    ? "bg-[--accent] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={13} />} className="ml-auto" onClick={() => load(page, search, category)}>
            Refresh
          </Button>
        </div>

        <Table
          columns={columns}
          data={products}
          loading={loading}
          skeletonRows={8}
          onRowClick={(p) => setTab("products/edit", p.id)}
          keyExtractor={(p) => p.id}
          emptyState={
            <EmptyState
              icon={<Package2 size={40} />}
              title="No products found"
              description="Try adjusting your search or add a new product."
              action={<Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setTab("products/new")}>Add Product</Button>}
            />
          }
        />

        <Pagination page={page} totalPages={totalPages} total={total} limit={12} onPage={(p) => { setPage(p); load(p, search, category); }} />
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Product"
        description={`Delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete Product"
      />
    </div>
  );
}
