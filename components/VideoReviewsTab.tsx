"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { VideoReview } from "@/types/product";
import {
    Upload, Trash2, Play, Pause, Film, User,
    AlertCircle, CheckCircle2, Plus, Loader2, GripVertical,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import toast from "react-hot-toast";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
// primary: #DBA1A2  dark: #422B23  light: #F7F3ED  muted: #C2C6B9
// subtitle: #EFD8D6  pink: #EF7575

// ─── Types ────────────────────────────────────────────────────────────────────

interface DraftReview {
    id: string;
    user: string;
    videoUrl: string;
    poster: string;
    videoFile: File | null;
    posterFile: File | null;
    videoPreview: string | null;
    posterPreview: string | null;
    videoProgress: number;
    posterProgress: number;
    videoKey: string | null;
    posterKey: string | null;
    isExisting: boolean;
}

interface VideoReviewsTabProps {
    productId: string;
    initialReviews?: VideoReview[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId() {
    return Math.random().toString(36).slice(2, 10);
}

function extractKey(url: string): string | null {
    const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "");
    if (!base || !url?.startsWith(base)) return null;
    return url.replace(base + "/", "");
}

function makeDraft(review: VideoReview): DraftReview {
    return {
        ...review,
        videoFile: null,
        posterFile: null,
        videoPreview: null,
        posterPreview: null,
        videoProgress: 100,
        posterProgress: review.poster ? 100 : 0,
        videoKey: extractKey(review.videoUrl),
        posterKey: extractKey(review.poster),
        isExisting: true,
    };
}

// ─── Upload helper (XHR for progress) ────────────────────────────────────────

async function uploadToR2(
    file: File,
    type: "video" | "poster",
    onProgress: (pct: number) => void
): Promise<{ url: string; key: string }> {
    const { getAuth } = await import("firebase/auth");
    const user = getAuth().currentUser;
    if (!user) throw new Error("Not authenticated");
    const token = await user.getIdToken();

    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/upload-video");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        });

        xhr.addEventListener("load", () => {
            if (xhr.status === 201) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                try {
                    const err = JSON.parse(xhr.responseText);
                    reject(new Error(err.error || "Upload failed"));
                } catch {
                    reject(new Error(`Upload failed (${xhr.status})`));
                }
            }
        });

        xhr.addEventListener("error", () => reject(new Error("Network error")));
        xhr.send(formData);
    });
}

// ─── Review card ──────────────────────────────────────────────────────────────

function ReviewCard({
    draft,
    index,
    uploading,
    onChange,
    onRemove,
}: {
    draft: DraftReview;
    index: number;
    uploading: boolean;
    onChange: (id: string, patch: Partial<DraftReview>) => void;
    onRemove: (id: string) => void;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const posterInputRef = useRef<HTMLInputElement>(null);
    const [playing, setPlaying] = useState(false);

    const videoSrc = draft.videoPreview || draft.videoUrl || null;
    const posterSrc = draft.posterPreview || draft.poster || null;

    const handleVideoFile = (file: File) => {
        const prev = draft.videoPreview;
        const preview = URL.createObjectURL(file);
        if (prev) URL.revokeObjectURL(prev);
        onChange(draft.id, { videoFile: file, videoPreview: preview, videoProgress: 0 });
    };

    const handlePosterFile = (file: File) => {
        const prev = draft.posterPreview;
        const preview = URL.createObjectURL(file);
        if (prev) URL.revokeObjectURL(prev);
        onChange(draft.id, { posterFile: file, posterPreview: preview, posterProgress: 0 });
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;
        if (file.type.startsWith("video/")) handleVideoFile(file);
        else if (file.type.startsWith("image/")) handlePosterFile(file);
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (playing) { videoRef.current.pause(); setPlaying(false); }
        else { videoRef.current.play(); setPlaying(true); }
    };

    const isVideoUploading = draft.videoProgress > 0 && draft.videoProgress < 100 && !!draft.videoFile;
    const isPosterUploading = draft.posterProgress > 0 && draft.posterProgress < 100 && !!draft.posterFile;

    return (
        <div
            className="group relative rounded-2xl overflow-hidden transition-all duration-200"
            style={{
                background: "#F7F3ED",
                border: "1.5px solid #EFD8D6",
                boxShadow: "0 2px 12px 0 rgba(66,43,35,0.06)",
            }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            {/* Card top bar */}
            <div
                className="flex items-center justify-between px-4 py-2.5"
                style={{ borderBottom: "1px solid #EFD8D6", background: "#EFD8D6" }}
            >
                <div className="flex items-center gap-2">
                    <GripVertical size={13} style={{ color: "#C2C6B9" }} className="cursor-grab" />
                    <span className="text-[10px] font-mono tracking-widest" style={{ color: "#DBA1A2" }}>
                        #{String(index + 1).padStart(2, "0")}
                    </span>
                    {draft.isExisting && (
                        <span
                            className="text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-widest"
                            style={{
                                background: "rgba(219,161,162,0.18)",
                                color: "#422B23",
                                border: "1px solid rgba(219,161,162,0.4)",
                            }}
                        >
                            Saved
                        </span>
                    )}
                    {draft.videoFile && !isVideoUploading && (
                        <span
                            className="text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-widest"
                            style={{
                                background: "rgba(239,117,117,0.12)",
                                color: "#EF7575",
                                border: "1px solid rgba(239,117,117,0.25)",
                            }}
                        >
                            Pending
                        </span>
                    )}
                </div>

                <button
                    onClick={() => onRemove(draft.id)}
                    disabled={uploading}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40"
                    style={{
                        background: "rgba(239,117,117,0.1)",
                        border: "1px solid rgba(239,117,117,0.2)",
                        color: "#EF7575",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,117,117,0.22)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,117,117,0.1)")}
                >
                    <Trash2 size={12} />
                </button>
            </div>

            <div className="flex">
                {/* Video column */}
                <div
                    className="w-[140px] flex-none relative"
                    style={{ aspectRatio: "9/16", background: "#422B23" }}
                >
                    {videoSrc ? (
                        <>
                            <video
                                ref={videoRef}
                                src={videoSrc}
                                poster={posterSrc ?? undefined}
                                className="w-full h-full object-cover"
                                loop muted playsInline
                                onEnded={() => setPlaying(false)}
                            />
                            {isVideoUploading && (
                                <div
                                    className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                                    style={{ background: "rgba(66,43,35,0.75)" }}
                                >
                                    <Loader2 size={20} style={{ color: "#DBA1A2" }} className="animate-spin" />
                                    <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: "rgba(219,161,162,0.2)" }}>
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{ width: `${draft.videoProgress}%`, background: "#DBA1A2" }}
                                        />
                                    </div>
                                    <span className="text-[10px]" style={{ color: "#EFD8D6" }}>{draft.videoProgress}%</span>
                                </div>
                            )}
                            {!isVideoUploading && (
                                <div className="absolute inset-0 flex items-end justify-center pb-3">
                                    <button
                                        onClick={togglePlay}
                                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
                                        style={{
                                            background: "rgba(247,243,237,0.18)",
                                            backdropFilter: "blur(6px)",
                                            border: "1px solid rgba(247,243,237,0.3)",
                                            color: "#F7F3ED",
                                        }}
                                    >
                                        {playing
                                            ? <Pause size={13} fill="#F7F3ED" />
                                            : <Play size={13} fill="#F7F3ED" className="ml-0.5" />
                                        }
                                    </button>
                                </div>
                            )}
                            {!isVideoUploading && (
                                <button
                                    onClick={() => videoInputRef.current?.click()}
                                    className="absolute top-2 left-2 text-[9px] rounded-lg px-2 py-1 transition-colors opacity-0 group-hover:opacity-100"
                                    style={{
                                        background: "rgba(66,43,35,0.6)",
                                        backdropFilter: "blur(4px)",
                                        border: "1px solid rgba(247,243,237,0.2)",
                                        color: "#EFD8D6",
                                    }}
                                >
                                    Replace
                                </button>
                            )}
                        </>
                    ) : (
                        <button
                            onClick={() => videoInputRef.current?.click()}
                            className="w-full h-full flex flex-col items-center justify-center gap-2.5 transition-colors"
                        >
                            <div
                                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                                style={{ border: "2px dashed rgba(219,161,162,0.35)" }}
                            >
                                <Film size={18} style={{ color: "rgba(219,161,162,0.6)" }} />
                            </div>
                            <span
                                className="text-[9px] font-medium tracking-wider uppercase px-2 text-center leading-snug"
                                style={{ color: "rgba(219,161,162,0.6)" }}
                            >
                                Click or drop video
                            </span>
                        </button>
                    )}
                    <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleVideoFile(f); }}
                    />
                </div>

                {/* Fields column */}
                <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
                    {/* Username */}
                    <div className="space-y-1">
                        <label
                            className="text-[9px] font-semibold tracking-[0.15em] uppercase flex items-center gap-1"
                            style={{ color: "#C2C6B9" }}
                        >
                            <User size={9} /> Reviewer Handle
                        </label>
                        <div
                            className="flex items-center gap-1.5 rounded-xl px-3 py-2 transition-all"
                            style={{ background: "rgba(219,161,162,0.08)", border: "1.5px solid #EFD8D6" }}
                            onFocusCapture={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#DBA1A2")}
                            onBlurCapture={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#EFD8D6")}
                        >
                            <span className="text-xs" style={{ color: "#DBA1A2" }}>@</span>
                            <input
                                type="text"
                                value={draft.user}
                                onChange={(e) => onChange(draft.id, { user: e.target.value })}
                                placeholder="username"
                                disabled={uploading}
                                className="flex-1 bg-transparent text-sm font-medium outline-none disabled:opacity-50 placeholder:text-[#C2C6B9]"
                                style={{ color: "#422B23" }}
                            />
                        </div>
                    </div>

                    {/* Poster */}
                    <div className="space-y-1">
                        <label
                            className="text-[9px] font-semibold tracking-[0.15em] uppercase"
                            style={{ color: "#C2C6B9" }}
                        >
                            Poster / Thumbnail
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-none">
                                {posterSrc ? (
                                    <img
                                        src={posterSrc}
                                        alt="poster"
                                        className="w-9 h-12 object-cover rounded-lg"
                                        style={{ border: "1.5px solid #EFD8D6" }}
                                    />
                                ) : (
                                    <div
                                        className="w-9 h-12 rounded-lg flex items-center justify-center"
                                        style={{ border: "1.5px dashed #DBA1A2", background: "rgba(219,161,162,0.06)" }}
                                    >
                                        <Upload size={10} style={{ color: "#DBA1A2" }} />
                                    </div>
                                )}
                                {isPosterUploading && (
                                    <div
                                        className="absolute inset-0 rounded-lg flex items-center justify-center"
                                        style={{ background: "rgba(66,43,35,0.6)" }}
                                    >
                                        <Loader2 size={10} style={{ color: "#EFD8D6" }} className="animate-spin" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                                <input
                                    type="text"
                                    value={draft.poster}
                                    onChange={(e) => onChange(draft.id, { poster: e.target.value })}
                                    placeholder="https://... or upload"
                                    disabled={uploading}
                                    className="w-full rounded-xl px-3 py-2 text-xs font-mono truncate outline-none transition-all disabled:opacity-50 placeholder:text-[#C2C6B9]"
                                    style={{
                                        background: "rgba(219,161,162,0.08)",
                                        border: "1.5px solid #EFD8D6",
                                        color: "#422B23",
                                    }}
                                    onFocus={(e) => (e.currentTarget.style.borderColor = "#DBA1A2")}
                                    onBlur={(e) => (e.currentTarget.style.borderColor = "#EFD8D6")}
                                />
                                <button
                                    onClick={() => posterInputRef.current?.click()}
                                    disabled={uploading}
                                    className="text-[9px] flex items-center gap-1 transition-colors disabled:opacity-40"
                                    style={{ color: "#C2C6B9" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = "#DBA1A2")}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = "#C2C6B9")}
                                >
                                    <Upload size={8} /> Upload image
                                </button>
                            </div>
                        </div>
                        <input
                            ref={posterInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            className="hidden"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePosterFile(f); }}
                        />
                    </div>

                    {/* Status pills */}
                    <div className="mt-auto pt-1 flex flex-wrap gap-1.5">
                        {(draft.videoUrl || draft.videoPreview) && !isVideoUploading && (
                            <span
                                className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest rounded-full px-2 py-0.5"
                                style={{
                                    background: "rgba(66,43,35,0.08)",
                                    color: "#422B23",
                                    border: "1px solid rgba(66,43,35,0.15)",
                                }}
                            >
                                <CheckCircle2 size={8} style={{ color: "#DBA1A2" }} /> Video ready
                            </span>
                        )}
                        {isVideoUploading && (
                            <span
                                className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest rounded-full px-2 py-0.5"
                                style={{
                                    background: "rgba(219,161,162,0.12)",
                                    color: "#422B23",
                                    border: "1px solid rgba(219,161,162,0.3)",
                                }}
                            >
                                <Loader2 size={8} className="animate-spin" style={{ color: "#DBA1A2" }} />
                                Uploading {draft.videoProgress}%
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function VideoReviewsTab({
    productId,
    initialReviews = [],
}: VideoReviewsTabProps) {
    const { apiFetch } = useApi();
    const [drafts, setDrafts] = useState<DraftReview[]>(() =>
        initialReviews.map(makeDraft)
    );
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const deletedKeysRef = useRef<string[]>([]);

    useEffect(() => {
        return () => {
            drafts.forEach((d) => {
                if (d.videoPreview) URL.revokeObjectURL(d.videoPreview);
                if (d.posterPreview) URL.revokeObjectURL(d.posterPreview);
            });
        };
    }, []);

    const addReview = () => {
        setDrafts((prev) => [
            ...prev,
            {
                id: generateId(),
                user: "",
                videoUrl: "",
                poster: "",
                videoFile: null,
                posterFile: null,
                videoPreview: null,
                posterPreview: null,
                videoProgress: 0,
                posterProgress: 0,
                videoKey: null,
                posterKey: null,
                isExisting: false,
            },
        ]);
    };

    const handleChange = useCallback((id: string, patch: Partial<DraftReview>) => {
        setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
    }, []);

    const handleRemove = useCallback((id: string) => {
        setDrafts((prev) => {
            const target = prev.find((d) => d.id === id);
            if (target) {
                if (target.videoKey) deletedKeysRef.current.push(target.videoKey);
                if (target.posterKey) deletedKeysRef.current.push(target.posterKey);
                if (target.videoPreview) URL.revokeObjectURL(target.videoPreview);
                if (target.posterPreview) URL.revokeObjectURL(target.posterPreview);
            }
            return prev.filter((d) => d.id !== id);
        });
    }, []);

    const handleSave = async () => {
        const invalid = drafts.filter((d) => !d.videoUrl && !d.videoFile && !d.videoPreview);
        if (invalid.length > 0) {
            toast.error(`${invalid.length} review(s) are missing a video`);
            return;
        }

        setUploading(true);
        let updatedDrafts = [...drafts];

        try {
            await Promise.all(
                updatedDrafts.map(async (draft, i) => {
                    const patches: Partial<DraftReview> = {};

                    if (draft.videoFile) {
                        if (draft.videoKey) deletedKeysRef.current.push(draft.videoKey);
                        const result = await uploadToR2(draft.videoFile, "video", (pct) => {
                            setDrafts((prev) =>
                                prev.map((d) => (d.id === draft.id ? { ...d, videoProgress: pct } : d))
                            );
                        });
                        patches.videoUrl = result.url;
                        patches.videoKey = result.key;
                        patches.videoFile = null;
                    }

                    if (draft.posterFile) {
                        if (draft.posterKey) deletedKeysRef.current.push(draft.posterKey);
                        const result = await uploadToR2(draft.posterFile, "poster", (pct) => {
                            setDrafts((prev) =>
                                prev.map((d) => (d.id === draft.id ? { ...d, posterProgress: pct } : d))
                            );
                        });
                        patches.poster = result.url;
                        patches.posterKey = result.key;
                        patches.posterFile = null;
                    }

                    if (Object.keys(patches).length) {
                        updatedDrafts[i] = { ...draft, ...patches };
                    }
                })
            );

            setUploading(false);
            setSaving(true);

            const videoReviews: VideoReview[] = updatedDrafts.map((d) => ({
                id: d.id,
                user: d.user,
                videoUrl: d.videoUrl,
                poster: d.poster,
            }));

            await apiFetch(`/api/admin/products/${productId}/video-reviews`, {
                method: "PUT",
                body: JSON.stringify({
                    videoReviews,
                    deletedKeys: deletedKeysRef.current,
                }),
            });

            setDrafts(updatedDrafts.map((d) => ({ ...d, isExisting: true })));
            deletedKeysRef.current = [];

            toast.success(`${videoReviews.length} video review${videoReviews.length !== 1 ? "s" : ""} saved`);
        } catch (err: any) {
            toast.error(err.message || "Failed to save video reviews");
        } finally {
            setUploading(false);
            setSaving(false);
        }
    };

    const isBusy = uploading || saving;
    const pendingCount = drafts.filter((d) => d.videoFile || d.posterFile).length;

    return (
        <div className="space-y-5">
            {/* Cards grid */}
            {drafts.length === 0 ? (
                <div
                    className="flex flex-col items-center justify-center py-20 text-center gap-4 rounded-2xl"
                    style={{
                        border: "1.5px dashed #DBA1A2",
                        background: "rgba(219,161,162,0.04)",
                    }}
                >
                    <div
                        className="w-14 h-14 rounded-3xl flex items-center justify-center"
                        style={{
                            background: "rgba(219,161,162,0.1)",
                            border: "1.5px dashed #DBA1A2",
                        }}
                    >
                        <Film size={22} style={{ color: "#DBA1A2" }} />
                    </div>
                    <div>
                        <p className="text-sm font-medium" style={{ color: "#422B23" }}>No video reviews yet</p>
                        <p className="text-xs mt-1" style={{ color: "#C2C6B9" }}>Add your first review below</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {drafts.map((draft, i) => (
                        <ReviewCard
                            key={draft.id}
                            draft={draft}
                            index={i}
                            uploading={isBusy}
                            onChange={handleChange}
                            onRemove={handleRemove}
                        />
                    ))}
                </div>
            )}

            {/* Add row */}
            <button
                onClick={addReview}
                disabled={isBusy}
                className="w-full py-3 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 transition-all group disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ border: "1.5px dashed #DBA1A2", color: "#DBA1A2", background: "transparent" }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(219,161,162,0.08)";
                    e.currentTarget.style.color = "#422B23";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#DBA1A2";
                }}
            >
                <Plus size={15} className="transition-transform duration-300 group-hover:rotate-90" />
                Add Video Review
            </button>

            {/* Footer */}
            <div
                className="flex items-center justify-between pt-3"
                style={{ borderTop: "1px solid #EFD8D6" }}
            >
                <div className="text-xs flex items-center gap-2">
                    {pendingCount > 0 && !isBusy && (
                        <span className="flex items-center gap-1.5" style={{ color: "#EF7575" }}>
                            <AlertCircle size={12} />
                            {pendingCount} file{pendingCount > 1 ? "s" : ""} will be uploaded on save
                        </span>
                    )}
                    {uploading && (
                        <span className="flex items-center gap-1.5" style={{ color: "#DBA1A2" }}>
                            <Loader2 size={12} className="animate-spin" />
                            Uploading to R2…
                        </span>
                    )}
                    {saving && (
                        <span className="flex items-center gap-1.5" style={{ color: "#DBA1A2" }}>
                            <Loader2 size={12} className="animate-spin" />
                            Saving to Firestore…
                        </span>
                    )}
                </div>

                <button
                    onClick={handleSave}
                    disabled={isBusy || drafts.length === 0}
                    className="px-5 py-2.5 text-sm font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    style={{ background: "#422B23", color: "#F7F3ED" }}
                    onMouseEnter={(e) => { if (!isBusy) e.currentTarget.style.background = "#5a3a2e"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#422B23"; }}
                >
                    {isBusy ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            {uploading ? "Uploading…" : "Saving…"}
                        </>
                    ) : (
                        <>
                            <CheckCircle2 size={14} style={{ color: "#DBA1A2" }} />
                            Save {drafts.length > 0 ? `${drafts.length} Review${drafts.length > 1 ? "s" : ""}` : "Reviews"}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}