// app/admin/forgot-password/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, AlertTriangle, Sparkles, Send } from "lucide-react";
import { useAdminPasswordReset } from "@/hooks/useAdminPasswordReset";
import OtpVerificationPage from "./OtpVerification";
import ResetPasswordPage from "./ResetPassword";


const theme = {
    primary: "#DBA1A2",
    dark: "#422B23",
    light: "#F7F3ED",
    muted: "#C2C6B9",
    pink: "#EF7575",
};

const schema = z.object({
    email: z.string().email("Enter a valid email address"),
});
type FormValues = z.infer<typeof schema>;

function DotGrid() {
    return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none">
            <defs>
                <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill={theme.dark} />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
    );
}

function EmailStep({ onSend }: { onSend: (email: string) => Promise<void> }) {
    const [apiError, setApiError] = useState("");
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async ({ email }: FormValues) => {
        setApiError("");
        try {
            await onSend(email);
        } catch (e: any) {
            setApiError(e.message);
        }
    };

    return (
        <div className="w-full max-w-[380px] z-10">
            <Link
                href="/login"
                className="inline-flex items-center gap-2 mb-10 text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 hover:opacity-70 transition-opacity"
                style={{ color: theme.dark }}
            >
                <ArrowLeft size={12} /> Back to Login
            </Link>

            <div className="mb-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-2" style={{ color: theme.primary }}>
                    Account Recovery
                </p>
                <h3 className="text-3xl leading-tight mb-3" style={{ color: theme.dark, fontFamily: "Georgia, serif" }}>
                    Forgot your<br />password?
                </h3>
                <p className="text-xs leading-relaxed mt-4 opacity-50" style={{ color: theme.dark }}>
                    Enter your admin email and we'll send a verification code to reset your password.
                </p>
                <div className="flex items-center gap-2 mt-5">
                    <div className="h-[2px] w-10" style={{ backgroundColor: theme.primary }} />
                    <div className="h-[2px] w-3 rounded-full opacity-30" style={{ backgroundColor: theme.primary }} />
                </div>
            </div>

            {apiError && (
                <div
                    className="mb-6 flex items-start gap-3 rounded-xl px-4 py-3 text-xs font-semibold border-l-4"
                    style={{ backgroundColor: "white", borderColor: theme.pink, color: theme.pink, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
                >
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    {apiError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: theme.muted }}>
                        Admin Email
                    </label>
                    <div
                        className="flex items-center rounded-2xl px-5 py-4 transition-all duration-200"
                        style={{ backgroundColor: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
                    >
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="admin@nailsa.com"
                            autoComplete="email"
                            className="flex-1 bg-transparent outline-none text-sm font-medium"
                            style={{ color: theme.dark }}
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-2 text-[10px] font-bold" style={{ color: theme.pink }}>{errors.email.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full h-[56px] rounded-2xl overflow-hidden transition-all active:scale-[0.98] disabled:opacity-60"
                    style={{ backgroundColor: theme.dark, boxShadow: `0 8px 30px ${theme.dark}30` }}
                >
                    <div className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 ease-out" style={{ backgroundColor: theme.primary }} />
                    <span className="relative z-10 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-white">
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Sending Code…
                            </span>
                        ) : (
                            <>
                                Send Verification Code
                                <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </span>
                </button>
            </form>
        </div>
    );
}

function DoneStep() {
    return (
        <div className="w-full max-w-[380px] z-10 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: theme.primary }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </div>
            <h3 className="text-2xl mb-3" style={{ color: theme.dark, fontFamily: "Georgia, serif" }}>Password Reset!</h3>
            <p className="text-xs opacity-50 mb-8" style={{ color: theme.dark }}>Your admin password has been updated successfully.</p>
            <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full text-white transition-all"
                style={{ backgroundColor: theme.dark }}
            >
                <ArrowLeft size={13} /> Back to Login
            </Link>
        </div>
    );
}

export default function ForgotPasswordPage() {
    const { step, email, loading, error, sendOtp, verifyOtp, resetPassword, resendOtp } = useAdminPasswordReset();

    return (
        <div className="min-h-screen flex items-stretch" style={{ backgroundColor: theme.light }}>
            {/* Left panel */}
            <div
                className="hidden lg:flex flex-col justify-between w-[42%] p-16 relative overflow-hidden"
                style={{ backgroundColor: theme.dark }}
            >
                <div
                    className="absolute inset-0 opacity-25 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1588359953494-0c215e3cedc6?q=80&w=688&auto=format&fit=crop')" }}
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${theme.dark}F5 0%, ${theme.dark}88 55%, ${theme.dark}F5 100%)` }} />
                <div className="absolute right-0 top-0 bottom-0 w-[3px]" style={{ background: `linear-gradient(to bottom, transparent, ${theme.primary}, transparent)` }} />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                        <Sparkles className="text-white" size={16} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-[0.35em] text-white" style={{ fontFamily: "serif" }}>Nailsa</span>
                </div>

                <div className="relative z-10">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] border" style={{ borderColor: `${theme.primary}55`, color: theme.primary }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                        Account Recovery
                    </div>
                    <h2 className="text-[2.8rem] leading-[1.1] mb-6" style={{ color: theme.light, fontFamily: "Georgia, serif" }}>
                        Secure.<br /><span style={{ color: theme.primary }}>Always.</span>
                    </h2>
                    <p className="text-sm font-light max-w-[260px] leading-relaxed opacity-60" style={{ color: "#EFD8D6" }}>
                        Multi-step verification ensures only authorized admins regain access.
                    </p>
                </div>

                <div className="relative z-10 text-[9px] uppercase tracking-[0.5em] font-bold opacity-30" style={{ color: "#EFD8D6" }}>
                    Est. 2026 · Admin Control
                </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-20 relative overflow-hidden">
                <DotGrid />
                <div
                    className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${theme.primary}18 0%, transparent 70%)`, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                />

                {step === "email" && <EmailStep onSend={sendOtp} />}
                {step === "otp" && (
                    <OtpVerificationPage
                        email={email}
                        loading={loading}
                        error={error}
                        onVerify={verifyOtp}
                        onResend={resendOtp}
                    />
                )}
                {step === "reset" && (
                    <ResetPasswordPage
                        loading={loading}
                        error={error}
                        onReset={resetPassword}
                    />
                )}
                {step === "done" && <DoneStep />}
            </div>
        </div>
    );
}