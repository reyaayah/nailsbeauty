"use client";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Product } from "@/types";
import { PageHeader, Spinner } from "@/components/ui";
import { ProductForm, ProductFormValues } from "@/components/forms/ProductForm";
import VideoReviewsTab from "@/components/VideoReviewsTab";
import toast from "react-hot-toast";
import { useAdminTab } from "@/context/AdminTabContext";
import { Settings2, Film } from "lucide-react";
import theme from "@/theme";

type Tab = "details" | "video-reviews";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "details", label: "Product Details", icon: <Settings2 size={14} /> },
  { id: "video-reviews", label: "Video Reviews", icon: <Film size={14} /> },
];

export default function ProductEditPanel({ id }: { id: string }) {
  const { setTab } = useAdminTab();
  const { apiFetch } = useApi();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("details");

  useEffect(() => {
    apiFetch(`/api/admin/products/${id}`)
      .then(setProduct)
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);
  console.log(product?.kitOptions);

  const handleSubmit = async (values: ProductFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        features: values.features
          ? values.features.split(",").map((f) => f.trim()).filter(Boolean)
          : [],
        sizes: values.sizes
          ? values.sizes.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        originalPrice: values.originalPrice || undefined,
        kitOptions: values.kitOptions?.map((o) => o.value).filter(Boolean) ?? [], // ← add this
      };
      await apiFetch(`/api/admin/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      toast.success("Product updated!");
      setTab("products");
    } catch (err: any) {
      toast.error(err.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size={28} />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20 text-slate-500">Product not found.</div>;
  }

  return (
    <div className="max-w-[1100px] space-y-5">
      <PageHeader
        title="Edit Product"
        subtitle={product.name}
        breadcrumb={["Admin", "Products", "Edit"]}
      />

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
              }`}
          >
            {tab.icon}
            {tab.label}
            {tab.id === "video-reviews" && (product.videoReviews?.length ?? 0) > 0 && (
              <span className="ml-1 text-[10px] bg-slate-200 text-slate-600 rounded-full px-1.5 py-0.5 font-semibold">
                {product.videoReviews!.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "details" && (
        <ProductForm initial={product} onSubmit={handleSubmit} submitting={submitting} />
      )}

      {activeTab === "video-reviews" && (
        <div style={{ backgroundColor: theme.colors.light }} className=" rounded-3xl p-6 border border-white/8">
          <div className="mb-6">
            <h3 style={{ color: theme.colors.dark }} className=" font-semibold text-base">Video Reviews</h3>
            <p style={{ color: theme.colors.dark }} className="text-black/40 text-sm mt-0.5">
              Manage "Seen on You" videos for <span className="text-black/60">{product.name}</span>
            </p>
          </div>
          <VideoReviewsTab
            productId={id}
            initialReviews={product.videoReviews ?? []}
          />
        </div>
      )}
    </div>
  );
}