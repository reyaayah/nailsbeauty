"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import theme from "@/theme";
import RewardsModal from "@/components/modals/RewardsModal";

export default function RegisterPage() {
    const { register, loginWithGoogle, authError, clearError } = useAuth();
    const router = useRouter();

    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const passwordStrength = (p: string) => {
        if (p.length === 0) return 0;
        if (p.length < 6) return 1;
        if (p.length < 10 || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) return 2;
        return 3;
    };
    const strength = passwordStrength(password);
    const strengthLabel = ["", "Weak", "Fair", "Strong"];
    const strengthColor = ["", "#ef4444", "#f59e0b", "#22c55e"];

    const handleSubmit = async (e: FormEvent) => {
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

        setSubmitting(true);
        try {
            await register(email, password, displayName);
            router.push("/");
        } catch {
            // error set in context
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogle = async () => {
        clearError();
        setGoogleLoading(true);
        try {
            await loginWithGoogle();
            router.push("/");
        } catch {
            // error set in context
        } finally {
            setGoogleLoading(false);
        }
    };

    const error = localError || authError;

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-20"
            style={{ backgroundColor: theme.colors.light }}
        >
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-serif tracking-tight mb-2 mt-2" style={{ color: theme.colors.dark }}>
                        Create account
                    </h1>
                    <p className="text-sm opacity-60">Join Gloss & Grace and start your beauty journey</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Google Button */}
                <button
                    onClick={handleGoogle}
                    disabled={googleLoading || submitting}
                    className="w-full flex items-center justify-center gap-3 border-2 rounded-full py-3.5 text-sm font-bold tracking-widest uppercase transition-all hover:bg-gray-50 disabled:opacity-50 mb-6"
                    style={{ borderColor: theme.colors.muted, color: theme.colors.dark }}
                >
                    <svg width="18" height="18" viewBox="0 0 18 18">
                        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
                        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
                        <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
                        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
                    </svg>
                    {googleLoading ? "Signing up..." : "Continue with Google"}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs opacity-40 uppercase tracking-widest">or</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
                        <input
                            type="text"
                            placeholder="Full name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            className="w-full pl-11 pr-4 py-3.5 border-2 rounded-xl text-sm bg-white outline-none transition-all text-black"
                            style={{ borderColor: theme.colors.muted }}
                        />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-11 pr-4 py-3.5 border-2 rounded-xl text-sm bg-white outline-none transition-all"
                            style={{ borderColor: theme.colors.muted }}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <div className="relative">
                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-11 pr-12 py-3.5 border-2 rounded-xl text-sm bg-white outline-none transition-all"
                                style={{ borderColor: theme.colors.muted }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {/* Strength bar */}
                        {password.length > 0 && (
                            <div className="mt-2 flex items-center gap-2">
                                <div className="flex gap-1 flex-1">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="h-1 flex-1 rounded-full transition-all duration-300"
                                            style={{
                                                backgroundColor: strength >= i ? strengthColor[strength] : "#e5e7eb",
                                            }}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs font-semibold" style={{ color: strengthColor[strength] }}>
                                    {strengthLabel[strength]}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full pl-11 pr-12 py-3.5 border-2 rounded-xl text-sm bg-white outline-none transition-all"
                            style={{ borderColor: theme.colors.muted }}
                        />
                        {confirmPassword.length > 0 && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                {password === confirmPassword ? (
                                    <CheckCircle2 size={16} className="text-green-500" />
                                ) : (
                                    <AlertCircle size={16} className="text-red-400" />
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || googleLoading}
                        className="w-full py-4 rounded-full text-white text-sm font-black uppercase tracking-widest transition-all disabled:opacity-50 hover:opacity-90 shadow-lg mt-2"
                        style={{ backgroundColor: theme.colors.primary }}
                    >
                        {submitting ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                {/* Terms note */}
                <p className="text-center text-xs mt-4 opacity-40 leading-relaxed">
                    By creating an account, you agree to our{" "}
                    <span className="underline cursor-pointer">Terms of Service</span> and{" "}
                    <span className="underline cursor-pointer">Privacy Policy</span>.
                </p>

                <p className="text-center text-sm mt-6 opacity-60">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="font-bold underline opacity-100" style={{ color: theme.colors.dark }}>
                        Sign in
                    </Link>
                </p>
            </div>

            <RewardsModal />
        </div>
    );
}