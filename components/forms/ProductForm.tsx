"use client";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Textarea, Select, Toggle, Button, Card } from "@/components/ui";
import { Save, ArrowLeft, Plus, Trash2, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { ImageUpload } from "@/components/ImageUpload";
import { useAdminTab } from "@/context/AdminTabContext";

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
  // product type — mutually exclusive
  isKit: z.boolean(),
  isSimple: z.boolean(),
  // kit options — max 5
  kitOptions: z
    .array(z.object({ value: z.string().min(1, "Option cannot be empty") }))
    .max(5, "Maximum 5 kit options")
    .optional(),
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
  { value: "Bundles", label: "Bundles" },
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

  const { goBack } = useAdminTab();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
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
      kitOptions: initial?.kitOptions?.map((v) => ({ value: v })) ?? [],
    },
  });

  const isKit = watch("isKit");
  const isSimple = watch("isSimple");

  const { fields, append, remove } = useFieldArray({ control, name: "kitOptions" });

  // Mutually exclusive handlers
  const handleIsKitChange = (checked: boolean) => {
    setValue("isKit", checked);
    if (checked) {
      setValue("isSimple", false);
      if (fields.length === 0) append({ value: "" });
    }
  };

  const handleIsSimpleChange = (checked: boolean) => {
    setValue("isSimple", checked);
    if (checked) setValue("isKit", false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left — main details */}
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-slate-900">Basic Information</h3>
            <Input
              label="Product Name"
              required
              placeholder="e.g. Midnight Silk"
              {...register("name")}
              error={errors.name?.message}
            />
            <Textarea
              label="Description"
              rows={4}
              placeholder="Describe this product…"
              {...register("description")}
            />
            <Input
              label="Features"
              placeholder="Comma-separated, e.g. Long-lasting, Salon quality"
              {...register("features")}
              hint="Displayed as bullet points on product page"
            />
            <Input
              label="Available Sizes"
              placeholder="XS, S, M, L, XL"
              {...register("sizes")}
              hint="Comma-separated sizes"
            />
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-slate-900">Pricing & Inventory</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                label="Sale Price"
                type="number"
                step="0.01"
                required
                inputPrefix="$"
                placeholder="0.00"
                {...register("price")}
                error={errors.price?.message}
              />
              <Input
                label="Original Price"
                type="number"
                step="0.01"
                inputPrefix="$"
                placeholder="0.00"
                {...register("originalPrice")}
                hint="Show strikethrough"
              />
              <Input label="Stock Quantity" type="number" placeholder="0" {...register("stock")} />
            </div>
            <Input
              label="Discount Label"
              placeholder="e.g. BEST SELLER, 20% OFF"
              {...register("discount")}
              hint="Shown as badge on product card"
            />
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-slate-900">Attributes</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select label="Category" required options={CATEGORY_OPTIONS} {...field} error={errors.category?.message} />
                )}
              />
              <Input label="Collection" placeholder="e.g. LNY Limited" {...register("collection")} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Controller name="shape" control={control} render={({ field }) => <Select label="Shape" options={SHAPE_OPTIONS} {...field} />} />
              <Controller name="length" control={control} render={({ field }) => <Select label="Length" options={LENGTH_OPTIONS} {...field} />} />
              <Controller name="style" control={control} render={({ field }) => <Select label="Style" options={STYLE_OPTIONS} {...field} />} />
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-slate-900">Images</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ImageUpload label="Main Image" hint="Primary product photo shown on cards" value={field.value} onChange={field.onChange} />
                )}
              />
              <Controller
                name="hoverImage"
                control={control}
                render={({ field }) => (
                  <ImageUpload label="Hover Image" hint="Shown when the customer hovers over the product card" value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
          </Card>

          {/* Kit Options — conditionally rendered */}
          {isKit && (
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-slate-500" />
                  <h3 className="font-semibold text-slate-900">Kit Options</h3>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    {fields.length} / 5
                  </span>
                </div>
                {fields.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    leftIcon={<Plus size={13} />}
                    onClick={() => append({ value: "" })}
                  >
                    Add Option
                  </Button>
                )}
              </div>

              {fields.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
                  <Package size={24} className="mb-2 opacity-40" />
                  <p className="text-sm">No kit options yet</p>
                  <button
                    type="button"
                    onClick={() => append({ value: "" })}
                    className="mt-2 text-xs font-medium text-[--accent] hover:underline"
                  >
                    + Add your first option
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <Input
                        placeholder={`Option ${index + 1}, e.g. Almond Medium Set`}
                        {...register(`kitOptions.${index}.value`)}
                        error={(errors.kitOptions as any)?.[index]?.value?.message}
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="Remove option"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {fields.length >= 5 && (
                <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                  Maximum of 5 kit options reached.
                </p>
              )}
            </Card>
          )}
        </div>

        {/* Right — status & publish */}
        <div className="space-y-5">
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-slate-900">Visibility & Status</h3>
            <div className="space-y-3">
              {(
                [
                  { name: "isActive", label: "Active / Visible" },
                  { name: "isNew", label: "Mark as New" },
                  { name: "isBestSeller", label: "Best Seller" },
                  { name: "onSale", label: "On Sale" },
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

          {/* Product Type — mutually exclusive selection */}
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-slate-900">Product Type</h3>
            <p className="text-xs text-slate-400 -mt-2">Only one type can be active at a time.</p>

            <div className="space-y-2">
              {/* Simple */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleIsSimpleChange(!isSimple)}
                onKeyDown={(e) => e.key === "Enter" && handleIsSimpleChange(!isSimple)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none ${isSimple
                  ? "border-[--accent] bg-[--accent-light]"
                  : "border-[--border] hover:border-slate-300 bg-white"
                  }`}
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">Simple Product</p>
                  <p className="text-xs text-slate-400 mt-0.5">Single item, no variants</p>
                </div>
                <Toggle checked={isSimple} onChange={handleIsSimpleChange} size="sm" />
              </div>

              {/* Kit */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleIsKitChange(!isKit)}
                onKeyDown={(e) => e.key === "Enter" && handleIsKitChange(!isKit)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none ${isKit
                  ? "border-[--accent] bg-[--accent-light]"
                  : "border-[--border] hover:border-slate-300 bg-white"
                  }`}
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">Kit / Bundle</p>
                  <p className="text-xs text-slate-400 mt-0.5">Multiple options, up to 5</p>
                </div>
                <Toggle checked={isKit} onChange={handleIsKitChange} size="sm" />
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              leftIcon={<ArrowLeft size={14} />}
              onClick={goBack}
              className="flex-1"
            >
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