"use client";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Textarea, Select, Toggle, Button, Card } from "@/components/ui";
import { Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  category: z.string().min(1, "Category required"),
  price: z.coerce.number().positive("Price must be positive"),
  originalPrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(0).optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  hoverImage: z.string().optional(),
  discount: z.string().optional(),
  collection: z.string().optional(),
  shape: z.string().optional(),
  length: z.string().optional(),
  style: z.string().optional(),
  features: z.string().optional(),
  sizes: z.string().optional(),
  isNew: z.boolean(),
  isBestSeller: z.boolean(),
  onSale: z.boolean(),
  isActive: z.boolean(),
  isKit: z.boolean(),
  isSimple: z.boolean(),
});

export type ProductFormValues = z.infer<typeof schema>;

interface ProductFormProps {
  initial?: Partial<Product>;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  submitting?: boolean;
}

const CATEGORY_OPTIONS = [
  { value: "Press-on Nails", label: "Press-on Nails" },
  { value: "Tools & Accessories", label: "Tools & Accessories" },
];

const SHAPE_OPTIONS = [
  { value: "", label: "None" },
  ...["Almond", "Square", "Coffin", "Oval", "Stiletto", "Squoval"].map((s) => ({ value: s, label: s })),
];

const LENGTH_OPTIONS = [
  { value: "", label: "None" },
  ...["XS", "Short", "Medium", "Long", "XL"].map((s) => ({ value: s, label: s })),
];

const STYLE_OPTIONS = [
  { value: "", label: "None" },
  ...["Glossy", "Matte", "Metallic", "Glitter", "Ombre", "French", "Abstract"].map((s) => ({ value: s, label: s })),
];

export function ProductForm({ initial, onSubmit, submitting }: ProductFormProps) {
  const router = useRouter();
  const { register, handleSubmit, control, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: initial?.name ?? "",
      category: initial?.category ?? "Press-on Nails",
      price: initial?.price ?? 0,
      originalPrice: initial?.originalPrice ?? undefined,
      stock: initial?.stock ?? 0,
      description: initial?.description ?? "",
      image: initial?.image ?? "",
      hoverImage: initial?.hoverImage ?? "",
      discount: initial?.discount ?? "",
      collection: initial?.collection ?? "",
      shape: initial?.shape ?? "",
      length: initial?.length ?? "",
      style: initial?.style ?? "",
      features: initial?.features?.join(", ") ?? "",
      sizes: initial?.sizes?.join(", ") ?? "",
      isNew: initial?.isNew ?? false,
      isBestSeller: initial?.isBestSeller ?? false,
      onSale: initial?.onSale ?? false,
      isActive: initial?.isActive ?? true,
      isKit: initial?.isKit ?? false,
      isSimple: initial?.isSimple ?? false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left — main details */}
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-slate-900">Basic Information</h3>
            <Input label="Product Name" required placeholder="e.g. Midnight Silk" {...register("name")} error={errors.name?.message} />
            <Textarea label="Description" rows={4} placeholder="Describe this product…" {...register("description")} />
            <Input label="Features" placeholder="Comma-separated, e.g. Long-lasting, Salon quality" {...register("features")} hint="Displayed as bullet points on product page" />
            <Input label="Available Sizes" placeholder="XS, S, M, L, XL" {...register("sizes")} hint="Comma-separated sizes" />
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-slate-900">Pricing & Inventory</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Sale Price" type="number" step="0.01" required inputPrefix="$" placeholder="0.00" {...register("price")} error={errors.price?.message} />
              <Input label="Original Price" type="number" step="0.01" inputPrefix="$" placeholder="0.00" {...register("originalPrice")} hint="Show strikethrough" />
              <Input label="Stock Quantity" type="number" placeholder="0" {...register("stock")} />
            </div>
            <Input label="Discount Label" placeholder="e.g. BEST SELLER, 20% OFF" {...register("discount")} hint="Shown as badge on product card" />
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-slate-900">Attributes</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Controller name="category" control={control} render={({ field }) => (
                <Select label="Category" required options={CATEGORY_OPTIONS} {...field} error={errors.category?.message} />
              )} />
              <Input label="Collection" placeholder="e.g. LNY Limited" {...register("collection")} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Controller name="shape" control={control} render={({ field }) => (
                <Select label="Shape" options={SHAPE_OPTIONS} {...field} />
              )} />
              <Controller name="length" control={control} render={({ field }) => (
                <Select label="Length" options={LENGTH_OPTIONS} {...field} />
              )} />
              <Controller name="style" control={control} render={({ field }) => (
                <Select label="Style" options={STYLE_OPTIONS} {...field} />
              )} />
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-slate-900">Images</h3>
            <Input label="Main Image URL" placeholder="https://… or /product1.png" {...register("image")} />
            <Input label="Hover Image URL" placeholder="https://… or /backimg1.png" {...register("hoverImage")} />
          </Card>
        </div>

        {/* Right — status & publish */}
        <div className="space-y-5">
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-slate-900">Visibility & Status</h3>
            <div className="space-y-3">
              {(
                [
                  { name: "isActive",      label: "Active / Visible" },
                  { name: "isNew",         label: "Mark as New" },
                  { name: "isBestSeller",  label: "Best Seller" },
                  { name: "onSale",        label: "On Sale" },
                  { name: "isKit",         label: "Is a Kit" },
                  { name: "isSimple",      label: "Simple Product" },
                ] as const
              ).map(({ name, label }) => (
                <Controller
                  key={name}
                  name={name}
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between py-1 border-b border-[--border] last:border-0">
                      <span className="text-sm text-slate-700">{label}</span>
                      <Toggle checked={!!field.value} onChange={field.onChange} size="sm" />
                    </div>
                  )}
                />
              ))}
            </div>
          </Card>

          <div className="flex gap-3">
            <Button type="button" variant="outline" leftIcon={<ArrowLeft size={14} />} onClick={() => router.back()} className="flex-1">
              Back
            </Button>
            <Button type="submit" loading={submitting} leftIcon={<Save size={14} />} className="flex-1">
              Save
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
