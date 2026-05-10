"use client";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Product } from "@/types";
import {
  Button, Card, PageHeader, Badge, Table, EmptyState,
  Pagination, ConfirmDialog,
} from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Plus, Search, Pencil, Trash2, Package2, RefreshCw,
  Star, MessageSquare, X, ShieldCheck, Loader2, ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAdminTab } from "@/context/AdminTabContext";

const CATEGORIES = ["All", "Press-on Nails", "Tools & Accessories"];

// ── Types ─────────────────────────────────────────────────────────────────────
interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  verified: boolean;
}

interface ReviewStats {
  reviews: Review[];
  totalCount: number;
  avgRating: number;
  distribution: { star: number; count: number }[];
}

// ── Star renderer (read-only) ─────────────────────────────────────────────────
function Stars({ value, size = 12 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= Math.round(value) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}
        />
      ))}
    </div>
  );
}

// ── Avatar initials fallback ──────────────────────────────────────────────────
function Avatar({ name, src }: { name: string; src?: string }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  if (src) {
    return <img src={src} alt={name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />;
  }
  return (
    <div className="w-8 h-8 rounded-full bg-[--accent] flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold">
      {initials}
    </div>
  );
}

// ── Reviews Drawer ────────────────────────────────────────────────────────────
function ReviewsDrawer({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { apiFetch } = useApi();
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/api/products/${product.id}/reviews`)
      .then((data: ReviewStats) => setStats(data))
      .catch(() => toast.error("Failed to load reviews"))
      .finally(() => setLoading(false));
  }, [product.id]);

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-10 h-10 rounded-xl object-cover border border-slate-100 flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Package2 size={16} className="text-slate-400" />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 truncate leading-tight">{product.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {stats && stats.totalCount > 0 ? (
                  <>
                    <Stars value={stats.avgRating} />
                    <span className="text-xs text-slate-500">
                      {stats.avgRating.toFixed(1)} · {stats.totalCount} review{stats.totalCount !== 1 ? "s" : ""}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-slate-400">No reviews yet</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0 ml-2"
          >
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        {/* Rating summary bar */}
        {stats && stats.totalCount > 0 && (
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
            <div className="flex gap-4 items-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-900 leading-none">{stats.avgRating.toFixed(1)}</p>
                <Stars value={Math.round(stats.avgRating)} size={11} />
                <p className="text-[10px] text-slate-400 mt-0.5">{stats.totalCount} total</p>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                {stats.distribution.map(({ star, count }) => {
                  const pct = stats.totalCount > 0 ? (count / stats.totalCount) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-[11px]">
                      <span className="w-3 text-right text-slate-500 font-medium">{star}</span>
                      <Star size={9} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                      <div className="flex-1 rounded-full h-1.5 bg-slate-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-400 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-4 text-slate-400">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Reviews list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 size={20} className="animate-spin text-[--accent]" />
            </div>
          ) : !stats || stats.totalCount === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2 text-center px-6">
              <MessageSquare size={28} className="text-slate-200" />
              <p className="font-medium text-slate-500 text-sm">No reviews yet</p>
              <p className="text-xs text-slate-400">Reviews submitted by customers will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {stats.reviews.map((review) => {
                const { date, time } = formatDateTime(review.createdAt);
                return (
                  <div key={review.id} className="px-5 py-4 hover:bg-slate-50 transition-colors">
                    {/* Row 1: avatar + name + badge + datetime */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar name={review.userName} src={review.userAvatar} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-sm text-slate-900 truncate">{review.userName}</span>
                            {review.verified && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                <ShieldCheck size={9} />
                                Verified
                              </span>
                            )}
                          </div>
                          <Stars value={review.rating} size={11} />
                        </div>
                      </div>

                      {/* Date + time stacked */}
                      <div className="flex flex-col items-end flex-shrink-0 text-right">
                        <span className="text-[11px] font-medium text-slate-500">{date}</span>
                        <span className="text-[10px] text-slate-400">{time}</span>
                      </div>
                    </div>

                    {/* Row 2: review content */}
                    <div className="mt-2.5 ml-[42px]">
                      <p className="text-sm font-semibold text-slate-800 leading-snug">{review.title}</p>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">{review.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Main Panel ────────────────────────────────────────────────────────────────
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
  const [reviewProduct, setReviewProduct] = useState<Product | null>(null);

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
          <Button
            variant="ghost" size="xs"
            leftIcon={<MessageSquare size={13} className="text-slate-400" />}
            onClick={(e) => { e.stopPropagation(); setReviewProduct(p); }}
          >
            Reviews
          </Button>
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
                className="w-full h-9 pl-9 pr-3 text-gray-600 text-sm border border-[--border] rounded-xl outline-none focus:border-[--accent] focus:ring-2 focus:ring-[--accent]/20 transition-all"
              />
            </div>
            <Button type="submit" variant="secondary" size="sm">Search</Button>
          </form>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => { const val = c === "All" ? "" : c; setCategory(val); setPage(1); load(1, search, val); }}
                className={`px-3 py-1.5 rounded-lg text-black text-xs font-medium transition-all ${(c === "All" ? category === "" : category === c)
                  ? "bg-[--accent] text-slate-600"
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

      {/* Reviews drawer */}
      {reviewProduct && (
        <ReviewsDrawer
          product={reviewProduct}
          onClose={() => setReviewProduct(null)}
        />
      )}
    </div>
  );
}