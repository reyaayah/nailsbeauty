"use client";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Product } from "@/types";
import { PageHeader, Spinner } from "@/components/ui";
import { ProductForm, ProductFormValues } from "@/components/forms/ProductForm";
import toast from "react-hot-toast";
import { useAdminTab } from "@/context/AdminTabContext";

export default function ProductEditPanel({ id }: { id: string }) {
  const { setTab } = useAdminTab();
  const { apiFetch } = useApi();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch(`/api/admin/products/${id}`)
      .then(setProduct)
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (values: ProductFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        features: values.features ? values.features.split(",").map((f) => f.trim()).filter(Boolean) : [],
        sizes: values.sizes ? values.sizes.split(",").map((s) => s.trim()).filter(Boolean) : [],
        originalPrice: values.originalPrice || undefined,
      };
      await apiFetch(`/api/admin/products/${id}`, { method: "PUT", body: JSON.stringify(payload) });
      toast.success("Product updated!");
      setTab("products");
    } catch (err: any) {
      toast.error(err.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size={28} /></div>;
  if (!product) return <div className="text-center py-20 text-slate-500">Product not found.</div>;

  return (
    <div className="max-w-[1100px] space-y-5">
      <PageHeader
        title="Edit Product"
        subtitle={product.name}
        breadcrumb={["Admin", "Products", "Edit"]}
      />
      <ProductForm initial={product} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
