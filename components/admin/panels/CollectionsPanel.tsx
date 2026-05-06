"use client";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Collection } from "@/types";
import {
  Button, Card, PageHeader, Badge, Modal, Input, Textarea,
  Toggle, EmptyState, ConfirmDialog, Spinner,
} from "@/components/ui";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Layers, GripVertical } from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { ImageUpload } from "@/components/ImageUpload";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function CollectionsPanel() {
  const { apiFetch } = useApi();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { isActive: true, sortOrder: 999 },
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/admin/collections");
      setCollections(data.collections ?? []);
    } catch { toast.error("Failed to load collections"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ name: "", slug: "", description: "", image: "", isActive: true, sortOrder: 999 });
    setModalOpen(true);
  };

  const openEdit = (c: Collection) => {
    setEditing(c);
    reset({ name: c.name, slug: c.slug, description: c.description, image: c.image, isActive: c.isActive, sortOrder: c.sortOrder ?? 999 });
    setModalOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      if (editing) {
        await apiFetch("/api/admin/collections", { method: "PUT", body: JSON.stringify({ ...values, id: editing.id }) });
        toast.success("Collection updated");
      } else {
        await apiFetch("/api/admin/collections", { method: "POST", body: JSON.stringify(values) });
        toast.success("Collection created");
      }
      setModalOpen(false);
      load();
    } catch { toast.error("Failed to save collection"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch("/api/admin/collections", { method: "DELETE", body: JSON.stringify({ id: deleteTarget.id }) });
      toast.success("Collection deleted");
      setDeleteTarget(null);
      load();
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(false); }
  };

  return (
    <div className="max-w-[900px] space-y-5">
      <PageHeader
        title="Collections"
        subtitle="Organise products into curated groups"
        breadcrumb={["Admin", "Collections"]}
        actions={<Button leftIcon={<Plus size={14} />} onClick={openCreate}>New Collection</Button>}
      />

      {loading ? (
        <div className="flex items-center justify-center h-48"><Spinner size={24} /></div>
      ) : collections.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Layers size={40} />}
            title="No collections yet"
            description="Create your first collection to organise products."
            action={<Button leftIcon={<Plus size={14} />} onClick={openCreate}>New Collection</Button>}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {collections.map((c) => (
            <Card key={c.id} className="flex items-center gap-4 px-4 py-3.5">
              <GripVertical size={16} className="text-slate-300 cursor-grab flex-shrink-0" />
              {c.image ? (
                <img src={c.image} alt={c.name} className="w-12 h-12 rounded-xl object-cover border border-[--border] flex-shrink-0" onError={(e) => (e.currentTarget.style.display = "none")} />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[--accent-light] flex items-center justify-center flex-shrink-0">
                  <Layers size={18} className="text-[--accent]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900">{c.name}</p>
                  <Badge variant={c.isActive ? "success" : "default"}>{c.isActive ? "Active" : "Hidden"}</Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">/{c.slug} {c.createdAt && `· Created ${formatDate(c.createdAt)}`}</p>
                {c.description && <p className="text-sm text-slate-500 mt-1 truncate">{c.description}</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="ghost" size="xs" leftIcon={<Pencil size={13} />} onClick={() => openEdit(c)}>Edit</Button>
                <Button
                  variant="ghost" size="xs"
                  leftIcon={<Trash2 size={13} className="text-red-400" />}
                  className="text-red-400 hover:bg-red-50"
                  onClick={() => setDeleteTarget(c)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Collection" : "New Collection"}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <Input label="Name" required placeholder="e.g. LNY Limited" {...register("name")} error={errors.name?.message} />
          <Input label="Slug" placeholder="auto-generated if empty" {...register("slug")} hint="Used in URL: /collections/slug" />
          <Textarea label="Description" rows={3} placeholder="Short description of this collection…" {...register("description")} />
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ImageUpload
                label="Cover Image"
                value={field.value}
                onChange={field.onChange}
                hint="Upload from device or capture with camera"
              />
            )}
          />
          <Input label="Sort Order" type="number" placeholder="999" {...register("sortOrder")} hint="Lower number appears first" />
          <div className="flex items-center justify-between py-2 border-t border-[--border]">
            <div>
              <p className="text-sm font-medium text-slate-700">Active / Visible</p>
              <p className="text-xs text-slate-400">Show this collection in the store</p>
            </div>
            <Controller name="isActive" control={control} render={({ field }) => (
              <Toggle checked={field.value} onChange={field.onChange} />
            )} />
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={submitting} className="flex-1">
              {editing ? "Save Changes" : "Create Collection"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Collection"
        description={`Delete "${deleteTarget?.name}"? This won't delete products within it.`}
        confirmText="Delete"
      />
    </div>
  );
}
