"use client";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { BlogPost } from "@/types";
import {
  Button, Card, PageHeader, Badge, Modal, Input, Textarea,
  Toggle, EmptyState, ConfirmDialog, Spinner,
} from "@/components/ui";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, BookOpen, Clock, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { ImageUpload } from "@/components/ImageUpload";

const schema = z.object({
  title: z.string().min(5, "Title required"),
  slug: z.string().optional(),
  excerpt: z.string().min(10, "Excerpt required"),
  content: z.string().min(20, "Content required"),
  coverImage: z.string().optional(),
  author: z.string().min(2, "Author required"),
  tags: z.string().optional(),
  isPublished: z.boolean(),
});
type FormValues = z.infer<typeof schema>;

export default function BlogPanel() {
  const { apiFetch } = useApi();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { isPublished: false },
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/admin/blog");
      setPosts(data.posts ?? []);
    } catch { toast.error("Failed to load posts"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ title: "", slug: "", excerpt: "", content: "", coverImage: "", author: "", tags: "", isPublished: false });
    setModalOpen(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditing(p);
    reset({ title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, coverImage: p.coverImage, author: p.author, tags: p.tags?.join(", "), isPublished: p.isPublished });
    setModalOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        tags: values.tags ? values.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        ...(editing ? { id: editing.id } : {}),
      };
      if (editing) {
        await apiFetch("/api/admin/blog", { method: "PUT", body: JSON.stringify(payload) });
        toast.success("Post updated");
      } else {
        await apiFetch("/api/admin/blog", { method: "POST", body: JSON.stringify(payload) });
        toast.success("Post created");
      }
      setModalOpen(false);
      load();
    } catch { toast.error("Failed to save post"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch("/api/admin/blog", { method: "DELETE", body: JSON.stringify({ id: deleteTarget.id }) });
      toast.success("Post deleted");
      setDeleteTarget(null);
      load();
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(false); }
  };

  return (
    <div className="max-w-[900px] space-y-5">
      <PageHeader
        title="Blog"
        subtitle={`${posts.length} posts total`}
        breadcrumb={["Admin", "Blog"]}
        actions={<Button leftIcon={<Plus size={14} />} onClick={openCreate}>New Post</Button>}
      />

      {loading ? (
        <div className="flex items-center justify-center h-48"><Spinner size={24} /></div>
      ) : posts.length === 0 ? (
        <Card>
          <EmptyState
            icon={<BookOpen size={40} />}
            title="No blog posts yet"
            description="Create your first post to engage your audience."
            action={<Button leftIcon={<Plus size={14} />} onClick={openCreate}>New Post</Button>}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id} className="flex gap-4 p-4">
              {post.coverImage && (
                <img src={post.coverImage} alt={post.title} className="w-20 h-16 rounded-xl object-cover border border-[--border] flex-shrink-0" onError={(e) => (e.currentTarget.style.display = "none")} />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-900 truncate">{post.title}</p>
                      <Badge variant={post.isPublished ? "success" : "default"}>
                        {post.isPublished ? <><Eye size={10} /> Published</> : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span>By {post.author}</span>
                      <span>·</span>
                      <span>{formatDate(post.createdAt)}</span>
                      {post.readTime && <><span>·</span><span className="flex items-center gap-1"><Clock size={10} /> {post.readTime} min read</span></>}
                      {post.tags?.length > 0 && <><span>·</span><span>{post.tags.slice(0, 3).join(", ")}</span></>}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button variant="ghost" size="xs" leftIcon={<Pencil size={13} />} onClick={() => openEdit(post)}>Edit</Button>
                    <Button
                      variant="ghost" size="xs"
                      leftIcon={<Trash2 size={13} className="text-red-400" />}
                      className="text-red-400 hover:bg-red-50"
                      onClick={() => setDeleteTarget(post)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Post" : "New Blog Post"} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <Input label="Title" required placeholder="Your blog post title…" {...register("title")} error={errors.title?.message} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Slug" placeholder="auto-generated from title" {...register("slug")} />
            <Input label="Author" required placeholder="Your name" {...register("author")} error={errors.author?.message} />
          </div>
          <Textarea label="Excerpt" required rows={2} placeholder="A short summary…" {...register("excerpt")} error={errors.excerpt?.message} />
          <Textarea label="Content" required rows={8} placeholder="Write your post content here…" {...register("content")} error={errors.content?.message} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Controller
              name="coverImage"
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
            <Input label="Tags" placeholder="nails, tips, beauty" {...register("tags")} hint="Comma-separated" />
          </div>
          <div className="flex items-center justify-between py-2 border-t border-[--border]">
            <div>
              <p className="text-sm font-medium text-slate-700">Publish Now</p>
              <p className="text-xs text-slate-400">Make visible on the blog</p>
            </div>
            <Controller name="isPublished" control={control} render={({ field }) => (
              <Toggle checked={field.value} onChange={field.onChange} />
            )} />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={submitting} className="flex-1">
              {editing ? "Save Changes" : "Create Post"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Post"
        description={`Permanently delete "${deleteTarget?.title}"?`}
        confirmText="Delete Post"
      />
    </div>
  );
}
