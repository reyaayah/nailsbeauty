"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, PenLine, X, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import Image from "next/image";
import theme from "@/theme";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Review {
    id: string;
    userId: string;
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

// ── Star renderer ─────────────────────────────────────────────────────────────
function Stars({
    value,
    interactive = false,
    size = 16,
    onChange,
}: {
    value: number;
    interactive?: boolean;
    size?: number;
    onChange?: (v: number) => void;
}) {
    const [hovered, setHovered] = useState(0);
    const display = interactive ? (hovered || value) : value;

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <button
                    key={s}
                    type={interactive ? "button" : undefined}
                    onClick={interactive ? () => onChange?.(s) : undefined}
                    onMouseEnter={interactive ? () => setHovered(s) : undefined}
                    onMouseLeave={interactive ? () => setHovered(0) : undefined}
                    className={interactive ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}
                    aria-label={interactive ? `Rate ${s} stars` : undefined}
                >
                    <Star
                        size={size}
                        fill={s <= display ? "#F59E0B" : "none"}
                        stroke={s <= display ? "#F59E0B" : "#D1D5DB"}
                        strokeWidth={1.5}
                    />
                </button>
            ))}
        </div>
    );
}

// ── Rating bar row ────────────────────────────────────────────────────────────
function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex items-center gap-3 text-xs">
            <span className="w-4 text-right font-semibold opacity-70">{star}</span>
            <Star size={11} fill="#F59E0B" stroke="#F59E0B" />
            <div className="flex-1 rounded-full h-2 overflow-hidden" style={{ backgroundColor: `${theme.colors.dark}12` }}>
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: "#F59E0B" }}
                />
            </div>
            <span className="w-6 text-right opacity-50">{count}</span>
        </div>
    );
}

// ── Avatar initials fallback ──────────────────────────────────────────────────
function Avatar({ name, src, size = 36 }: { name: string; src?: string; size?: number }) {
    const initials = name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    if (src) {
        return (
            <Image
                src={src}
                alt={name}
                width={size}
                height={size}
                className="rounded-full object-cover flex-shrink-0"
                style={{ width: size, height: size }}
            />
        );
    }
    return (
        <div
            className="rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-xs"
            style={{
                width: size,
                height: size,
                backgroundColor: theme.colors.primary,
                fontSize: size * 0.36,
            }}
        >
            {initials}
        </div>
    );
}

// ── Review card ───────────────────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
    const date = new Date(review.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <article
            className="rounded-2xl p-5 flex flex-col gap-3 border"
            style={{
                borderColor: `${theme.colors.dark}0D`,
                backgroundColor: "white",
            }}
        >
            {/* Header */}
            <div className="flex items-start gap-3">
                <Avatar name={review.userName} src={review.userAvatar} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm truncate">{review.userName}</span>
                        {review.verified && (
                            <span
                                className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{
                                    backgroundColor: `${theme.colors.primary}15`,
                                    color: theme.colors.primary,
                                }}
                            >
                                <ShieldCheck size={10} />
                                Verified
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <Stars value={review.rating} size={13} />
                        <span className="text-[11px] opacity-40">{date}</span>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div>
                <p className="font-semibold text-sm mb-1">{review.title}</p>
                <p className="text-sm leading-relaxed opacity-70">{review.body}</p>
            </div>
        </article>
    );
}

// ── Write Review Modal ────────────────────────────────────────────────────────
function WriteReviewModal({
    productId,
    onClose,
    onSubmitted,
}: {
    productId: string;
    onClose: () => void;
    onSubmitted: (review: Review) => void;
}) {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) { toast.error("Please select a star rating"); return; }
        if (!title.trim()) { toast.error("Please add a review title"); return; }
        if (!body.trim()) { toast.error("Please write your review"); return; }

        setSubmitting(true);
        try {
            const token = await user!.getIdToken();
            const res = await fetch(`/api/products/${productId}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ rating, title, reviewBody: body }),
            });

            if (res.status === 409) {
                toast.error("You've already reviewed this product");
                onClose();
                return;
            }
            if (!res.ok) {
                // Safely parse error — body may be empty on 500s
                let message = "Failed to submit review";
                try {
                    const err = await res.json();
                    message = err?.error ?? message;
                } catch { /* no body — keep default message */ }
                throw new Error(message);
            }

            let newReview: Review;
            try {
                newReview = await res.json();
            } catch {
                throw new Error("Unexpected response from server");
            }
            toast.success("Review submitted!");
            onSubmitted(newReview);
            onClose();
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="w-full max-w-lg rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl"
                style={{ backgroundColor: theme.colors.light }}
            >
                {/* Modal header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-serif" style={{ color: theme.colors.dark }}>
                        Write a Review
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-black/5 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Star picker */}
                <div>
                    <label className="block text-xs font-black uppercase tracking-widest mb-2 opacity-60">
                        Your Rating *
                    </label>
                    <Stars value={rating} interactive size={28} onChange={setRating} />
                </div>

                {/* Title */}
                <div>
                    <label className="block text-xs font-black uppercase tracking-widest mb-2 opacity-60">
                        Review Title *
                    </label>
                    <input
                        type="text"
                        maxLength={80}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Summarise your experience"
                        className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 transition-all"
                        style={{
                            borderColor: `${theme.colors.dark}20`,
                            backgroundColor: "white",
                            color: theme.colors.dark,
                        }}
                        // @ts-ignore
                        onFocus={(e) => (e.currentTarget.style.ringColor = theme.colors.primary)}
                    />
                </div>

                {/* Body */}
                <div>
                    <label className="block text-xs font-black uppercase tracking-widest mb-2 opacity-60">
                        Your Review *
                    </label>
                    <textarea
                        rows={4}
                        maxLength={1000}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="What did you love? How do they fit? Any tips?"
                        className="w-full rounded-xl border px-4 py-3 text-sm outline-none resize-none transition-all"
                        style={{
                            borderColor: `${theme.colors.dark}20`,
                            backgroundColor: "white",
                            color: theme.colors.dark,
                        }}
                    />
                    <p className="text-[11px] opacity-40 text-right mt-1">{body.length}/1000</p>
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full py-3.5 rounded-full font-black text-sm tracking-widest text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ backgroundColor: theme.colors.primary }}
                >
                    {submitting ? (
                        <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                    ) : (
                        <><CheckCircle2 size={16} /> Submit Review</>
                    )}
                </button>
            </div>
        </div>
    );
}

// ── Main ProductReviews component ─────────────────────────────────────────────
export default function ProductReviews({ productId }: { productId: string }) {
    const { user } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products/${productId}/reviews`);
            if (!res.ok) throw new Error("Failed to load reviews");
            let data: ReviewStats;
            try {
                data = await res.json();
            } catch {
                throw new Error("Invalid response from server");
            }
            setStats(data);
        } catch {
            // silently fail — reviews are non-critical
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => { fetchReviews(); }, [fetchReviews]);

    const handleReviewSubmitted = (review: Review) => {
        setStats((prev) => {
            if (!prev) return prev;
            const updatedReviews = [review, ...prev.reviews];
            const total = updatedReviews.length;
            const avg = updatedReviews.reduce((s, r) => s + r.rating, 0) / total;
            const distribution = [5, 4, 3, 2, 1].map((star) => ({
                star,
                count: updatedReviews.filter((r) => r.rating === star).length,
            }));
            return { reviews: updatedReviews, totalCount: total, avgRating: avg, distribution };
        });
    };

    const openWriteReview = () => {
        if (!user) {
            sessionStorage.setItem("redirectAfterLogin", `/products/${productId}`);
            router.push("/auth/login");
            return;
        }
        setShowModal(true);
    };

    if (loading) {
        return (
            <section className="w-full py-12 flex justify-center">
                <Loader2 size={24} className="animate-spin" style={{ color: theme.colors.primary }} />
            </section>
        );
    }

    const { reviews = [], totalCount = 0, avgRating = 0, distribution = [] } = stats ?? {};

    return (
        <>
            <section
                className="w-full py-12 px-6"
                id="reviews"
            >
                {/* Section header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                    <div>
                        <h2
                            className="text-3xl sm:text-4xl font-serif tracking-tight mb-1"
                            style={{ color: theme.colors.dark }}
                        >
                            Customer Reviews
                        </h2>
                        <p className="text-sm opacity-50">
                            {totalCount > 0
                                ? `${totalCount} review${totalCount !== 1 ? "s" : ""}`
                                : "Be the first to review this product"}
                        </p>
                    </div>
                    <button
                        onClick={openWriteReview}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-xs tracking-widest text-white transition-all hover:opacity-90 shadow-md hover:shadow-lg self-start sm:self-auto flex-shrink-0"
                        style={{ backgroundColor: theme.colors.primary }}
                    >
                        <PenLine size={14} />
                        Write a Review
                    </button>
                </div>

                {totalCount > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                        {/* ── Summary panel ── */}
                        <div
                            className="rounded-3xl p-6 flex flex-col items-center justify-center gap-3 border col-span-1"
                            style={{
                                borderColor: `${theme.colors.dark}0D`,
                                backgroundColor: "white",
                            }}
                        >
                            <p
                                className="text-6xl font-serif font-bold"
                                style={{ color: theme.colors.dark }}
                            >
                                {avgRating.toFixed(1)}
                            </p>
                            <Stars value={Math.round(avgRating)} size={20} />
                            <p className="text-xs opacity-50 font-medium">
                                Based on {totalCount} review{totalCount !== 1 ? "s" : ""}
                            </p>

                            {/* Distribution bars */}
                            <div className="w-full mt-2 flex flex-col gap-2">
                                {distribution.map(({ star, count }) => (
                                    <RatingBar key={star} star={star} count={count} total={totalCount} />
                                ))}
                            </div>
                        </div>

                        {/* ── Review grid ── */}
                        <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
                            {reviews
                                .filter((r) => r.rating > 4)
                                .map((review) => (
                                    <ReviewCard key={review.id} review={review} />
                                ))}
                        </div>
                    </div>
                )}

                {totalCount === 0 && (
                    <div
                        className="rounded-3xl p-12 flex flex-col items-center gap-4 border text-center"
                        style={{
                            borderColor: `${theme.colors.dark}0D`,
                            backgroundColor: "white",
                        }}
                    >
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${theme.colors.primary}15` }}
                        >
                            <Star size={24} style={{ color: theme.colors.primary }} />
                        </div>
                        <p className="font-serif text-xl" style={{ color: theme.colors.dark }}>
                            No reviews yet
                        </p>
                        <p className="text-sm opacity-50 max-w-xs">
                            Share your thoughts — be the first to review this product.
                        </p>
                        <button
                            onClick={openWriteReview}
                            className="mt-2 px-6 py-3 rounded-full font-black text-xs tracking-widest text-white transition-all hover:opacity-90"
                            style={{ backgroundColor: theme.colors.primary }}
                        >
                            Write the First Review
                        </button>
                    </div>
                )}
            </section>

            {showModal && (
                <WriteReviewModal
                    productId={productId}
                    onClose={() => setShowModal(false)}
                    onSubmitted={handleReviewSubmitted}
                />
            )}
        </>
    );
}