"use client";

/**
 * app/auth/register/page.tsx  (updated — adds email OTP verification step)
 * ─────────────────────────────────────────────────────────────────────────────
 * Step 1: User fills in registration form and submits
 *   → OTP is sent to the entered email
 *   → View transitions to OtpVerificationStep
 *
 * Step 2: OtpVerificationStep verifies code via /api/auth/verify-otp
 *   → onVerified() fires → register() is called → user is created in Firebase
 *   → Redirect to "/"
 *
 * Google sign-in bypasses OTP entirely (Google already verifies email).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, FormEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    Eye, EyeOff, Mail, Lock, User,
    AlertCircle, CheckCircle2, Gift,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import theme from "@/theme";
import RewardsModal from "@/components/modals/RewardsModal";
import OtpVerificationStep from "@/components/auth/OtpVerificationStep";

/* ─── View state ─────────────────────────────────────────────────────────── */
type View = "form" | "otp";

/* ─── Component ───────────────────────────────────────────────────────────── */
function RegisterPageInner() {
    const { register, loginWithGoogle, authError, clearError } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    /* ── Form fields ─────────────────────────────────────────────────── */
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [referralCode, setReferralCode] = useState("");

    /* ── UI state ────────────────────────────────────────────────────── */
    const [view, setView] = useState<View>("form");
    const [submitting, setSubmitting] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    /* ── Read ?ref= from URL ─────────────────────────────────────────── */
    useEffect(() => {
        const ref = searchParams.get("ref");
        if (ref) setReferralCode(ref.toUpperCase().trim());
    }, [searchParams]);

    /* ── Password strength ───────────────────────────────────────────── */
    const passwordStrength = (p: string) => {
        if (p.length === 0) return 0;
        if (p.length < 6) return 1;
        if (p.length < 10 || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) return 2;
        return 3;
    };
    const strength = passwordStrength(password);
    const strengthLabel = ["", "Weak", "Fair", "Strong"];
    const strengthColor = ["", "#ef4444", "#f59e0b", "#22c55e"];

    /* ── Step 1: validate form then switch to OTP view ─────────────── */
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        clearError();
        setLocalError(null);

        if (password !== confirmPassword) {
            setLocalError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setLocalError("Password must be at least 6 characters.");
            return;
        }

        // OtpVerificationStep owns sending the OTP — just switch views here
        setView("otp");
    };

    /* ── Step 2: OTP verified — now create Firebase account ──────────── */
    const handleVerified = async () => {
        setSubmitting(true);
        try {
            await register(email, password, displayName, referralCode || undefined);
            router.push("/");
        } catch {
            // authError is set inside register() — drop back to form so user can retry
            setView("form");
        } finally {
            setSubmitting(false);
        }
    };

    /* ── Google (no OTP needed) ──────────────────────────────────────── */
    const handleGoogle = async () => {
        clearError();
        setGoogleLoading(true);
        try {
            await loginWithGoogle(referralCode || undefined);
            router.push("/");
        } catch {
            // error set in context
        } finally {
            setGoogleLoading(false);
        }
    };

    const error = localError || authError;

    /* ── OTP view ────────────────────────────────────────────────────── */
    if (view === "otp") {
        return (
            <div
                className="min-h-screen flex items-center justify-center px-4 py-24"
                style={{ backgroundColor: theme.colors.light }}
            >
                <OtpVerificationStep
                    email={email}
                    onVerified={handleVerified}
                    onBack={() => {
                        clearError();
                        setLocalError(null);
                        setView("form");
                    }}
                />
                <RewardsModal />
            </div>
        );
    }

    /* ── Form view ───────────────────────────────────────────────────── */
    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-24"
            style={{ backgroundColor: theme.colors.light }}
        >
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-serif tracking-tight mb-3" style={{ color: theme.colors.dark }}>
                        Create account
                    </h1>
                    <p className="text-sm font-medium text-slate-600">
                        Join Nailsa and start your beauty journey
                    </p>
                </div>

                {/* Referral badge */}
                {referralCode && (
                    <div
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-6 text-sm font-semibold"
                        style={{
                            backgroundColor: theme.colors.primary + "15",
                            border: `1.5px solid ${theme.colors.primary}30`,
                            color: theme.colors.dark,
                        }}
                    >
                        <Gift size={16} style={{ color: theme.colors.primary }} className="shrink-0" />
                        <span>
                            Referral code{" "}
                            <span className="font-black font-mono tracking-widest">{referralCode}</span>{" "}
                            applied — you&apos;ll earn{" "}
                            <span style={{ color: theme.colors.primary }}>150 bonus points</span> on signup!
                        </span>
                    </div>
                )}

                {/* Error banner */}
                {error && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Google button */}
                <button
                    onClick={handleGoogle}
                    disabled={googleLoading || submitting}
                    className="w-full flex items-center justify-center gap-3 border-2 rounded-xl py-3.5 text-sm font-bold tracking-tight transition-all hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 mb-8"
                    style={{ borderColor: theme.colors.muted, color: theme.colors.dark }}
                >
                    <svg width="20" height="20" viewBox="0 0 18 18">
                        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
                        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
                        <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
                        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
                    </svg>
                    {googleLoading ? "Signing up…" : "Continue with Google"}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Or use email</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Full Name */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1" style={{ color: theme.colors.dark }}>Full Name</label>
                        <div className="relative">
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text" placeholder="Jade Doe" value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)} required
                                className="w-full pl-12 pr-4 py-4 border-2 rounded-xl text-sm bg-gray-50/50 outline-none focus:bg-white focus:border-black transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                                style={{ borderColor: theme.colors.muted }}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1" style={{ color: theme.colors.dark }}>Email Address</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email" placeholder="name@example.com" value={email}
                                onChange={(e) => setEmail(e.target.value)} required
                                className="w-full pl-12 pr-4 py-4 border-2 rounded-xl text-sm bg-gray-50/50 outline-none focus:bg-white focus:border-black transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                                style={{ borderColor: theme.colors.muted }}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1" style={{ color: theme.colors.dark }}>Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••" value={password}
                                onChange={(e) => setPassword(e.target.value)} required
                                className="w-full pl-12 pr-12 py-4 border-2 rounded-xl text-sm bg-gray-50/50 outline-none focus:bg-white focus:border-black transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                                style={{ borderColor: theme.colors.muted }}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {password.length > 0 && (
                            <div className="mt-3 px-1">
                                <div className="flex gap-1.5 mb-1.5">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-1 flex-1 rounded-full transition-all duration-500"
                                            style={{ backgroundColor: strength >= i ? strengthColor[strength] : "#e2e8f0" }} />
                                    ))}
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: strengthColor[strength] }}>
                                    Security: {strengthLabel[strength]}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1" style={{ color: theme.colors.dark }}>Confirm Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••" value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} required
                                className="w-full pl-12 pr-12 py-4 border-2 rounded-xl text-sm bg-gray-50/50 outline-none focus:bg-white focus:border-black transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                                style={{ borderColor: theme.colors.muted }}
                            />
                            {confirmPassword.length > 0 && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    {password === confirmPassword
                                        ? <CheckCircle2 size={18} className="text-green-600" />
                                        : <AlertCircle size={18} className="text-red-500" />}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Manual referral code (only if none in URL) */}
                    {!searchParams.get("ref") && (
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1" style={{ color: theme.colors.dark }}>
                                Referral Code{" "}
                                <span className="normal-case font-normal opacity-40">(optional)</span>
                            </label>
                            <div className="relative">
                                <Gift size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text" placeholder="e.g. AB3K7PQ2"
                                    value={referralCode}
                                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                                    maxLength={8}
                                    className="w-full pl-12 pr-4 py-4 border-2 rounded-xl text-sm bg-gray-50/50 outline-none focus:bg-white focus:border-black transition-all placeholder:text-slate-400 text-slate-900 font-mono font-bold tracking-widest uppercase"
                                    style={{ borderColor: theme.colors.muted }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit — sends OTP, advances to step 2 */}
                    <button
                        type="submit"
                        disabled={submitting || googleLoading}
                        className="w-full py-4 mt-4 rounded-xl text-white text-xs font-black uppercase tracking-[0.15em] transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-black/10"
                        style={{ backgroundColor: theme.colors.primary }}
                    >
                        {submitting ? "Sending code…" : "Continue"}
                    </button>
                </form>

                <p className="text-center text-[11px] mt-6 text-slate-500 leading-relaxed px-4">
                    By creating an account, you agree to our{" "}
                    <span className="text-slate-900 font-bold underline cursor-pointer">Terms</span> and{" "}
                    <span className="text-slate-900 font-bold underline cursor-pointer">Privacy Policy</span>.
                </p>

                <p className="text-center text-sm mt-10 text-slate-600 font-medium">
                    Already have an account?{" "}
                    <Link
                        href="/auth/login"
                        className="font-bold border-b-2 border-black pb-0.5 transition-colors"
                        style={{ color: theme.colors.dark, borderColor: theme.colors.primary }}
                    >
                        Sign in
                    </Link>
                </p>
            </div>

            <RewardsModal />
        </div>
    );
}
export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-slate-400 text-sm font-medium">Loading…</div>
            </div>
        }>
            <RegisterPageInner />
        </Suspense>
    );
}