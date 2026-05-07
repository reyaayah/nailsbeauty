"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import theme from "@/theme";

export default function LoginPage() {
    const { user, login, loginWithGoogle, authError, clearError } = useAuth();
    const router = useRouter();


    // Redirect as soon as auth state confirms a logged-in user —
    // catches both email/password and Google popup flows.
    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user, router]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearError();
        setSubmitting(true);
        try {
            await login(email, password);
            // useEffect will redirect once user state updates
        } catch {
            // error is set in context
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogle = async () => {
        clearError();
        setGoogleLoading(true);
        try {
            await loginWithGoogle();
            // useEffect will redirect once user state updates
        } catch {
            setGoogleLoading(false);
        }
    };
    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-24"
            style={{ backgroundColor: theme.colors.light }}
        >
            <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2rem] pt-10 shadow-xl shadow-black/5">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1
                        className="text-4xl font-serif tracking-tight mb-3"
                        style={{ color: theme.colors.dark }}
                    >
                        Welcome back
                    </h1>
                    {/* Changed from opacity-60 to text-slate-600 for better readability */}
                    <p className="text-sm font-medium text-slate-600">
                        Sign in to your Nailsa account
                    </p>
                </div>

                {/* Error Banner */}
                {authError && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <span>{authError}</span>
                    </div>
                )}

                {/* Google Button */}
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
                    {googleLoading ? "Signing in..." : "Continue with Google"}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Or use email</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1" style={{ color: theme.colors.dark }}>
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-4 border-2 rounded-xl text-sm bg-gray-50 outline-none focus:bg-white focus:border-black transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                                style={{ borderColor: theme.colors.muted }}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex justify-between items-end mb-2 ml-1">
                            <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: theme.colors.dark }}>
                                Password
                            </label>
                            <Link
                                href="/auth/forgot-password"
                                className="text-xs font-bold text-slate-900 hover:underline"
                            >
                                Forgot?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-12 pr-12 py-4 border-2 rounded-xl text-sm bg-gray-50 outline-none focus:bg-white focus:border-black transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                                style={{ borderColor: theme.colors.muted }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || googleLoading}
                        className="w-full py-4 mt-4 rounded-xl text-white text-xs font-black uppercase tracking-[0.15em] transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/10"
                        style={{ backgroundColor: theme.colors.primary }}
                    >
                        {submitting ? "Processing..." : "Sign In to Account"}
                    </button>
                </form>

                {/* Register link */}
                <p className="text-center text-sm mt-10 text-slate-600 font-medium">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/register" className="font-bold border-b-2 border-black pb-0.5 transition-colors" style={{ color: theme.colors.dark, borderColor: theme.colors.primary }}>
                        Create one for free
                    </Link>
                </p>

            </div>
        </div>
    );
}