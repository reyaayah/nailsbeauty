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
            <div className="w-full max-w-md">

                {/* Back */}
                <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 mb-10 transition-opacity"
                >
                    <ArrowLeft size={14} /> Back to login
                </Link>

                {sent ? (
                    /* ── Success state ── */
                    <div className="text-center">
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                            style={{ backgroundColor: theme.colors.primary + "20" }}
                        >
                            <CheckCircle2 size={32} style={{ color: theme.colors.primary }} />
                        </div>
                        <h1 className="text-3xl font-serif mb-3" style={{ color: theme.colors.dark }}>
                            Check your inbox
                        </h1>
                        <p className="text-sm opacity-60 leading-relaxed mb-8">
                            We&apos;ve sent a password reset link to{" "}
                            <span className="font-bold opacity-100">{email}</span>. Check your spam
                            folder if you don&apos;t see it.
                        </p>
                        <button
                            onClick={() => { setSent(false); setEmail(""); }}
                            className="text-xs font-bold underline opacity-60 hover:opacity-100"
                        >
                            Send again
                        </button>
                    </div>
                ) : (
                    /* ── Form state ── */
                    <>
                        <div className="mb-10">
                            <h1 className="text-4xl font-serif tracking-tight mb-2" style={{ color: theme.colors.dark }}>
                                Forgot password?
                            </h1>
                            <p className="text-sm opacity-60">
                                Enter your email and we&apos;ll send you a reset link.
                            </p>
                        </div>

                        {authError && (
                            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                <span>{authError}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
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

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 rounded-full text-white text-sm font-black uppercase tracking-widest transition-all disabled:opacity-50 hover:opacity-90 shadow-lg"
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
