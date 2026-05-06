"use client";
import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { PageHeader } from "@/components/ui";
import { ProductForm, ProductFormValues } from "@/components/forms/ProductForm";
import toast from "react-hot-toast";
import { useAdminTab } from "@/context/AdminTabContext";

export default function ProductNewPanel() {
  const { setTab } = useAdminTab();
  const { apiFetch } = useApi();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: ProductFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        features: values.features ? values.features.split(",").map((f) => f.trim()).filter(Boolean) : [],
        sizes: values.sizes ? values.sizes.split(",").map((s) => s.trim()).filter(Boolean) : [],
        originalPrice: values.originalPrice || undefined,
      };
      await apiFetch("/api/admin/products", { method: "POST", body: JSON.stringify(payload) });
      toast.success("Product created!");
      setTab("products");
    } catch (err: any) {
      toast.error(err.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1100px] space-y-5">
      <PageHeader
        title="New Product"
        subtitle="Add a new product to your catalog"
        breadcrumb={["Admin", "Products", "New"]}
      />
      <ProductForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
