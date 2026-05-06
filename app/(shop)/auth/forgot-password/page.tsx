"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Mail, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import theme from "@/theme";

export default function ForgotPasswordPage() {
    const { forgotPassword, authError, clearError } = useAuth();
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearError();
        setSubmitting(true);
        try {
            await forgotPassword(email);
            setSent(true);
        } catch {
            // error handled in context
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-20"
            style={{ backgroundColor: theme.colors.light }}
        >
            <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2rem] shadow-xl shadow-black/5">

                {/* Back Navigation */}
                <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] mb-10 transition-colors group"
                    style={{ color: theme.colors.dark }}
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to login
                </Link>

                {sent ? (
                    /* ── Success State ── */
                    <div className="text-center animate-in fade-in zoom-in duration-300">
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
                            style={{ backgroundColor: theme.colors.primary + "15" }}
                        >
                            <CheckCircle2 size={40} style={{ color: theme.colors.primary }} />
                        </div>
                        <h1 className="text-3xl font-serif mb-4" style={{ color: theme.colors.dark }}>
                            Check your inbox
                        </h1>
                        <p className="text-sm text-slate-600 leading-relaxed mb-10 font-medium">
                            We&apos;ve sent a password reset link to{" "}
                            <span className="font-bold text-slate-900 border-b border-slate-200">{email}</span>.
                            Please check your spam folder if it doesn&apos;t arrive soon.
                        </p>
                        <button
                            onClick={() => { setSent(false); setEmail(""); }}
                            className="text-xs font-black uppercase tracking-widest border-b-2 pb-1 transition-all hover:opacity-70"
                            style={{ color: theme.colors.dark, borderColor: theme.colors.primary }}
                        >
                            Send again
                        </button>
                    </div>
                ) : (
                    /* ── Form State ── */
                    <>
                        <div className="mb-10">
                            <h1 className="text-4xl font-serif tracking-tight mb-3" style={{ color: theme.colors.dark }}>
                                Forgot password?
                            </h1>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                Enter your email below and we&apos;ll send you instructions to reset your password.
                            </p>
                        </div>

                        {authError && (
                            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 mb-8 text-sm font-medium">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                <span>{authError}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1" style={{ color: theme.colors.dark }}>
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        placeholder="yourname@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-4 border-2 rounded-xl text-sm bg-gray-50 outline-none focus:bg-white focus:border-black transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                                        style={{ borderColor: theme.colors.muted }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 rounded-xl text-white text-xs font-black uppercase tracking-[0.15em] transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/10"
                                style={{ backgroundColor: theme.colors.primary }}
                            >
                                {submitting ? "Sending..." : "Send Reset Link"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
