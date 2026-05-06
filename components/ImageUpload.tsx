"use client";
import { useRef, useState, useCallback } from "react";
import { Upload, Camera, X, ImageIcon, Loader2, ZoomIn } from "lucide-react";
import { getAuth } from "firebase/auth";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  className?: string;
}

type UploadStatus = "idle" | "uploading";

export function ImageUpload({ value, onChange, label, hint, className = "" }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const currentImage = preview || value;

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB.");
      return;
    }

    setError(null);
    setStatus("uploading");

    // Optimistic local preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      // Get the Firebase ID token the same way useApi/apiFetch does
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Not authenticated. Please sign in again.");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type — browser sets it with the correct boundary for FormData
        },
        body: formData,
      });

      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({}));
        throw new Error(msg || `Upload failed (${res.status})`);
      }

      const { url } = await res.json();
      console.log("[ImageUpload] upload success, url:", url);
      setPreview(url);
      URL.revokeObjectURL(localUrl);
      onChange(url);
      setTimeout(() => setPreview(null), 0);
    } catch (err: any) {
      setError(err.message || "Upload failed. Please try again.");
      setPreview(null);
      URL.revokeObjectURL(localUrl);
    } finally {
      setStatus("idle");
    }
  }, [onChange]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    uploadFile(files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = () => {
    onChange("");
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {/* Camera — capture="environment" opens rear camera on mobile, file picker on desktop */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {currentImage ? (
        /* ── Preview state ── */
        <div className="relative group rounded-2xl overflow-hidden border border-[--border] bg-slate-50">
          <img
            src={currentImage}
            alt="Uploaded"
            className="w-full h-52 object-cover"
            onError={(e) => console.error("[ImageUpload] img failed to load:", currentImage, e)}
          />

          {/* Uploading overlay */}
          {status === "uploading" && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
              <Loader2 size={28} className="animate-spin text-[--accent]" />
              <p className="text-sm font-medium text-slate-600">Uploading…</p>
            </div>
          )}

          {/* Hover actions */}
          {status !== "uploading" && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => setLightbox(true)}
                className="p-2 rounded-xl bg-white/90 text-slate-700 hover:bg-white transition shadow-sm"
                title="Preview"
              >
                <ZoomIn size={16} />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl bg-white/90 text-slate-700 hover:bg-white transition shadow-sm"
                title="Replace from device"
              >
                <Upload size={16} />
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="p-2 rounded-xl bg-white/90 text-slate-700 hover:bg-white transition shadow-sm"
                title="Capture from camera"
              >
                <Camera size={16} />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition shadow-sm"
                title="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Remove button (top-right, visible on hover) */}
          {status !== "uploading" && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-slate-500 hover:text-red-500 hover:bg-white shadow-sm transition opacity-0 group-hover:opacity-100"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        /* ── Empty / drop-zone state ── */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed
            transition-all duration-200 py-10 px-4 cursor-pointer select-none
            ${dragOver
              ? "border-[--accent] bg-[--accent-light] scale-[1.01]"
              : "border-[--border] bg-slate-50 hover:border-[--accent]/50 hover:bg-slate-100/80"
            }
            ${status === "uploading" ? "pointer-events-none opacity-60" : ""}
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          {status === "uploading" ? (
            <>
              <Loader2 size={28} className="animate-spin text-[--accent]" />
              <p className="text-sm font-medium text-slate-500">Uploading image…</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[--accent-light] flex items-center justify-center">
                <ImageIcon size={22} className="text-[--accent]" />
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700">
                  {dragOver ? "Drop to upload" : "Upload an image"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Drag & drop, or choose an option below
                </p>
              </div>

              <div className="flex gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[--border] text-sm font-medium text-slate-700 hover:border-[--accent] hover:text-[--accent] hover:bg-[--accent-light] transition-all shadow-sm"
                >
                  <Upload size={14} />
                  From device
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[--border] text-sm font-medium text-slate-700 hover:border-[--accent] hover:text-[--accent] hover:bg-[--accent-light] transition-all shadow-sm"
                >
                  <Camera size={14} />
                  Camera
                </button>
              </div>

              <p className="text-xs text-slate-400">JPG, PNG, WEBP · Max 10 MB</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
          <X size={12} /> {error}
        </p>
      )}

      {hint && !error && (
        <p className="text-xs text-slate-400">{hint}</p>
      )}

      {lightbox && currentImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
            onClick={() => setLightbox(false)}
          >
            <X size={20} />
          </button>
          <img
            src={currentImage}
            alt="Preview"
            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}