"use client";

/**
 * components/auth/OtpVerificationStep.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Inline OTP entry step rendered inside the register page.
 *
 * Features:
 *  • 6 individual digit boxes — auto-advance, backspace-aware, paste-aware
 *  • Countdown timer (10 min) with resend button
 *  • Shake animation on wrong code
 *  • Calls /api/auth/send-otp  (on mount + resend)
 *  • Calls /api/auth/verify-otp (on submit)
 *  • onVerified() callback fires only on success — parent proceeds to register()
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
    useRef, useState, useEffect, useCallback, KeyboardEvent, ClipboardEvent,
} from "react";
import { Mail, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import theme from "@/theme";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface OtpVerificationStepProps {
    email: string;
    onVerified: () => void;    // called once OTP is confirmed — triggers register()
    onBack: () => void;        // user wants to edit their form
}

const OTP_LENGTH = 6;
const RESEND_WAIT = 60; // seconds before resend is re-enabled

/* ─── Tiny CSS-in-JS shake ───────────────────────────────────────────────── */
const shakeKeyframes = `
@keyframes otpShake {
  0%,100% { transform: translateX(0); }
  20%      { transform: translateX(-8px); }
  40%      { transform: translateX(8px); }
  60%      { transform: translateX(-5px); }
  80%      { transform: translateX(5px); }
}
.otp-shake { animation: otpShake 0.45s ease; }
`;

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function OtpVerificationStep({
    email,
    onVerified,
    onBack,
}: OtpVerificationStepProps) {
    const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [error, setError] = useState<string | null>(null);
    const [verifying, setVerifying] = useState(false);
    const [sending, setSending] = useState(false);
    const [shake, setShake] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(RESEND_WAIT);
    const [expirySeconds, setExpirySeconds] = useState(600); // 10 min
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const hasSentRef = useRef(false);   // guard against Strict Mode double-invoke

    /* ── Send OTP on mount ────────────────────────────────────────────── */
    const sendOtp = useCallback(async () => {
        setSending(true);
        setError(null);
        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error ?? "Failed to send code."); return; }
            setExpirySeconds(data.expiresIn ?? 600);
            setResendCooldown(RESEND_WAIT);
        } catch {
            setError("Network error. Please check your connection.");
        } finally {
            setSending(false);
        }
    }, [email]);

    useEffect(() => {
        if (hasSentRef.current) return;
        hasSentRef.current = true;
        sendOtp();
    }, [sendOtp]);

    /* ── Resend cooldown ticker ───────────────────────────────────────── */
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const t = setTimeout(() => setResendCooldown((c) => c - 1), 1_000);
        return () => clearTimeout(t);
    }, [resendCooldown]);

    /* ── Expiry countdown ────────────────────────────────────────────── */
    useEffect(() => {
        if (expirySeconds <= 0) return;
        const t = setTimeout(() => setExpirySeconds((s) => s - 1), 1_000);
        return () => clearTimeout(t);
    }, [expirySeconds]);

    const fmtTime = (s: number) =>
        `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    /* ── Digit helpers ────────────────────────────────────────────────── */
    const focusNext = (idx: number) => inputRefs.current[idx + 1]?.focus();
    const focusPrev = (idx: number) => inputRefs.current[idx - 1]?.focus();

    const handleChange = (idx: number, val: string) => {
        const char = val.replace(/\D/, "").slice(-1);
        const next = [...digits];
        next[idx] = char;
        setDigits(next);
        setError(null);
        if (char) focusNext(idx);
    };

    const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (digits[idx]) {
                const next = [...digits]; next[idx] = ""; setDigits(next);
            } else {
                focusPrev(idx);
            }
        } else if (e.key === "ArrowLeft") focusPrev(idx);
        else if (e.key === "ArrowRight") focusNext(idx);
        else if (e.key === "Enter" && digits.every(Boolean)) handleVerify();
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;
        const next = Array(OTP_LENGTH).fill("");
        pasted.split("").forEach((c, i) => { next[i] = c; });
        setDigits(next);
        inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
        setError(null);
    };

    /* ── Verify ───────────────────────────────────────────────────────── */
    const handleVerify = async () => {
        const otp = digits.join("");
        if (otp.length < OTP_LENGTH) { setError("Please enter all 6 digits."); return; }

        setVerifying(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error ?? "Incorrect code.");
                setShake(true);
                setDigits(Array(OTP_LENGTH).fill(""));
                setTimeout(() => {
                    setShake(false);
                    inputRefs.current[0]?.focus();
                }, 500);
                return;
            }
            // ── OTP verified — bubble up to parent ─────────────────────
            onVerified();
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setVerifying(false);
        }
    };

    const isExpired = expirySeconds <= 0;
    const allFilled = digits.every(Boolean);

    return (
        <>
            {/* Inject shake keyframes once */}
            <style>{shakeKeyframes}</style>

            <div className="w-full max-w-md mx-auto">

                {/* Icon + heading */}
                <div className="text-center mb-8">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
                        style={{ backgroundColor: theme.colors.primary + "18" }}
                    >
                        <Mail size={28} style={{ color: theme.colors.primary }} />
                    </div>
                    <h2 className="text-3xl font-serif font-bold mb-2" style={{ color: theme.colors.dark }}>
                        Check your email
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        We sent a 6-digit code to
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{email}</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
                        <AlertCircle size={15} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Expiry warning */}
                {isExpired && (
                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
                        <AlertCircle size={15} className="mt-0.5 shrink-0" />
                        <span>Your code has expired. Please request a new one.</span>
                    </div>
                )}

                {/* ── OTP boxes ────────────────────────────────────────────── */}
                <div
                    className={`flex gap-2.5 justify-center mb-2 ${shake ? "otp-shake" : ""}`}
                    aria-label="One-time password input"
                >
                    {digits.map((d, i) => (
                        <input
                            key={i}
                            ref={(el) => { inputRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            pattern="\d*"
                            maxLength={1}
                            value={d}
                            disabled={verifying || isExpired}
                            autoFocus={i === 0}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            onPaste={handlePaste}
                            onFocus={(e) => e.target.select()}
                            className="
                                w-12 h-14 text-center text-2xl font-black border-2 rounded-xl
                                outline-none transition-all duration-150 font-mono
                                focus:scale-105 disabled:opacity-40 disabled:cursor-not-allowed
                            "
                            style={{
                                borderColor: error
                                    ? "#ef4444"
                                    : d
                                        ? theme.colors.primary
                                        : theme.colors.muted,
                                color: theme.colors.dark,
                                backgroundColor: d ? theme.colors.primary + "0D" : "#f9fafb",
                            }}
                            aria-label={`Digit ${i + 1}`}
                        />
                    ))}
                </div>

                {/* Expiry timer */}
                {!isExpired && (
                    <p className="text-center text-xs text-slate-400 font-medium mb-6">
                        Code expires in{" "}
                        <span
                            className="font-bold"
                            style={{ color: expirySeconds < 60 ? "#ef4444" : theme.colors.primary }}
                        >
                            {fmtTime(expirySeconds)}
                        </span>
                    </p>
                )}

                {/* Verify button */}
                <button
                    onClick={handleVerify}
                    disabled={!allFilled || verifying || isExpired}
                    className="
                        w-full py-4 rounded-xl text-white text-xs font-black uppercase
                        tracking-[0.15em] transition-all shadow-xl shadow-black/10
                        disabled:opacity-40 hover:scale-[1.01] active:scale-[0.99]
                        flex items-center justify-center gap-2 mb-4
                    "
                    style={{ backgroundColor: theme.colors.primary }}
                >
                    {verifying ? (
                        <>
                            <Loader2 size={15} className="animate-spin" />
                            Verifying…
                        </>
                    ) : (
                        <>
                            <CheckCircle2 size={15} />
                            Verify &amp; Create Account
                        </>
                    )}
                </button>

                {/* Resend + back */}
                <div className="flex items-center justify-between mt-2">
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-xs text-slate-500 font-semibold hover:text-slate-800 transition-colors underline underline-offset-2"
                    >
                        ← Edit details
                    </button>

                    <button
                        type="button"
                        onClick={sendOtp}
                        disabled={resendCooldown > 0 || sending}
                        className="flex items-center gap-1.5 text-xs font-bold transition-all disabled:opacity-40"
                        style={{ color: theme.colors.primary }}
                    >
                        <RefreshCw size={12} className={sending ? "animate-spin" : ""} />
                        {resendCooldown > 0
                            ? `Resend in ${resendCooldown}s`
                            : sending
                                ? "Sending…"
                                : "Resend code"}
                    </button>
                </div>

                {/* Spam tip */}
                <p className="text-center text-[11px] text-slate-400 mt-8 leading-relaxed px-2">
                    Didn&apos;t receive an email? Check your spam folder or click resend above.
                </p>
            </div>
        </>
    );
}