"use client";

import theme from "@/theme";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface BlogPost {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    excerpt: string;
    content: string;
    author: string;
    authorRole: string;
    date: string;
    readTime: number;
    category: string;
    tags: string[];
    coverImage: string;
    featured: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function initials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("");
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useBlogList(category: string | null) {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [featured, setFeatured] = useState<BlogPost[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const url = category
            ? `/api/blog?category=${encodeURIComponent(category)}`
            : `/api/blog`;
        fetch(url)
            .then((r) => r.json())
            .then((d) => {
                setPosts(d.posts ?? []);
                setFeatured(d.featured ?? []);
                setCategories(d.categories ?? []);
            })
            .finally(() => setLoading(false));
    }, [category]);

    return { posts, featured, categories, loading };
}

function useBlogPost(slug: string | null) {
    const [post, setPost] = useState<BlogPost | null>(null);
    const [related, setRelated] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) { setPost(null); return; }
        setLoading(true);
        setError(null);
        fetch(`/api/blog?slug=${encodeURIComponent(slug)}`)
            .then((r) => {
                if (!r.ok) throw new Error("Post not found");
                return r.json();
            })
            .then((d) => { setPost(d.post); setRelated(d.related ?? []); })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [slug]);

    return { post, related, loading, error };
}

// ─── Category pill ────────────────────────────────────────────────────────────
function CategoryPill({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] font-semibold border transition-all duration-200 whitespace-nowrap"
            style={{
                backgroundColor: active ? theme.colors.pink : "transparent",
                color: active ? theme.colors.light : theme.colors.muted,
                borderColor: active ? theme.colors.pink : `${theme.colors.muted}50`,
            }}
        >
            {label}
        </button>
    );
}

// ─── Featured card (large hero card) ─────────────────────────────────────────
function FeaturedCard({ post, onClick }: { post: BlogPost; onClick: () => void }) {
    const [hovered, setHovered] = useState(false);

    return (
        <article
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative cursor-pointer rounded-3xl overflow-hidden group"
            style={{ minHeight: 480 }}
        >
            {/* Image */}
            <div className="absolute inset-0">
                <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700"
                    style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-end h-full p-8 lg:p-10" style={{ minHeight: 480 }}>
                <span
                    className="text-[9px] uppercase tracking-[0.3em] font-bold mb-3 inline-block px-3 py-1 rounded-full w-fit"
                    style={{ backgroundColor: theme.colors.pink, color: "#fff" }}
                >
                    {post.category}
                </span>
                <h2
                    className="font-serif text-3xl lg:text-4xl text-white leading-tight mb-3 transition-all duration-300"
                    style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
                >
                    {post.title}
                </h2>
                <p className="text-[13px] text-white/70 leading-relaxed mb-5 max-w-lg line-clamp-2">
                    {post.excerpt}
                </p>
                <div className="flex items-center gap-4">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: "rgba(255,255,255,0.2)", color: theme.colors.pink }}
                    >
                        {initials(post.author)}
                    </div>
                    <div>
                        <p className="text-[12px] font-semibold text-white">{post.author}</p>
                        <p className="text-[10px] text-white/60">
                            {formatDate(post.date)} · {post.readTime} min read
                        </p>
                    </div>
                    <div
                        className="ml-auto flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/80 transition-all duration-200"
                        style={{ transform: hovered ? "translateX(4px)" : "translateX(0)" }}
                    >
                        Read
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                    </div>
                </div>
            </div>
        </article>
    );
}

// ─── List card ────────────────────────────────────────────────────────────────
function BlogCard({ post, onClick }: { post: BlogPost; onClick: () => void }) {
    const [hovered, setHovered] = useState(false);

    return (
        <article
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="cursor-pointer group flex flex-col"
            style={{ borderTop: `1px solid ${theme.colors.muted}25` }}
        >
            {/* Image */}
            <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-5 mt-6">
                <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500"
                    style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
                />
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 mb-3">
                <span
                    className="text-[9px] uppercase tracking-[0.25em] font-semibold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${theme.colors.pink}10`, color: theme.colors.pink }}
                >
                    {post.category}
                </span>
                <span className="text-[11px]" style={{ color: theme.colors.muted }}>
                    {post.readTime} min
                </span>
            </div>

            {/* Title */}
            <h3
                className="font-serif text-xl leading-snug mb-2 transition-all duration-200"
                style={{
                    color: theme.colors.dark,
                    textDecoration: hovered ? "underline" : "none",
                    textUnderlineOffset: "4px",
                }}
            >
                {post.title}
            </h3>

            <p
                className="text-[13px] leading-relaxed line-clamp-2 mb-4 flex-1"
                style={{ color: theme.colors.muted }}
            >
                {post.excerpt}
            </p>

            {/* Author */}
            <div className="flex items-center gap-2.5 mt-auto">
                <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ backgroundColor: `${theme.colors.dark}12`, color: theme.colors.dark }}
                >
                    {initials(post.author)}
                </div>
                <div>
                    <p className="text-[11px] font-semibold" style={{ color: theme.colors.dark }}>
                        {post.author}
                    </p>
                    <p className="text-[10px]" style={{ color: theme.colors.muted }}>
                        {formatDate(post.date)}
                    </p>
                </div>
            </div>
        </article>
    );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function ListSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="rounded-3xl bg-gray-200 mb-12" style={{ height: 480 }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex flex-col gap-3 pt-6" style={{ borderTop: "1px solid #e5e5e5" }}>
                        <div className="rounded-2xl bg-gray-200 aspect-[4/3]" />
                        <div className="h-2.5 bg-gray-200 rounded w-1/4" />
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-full" />
                        <div className="h-3 bg-gray-200 rounded w-5/6" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Blog list view ────────────────────────────────────────────────────────────
function BlogList({ onSelectPost }: { onSelectPost: (slug: string) => void }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const categoryParam = searchParams.get("category");
    const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam);
    const { posts, featured, categories, loading } = useBlogList(activeCategory);

    const handleCategory = (cat: string | null) => {
        setActiveCategory(cat);
        const params = new URLSearchParams(searchParams.toString());
        if (cat) params.set("category", cat);
        else params.delete("category");
        router.replace(`/blog?${params.toString()}`, { scroll: false });
    };

    const featuredPost = featured[0];
    const gridPosts = activeCategory
        ? posts
        : posts.filter((p) => !p.featured || p !== featuredPost);

    return (
        <main className="min-h-screen font-sans" style={{ backgroundColor: theme.colors.light }}>
            {/* Header */}
            <div className="max-w-[1400px] mx-auto px-6 pt-24 pb-10">


                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
                    <div>
                        <h1
                            className="text-5xl md:text-6xl font-serif tracking-tight leading-none mb-3"
                            style={{ color: theme.colors.dark }}
                        >
                            The Journal
                        </h1>
                        <p className="text-[14px]" style={{ color: theme.colors.muted }}>
                            Stories, education, and the thinking behind what we make.
                        </p>
                    </div>

                    {/* Category filter */}
                    <div className="flex flex-wrap gap-2">
                        <CategoryPill
                            label="All"
                            active={activeCategory === null}
                            onClick={() => handleCategory(null)}
                        />
                        {categories.map((cat) => (
                            <CategoryPill
                                key={cat}
                                label={cat}
                                active={activeCategory === cat}
                                onClick={() => handleCategory(cat)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 pb-24">
                {loading ? (
                    <ListSkeleton />
                ) : (
                    <>
                        {/* Featured hero — only on All view */}
                        {!activeCategory && featuredPost && (
                            <div className="mb-14">
                                <FeaturedCard
                                    post={featuredPost}
                                    onClick={() => onSelectPost(featuredPost.slug)}
                                />
                            </div>
                        )}

                        {/* Two-column featured row (second featured if exists) */}
                        {!activeCategory && featured.length > 1 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {featured.slice(1).map((p) => (
                                    <FeaturedCard
                                        key={p.slug}
                                        post={p}
                                        onClick={() => onSelectPost(p.slug)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Divider label */}
                        {!activeCategory && gridPosts.length > 0 && (
                            <div className="flex items-center gap-4 mb-2">
                                <span
                                    className="text-[10px] uppercase tracking-[0.3em] font-semibold"
                                    style={{ color: theme.colors.muted }}
                                >
                                    All Posts
                                </span>
                                <div className="flex-1 h-px" style={{ backgroundColor: `${theme.colors.muted}25` }} />
                            </div>
                        )}

                        {/* Grid */}
                        {gridPosts.length === 0 && !loading && (
                            <div className="py-32 text-center">
                                <p className="text-[22px] font-serif" style={{ color: theme.colors.dark }}>
                                    No posts in this category yet.
                                </p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                            {gridPosts.map((post) => (
                                <BlogCard
                                    key={post.slug}
                                    post={post}
                                    onClick={() => onSelectPost(post.slug)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

// ─── Blog detail view ─────────────────────────────────────────────────────────
function BlogDetail({ slug, onBack }: { slug: string; onBack: () => void }) {
    const { post, related, loading, error } = useBlogPost(slug);
    const [onSelectPost, setOnSelectPost] = useState<string | null>(null);

    // Navigate to another post
    if (onSelectPost) {
        return <BlogDetail slug={onSelectPost} onBack={() => setOnSelectPost(null)} />;
    }

    if (loading) {
        return (
            <div className="max-w-[760px] mx-auto px-6 pt-40 pb-24 animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-1/4 mb-8" />
                <div className="h-12 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-10" />
                <div className="aspect-[16/9] bg-gray-200 rounded-2xl mb-10" />
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded w-full mb-3" />
                ))}
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-[22px] font-serif" style={{ color: theme.colors.dark }}>
                    Post not found
                </p>
                <button
                    onClick={onBack}
                    className="text-[11px] uppercase tracking-[0.25em] underline"
                    style={{ color: theme.colors.muted }}
                >
                    Back to Journal
                </button>
            </div>
        );
    }

    return (
        <main className="min-h-screen font-sans" style={{ backgroundColor: theme.colors.light }}>

            {/* Cover image — full-width cinematic */}
            <div className="relative w-full" style={{ height: "55vh", minHeight: 360 }}>
                <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)",
                    }}
                />
                {/* Back button over image */}
                <button
                    onClick={onBack}
                    className="absolute top-8 left-6 lg:left-10 flex items-center gap-2 text-white/90 text-[11px] uppercase tracking-[0.25em] font-semibold transition-all duration-200 hover:gap-3"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                    </svg>
                    Journal
                </button>

                {/* Category over image */}
                <div className="absolute bottom-8 left-6 lg:left-1/2 lg:-translate-x-1/2 lg:max-w-[760px] lg:w-full px-0 lg:px-6">
                    <span
                        className="text-[9px] uppercase tracking-[0.3em] font-bold px-3 py-1 rounded-full"
                        style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "#fff" }}
                    >
                        {post.category}
                    </span>
                </div>
            </div>

            {/* Article content */}
            <div className="max-w-[760px] mx-auto px-6 lg:px-0 pb-24">

                {/* Title block */}
                <div className="pt-10 pb-8 border-b" style={{ borderColor: `${theme.colors.muted}25` }}>
                    <h1
                        className="font-serif text-4xl md:text-5xl tracking-tight leading-tight mb-4"
                        style={{ color: theme.colors.dark }}
                    >
                        {post.title}
                    </h1>
                    <p className="text-[16px] leading-relaxed mb-6" style={{ color: theme.colors.muted }}>
                        {post.subtitle}
                    </p>

                    {/* Author + meta row */}
                    <div className="flex items-center gap-4">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold"
                            style={{ backgroundColor: `${theme.colors.dark}12`, color: theme.colors.dark }}
                        >
                            {initials(post.author)}
                        </div>
                        <div>
                            <p className="text-[13px] font-semibold" style={{ color: theme.colors.dark }}>
                                {post.author}
                            </p>
                            <p className="text-[11px]" style={{ color: theme.colors.muted }}>
                                {post.authorRole}
                            </p>
                        </div>
                        <div
                            className="ml-auto text-right"
                            style={{ color: theme.colors.muted }}
                        >
                            <p className="text-[12px]">{formatDate(post.date)}</p>
                            <p className="text-[11px]">{post.readTime} min read</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div
                    className="pt-10 prose-blog"
                    style={{ color: theme.colors.dark }}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t" style={{ borderColor: `${theme.colors.muted}25` }}>
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border"
                            style={{ borderColor: `${theme.colors.muted}40`, color: theme.colors.muted }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Related posts */}
            {related.length > 0 && (
                <div className="border-t" style={{ borderColor: `${theme.colors.muted}20` }}>
                    <div className="max-w-[1400px] mx-auto px-6 py-16">
                        <h2
                            className="font-serif text-3xl tracking-tight mb-10"
                            style={{ color: theme.colors.dark }}
                        >
                            Continue Reading
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                            {related.map((p) => (
                                <BlogCard
                                    key={p.slug}
                                    post={p}
                                    onClick={() => setOnSelectPost(p.slug)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}


        </main>
    );
}

// ─── Root page with Suspense ───────────────────────────────────────────────────
function BlogPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeSlug, setActiveSlug] = useState<string | null>(
        searchParams.get("post")
    );

    const handleSelectPost = useCallback((slug: string) => {
        setActiveSlug(slug);
        window.scrollTo({ top: 0, behavior: "smooth" });
        const params = new URLSearchParams(searchParams.toString());
        params.set("post", slug);
        router.replace(`/blog?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    const handleBack = useCallback(() => {
        setActiveSlug(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
        const params = new URLSearchParams(searchParams.toString());
        params.delete("post");
        router.replace(`/blog?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    if (activeSlug) {
        return <BlogDetail slug={activeSlug} onBack={handleBack} />;
    }

    return <BlogList onSelectPost={handleSelectPost} />;
}

export default function BlogPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
            <BlogPageContent />
        </Suspense>
    );
}