"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";

const theme = {
  colors: {
    primary: "#DBA1A2",
    dark: "#422B23",
    light: "#F7F3ED",
    muted: "#C2C6B9",
    subtitle: "#EFD8D6",
    pink: "#EF7575",
    cream: "#FAF7F2",
  },
};

const schema = z.object({
  password: z.string().min(6, "Minimum 6 characters required"),
});
type FormValues = z.infer<typeof schema>;

// Decorative dot grid
function DotGrid() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill={theme.colors.dark} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  );
}

export default function LoginPage() {
  const { login } = useAdminAuth();
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [authError, setAuthError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    setFocus("password");
  }, [setFocus]);

  const onSubmit = async ({ password }: FormValues) => {
    setAuthError("");
    try {
      await login(password);
      router.replace("/admin");
    } catch (err: any) {
      setAttempts((a) => a + 1);
      setAuthError("Incorrect password. Please try again.");
    }
  };

  const { ref: rhfRef, ...restRegister } = register("password");

  return (
    <div
      className="min-h-screen flex items-stretch"
      style={{ backgroundColor: theme.colors.light }}
    >
      {/* ── LEFT PANEL ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[42%] p-16 relative overflow-hidden"
        style={{ backgroundColor: theme.colors.dark }}
      >
        {/* Background photo */}
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1588359953494-0c215e3cedc6?q=80&w=688&auto=format&fit=crop')",
          }}
        />
        {/* gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, ${theme.colors.dark}F5 0%, ${theme.colors.dark}88 55%, ${theme.colors.dark}F5 100%)`,
          }}
        />

        {/* thin vertical accent line */}
        <div
          className="absolute right-0 top-0 bottom-0 w-[3px]"
          style={{
            background: `linear-gradient(to bottom, transparent, ${theme.colors.primary}, transparent)`,
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <Sparkles className="text-white" size={16} />
          </div>
          <span
            className="text-sm font-bold uppercase tracking-[0.35em] text-white"
            style={{ fontFamily: "serif" }}
          >
            Nailsa
          </span>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          {/* Decorative small label */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] border"
            style={{ borderColor: `${theme.colors.primary}55`, color: theme.colors.primary }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.colors.primary }} />
            Admin Portal
          </div>

          <h2
            className="text-[2.8rem] leading-[1.1] mb-6"
            style={{ color: theme.colors.light, fontFamily: "Georgia, serif" }}
          >
            Precision in<br />
            <span style={{ color: theme.colors.primary }}>Every Detail.</span>
          </h2>
          <p
            className="text-sm font-light max-w-[260px] leading-relaxed opacity-60"
            style={{ color: theme.colors.subtitle }}
          >
            High-performance beauty management, secured with a single private key.
          </p>
        </div>

        <div
          className="relative z-10 text-[9px] uppercase tracking-[0.5em] font-bold opacity-30"
          style={{ color: theme.colors.subtitle }}
        >
          Est. 2026 · Admin Control
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-20 relative overflow-hidden">
        <DotGrid />

        {/* Soft radial glow behind the card */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${theme.colors.primary}18 0%, transparent 70%)`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        <div className="w-full max-w-[380px] z-10">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: theme.colors.dark }}
            >
              <Sparkles className="text-white" size={14} />
            </div>
            <span
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: theme.colors.dark, fontFamily: "serif" }}
            >
              Nailsa
            </span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.35em] mb-2"
              style={{ color: theme.colors.primary }}
            >
              Restricted Access
            </p>
            <h3
              className="text-3xl leading-tight mb-3"
              style={{ color: theme.colors.dark, fontFamily: "Georgia, serif" }}
            >
              Enter your<br />admin password
            </h3>
            <div className="flex items-center gap-2 mt-4">
              <div className="h-[2px] w-10" style={{ backgroundColor: theme.colors.primary }} />
              <div className="h-[2px] w-3 rounded-full opacity-30" style={{ backgroundColor: theme.colors.primary }} />
            </div>
          </div>

          {/* Error */}
          {authError && (
            <div
              className="mb-6 flex items-start gap-3 rounded-xl px-4 py-3 text-xs font-semibold border-l-4"
              style={{
                backgroundColor: "white",
                borderColor: theme.colors.pink,
                color: theme.colors.pink,
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              <span>{authError}{attempts >= 3 ? " Too many attempts." : ""}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Password field */}
            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-[0.3em] mb-3"
                style={{ color: theme.colors.muted }}
              >
                Password
              </label>

              <div
                className="flex items-center rounded-2xl px-5 py-4 transition-all duration-200 focus-within:shadow-[0_0_0_2px]"
                style={{
                  backgroundColor: "white",
                  boxShadow: `0 2px 16px rgba(0,0,0,0.06)`,
                  // focus-within ring via CSS var trick below
                }}
                onFocus={() => { }}
              >
                {/* Lock icon */}
                <div className="mr-3 opacity-30" style={{ color: theme.colors.dark }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>

                <input
                  {...restRegister}
                  ref={(el) => {
                    rhfRef(el);
                    (inputRef as any).current = el;
                  }}
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  className="flex-1 bg-transparent outline-none text-sm font-medium placeholder-opacity-20"
                  style={{ color: theme.colors.dark, letterSpacing: showPwd ? "0" : "0.15em" }}
                />

                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="ml-2 opacity-30 hover:opacity-70 transition-opacity"
                  style={{ color: theme.colors.dark }}
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {errors.password && (
                <p
                  className="mt-2 text-[10px] font-bold"
                  style={{ color: theme.colors.pink }}
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full h-[56px] rounded-2xl overflow-hidden transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
              style={{
                backgroundColor: theme.colors.dark,
                boxShadow: `0 8px 30px ${theme.colors.dark}30`,
              }}
            >
              {/* hover fill */}
              <div
                className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 ease-out"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <span className="relative z-10 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-white">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying…
                  </span>
                ) : (
                  <>
                    Unlock Dashboard
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1.5 transition-transform duration-300"
                    />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 flex items-center justify-between">
            <div className="flex items-center gap-2 opacity-35">
              <ShieldCheck size={13} style={{ color: theme.colors.dark }} />
              <span
                className="text-[9px] font-bold uppercase tracking-widest"
                style={{ color: theme.colors.dark }}
              >
                256-bit Encrypted
              </span>
            </div>
            <a
              href="/forgot-password"
              className="text-[9px] font-bold uppercase tracking-widest opacity-35 hover:opacity-70 transition-opacity"
              style={{ color: theme.colors.dark }}
            >
              Forgot password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}