// app/admin/forgot-password/OtpVerification.tsx
"use client";
import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

const theme = {
    primary: "#DBA1A2",
    dark: "#422B23",
    light: "#F7F3ED",
    muted: "#C2C6B9",
    pink: "#EF7575",
};

const OTP_LENGTH = 6;

interface Props {
    email: string;
    loading: boolean;
    error: string;
    onVerify: (otp: string) => Promise<void>;
    onResend: () => Promise<void>;
}

export default function OtpVerificationPage({ email, loading, error, onVerify, onResend }: Props) {
    const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [resendCooldown, setResendCooldown] = useState(60);
    const [resending, setResending] = useState(false);
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown timer
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [resendCooldown]);

    function focusNext(index: number) {
        inputs.current[Math.min(index + 1, OTP_LENGTH - 1)]?.focus();
    }
    function focusPrev(index: number) {
        inputs.current[Math.max(index - 1, 0)]?.focus();
    }

    function handleChange(index: number, value: string) {
        const char = value.replace(/\D/g, "").slice(-1);
        const next = [...digits];
        next[index] = char;
        setDigits(next);
        if (char) focusNext(index);
    }

    function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Backspace") {
            if (digits[index]) {
                const next = [...digits];
                next[index] = "";
                setDigits(next);
            } else {
                focusPrev(index);
            }
        } else if (e.key === "ArrowLeft") {
            focusPrev(index);
        } else if (e.key === "ArrowRight") {
            focusNext(index);
        }
    }

    function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        const next = Array(OTP_LENGTH).fill("");
        pasted.split("").forEach((c, i) => { next[i] = c; });
        setDigits(next);
        inputs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    }

    async function handleSubmit() {
        const otp = digits.join("");
        if (otp.length < OTP_LENGTH) return;
        await onVerify(otp);
    }

    async function handleResend() {
        setResending(true);
        setDigits(Array(OTP_LENGTH).fill(""));
        await onResend();
        setResendCooldown(60);
        setResending(false);
        inputs.current[0]?.focus();
    }

    const filled = digits.filter(Boolean).length;
    const complete = filled === OTP_LENGTH;

    return (
        <div className="w-full max-w-[380px] z-10">
            <div className="mb-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-2" style={{ color: theme.primary }}>
                    Step 2 of 3
                </p>
                <h3 className="text-3xl leading-tight mb-3" style={{ color: theme.dark, fontFamily: "Georgia, serif" }}>
                    Check your<br />inbox
                </h3>
                <p className="text-xs leading-relaxed mt-4 opacity-50" style={{ color: theme.dark }}>
                    We sent a 6-digit code to{" "}
                    <span className="font-bold opacity-80" style={{ color: theme.dark }}>{email}</span>
                </p>
                <div className="flex items-center gap-2 mt-5">
                    <div className="h-[2px] w-10" style={{ backgroundColor: theme.primary }} />
                    <div className="h-[2px] w-3 rounded-full opacity-30" style={{ backgroundColor: theme.primary }} />
                </div>
            </div>

            {error && (
                <div
                    className="mb-6 flex items-start gap-3 rounded-xl px-4 py-3 text-xs font-semibold border-l-4"
                    style={{ backgroundColor: "white", borderColor: theme.pink, color: theme.pink, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
                >
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    {error}
                </div>
            )}

            {/* OTP inputs */}
            <div className="flex gap-3 mb-8">
                {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                    <input
                        key={i}
                        ref={(el) => { inputs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digits[i]}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={handlePaste}
                        className="flex-1 h-14 w-14 rounded-xl text-center text-xl font-bold outline-none transition-all duration-200 border-2"
                        style={{
                            backgroundColor: digits[i] ? theme.dark : "white",
                            color: digits[i] ? theme.primary : theme.dark,
                            borderColor: digits[i] ? theme.dark : "#e5e7eb",
                            boxShadow: digits[i] ? `0 4px 16px ${theme.dark}25` : "0 2px 8px rgba(0,0,0,0.04)",
                            fontFamily: "Georgia, serif",
                        }}
                    />
                ))}
            </div>

            {/* Progress bar */}
            <div className="h-[3px] rounded-full mb-8 overflow-hidden" style={{ backgroundColor: "#e5e7eb" }}>
                <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${(filled / OTP_LENGTH) * 100}%`, backgroundColor: theme.primary }}
                />
            </div>

            {/* Verify button */}
            <button
                onClick={handleSubmit}
                disabled={!complete || loading}
                className="group relative w-full h-[56px] rounded-2xl overflow-hidden transition-all active:scale-[0.98] disabled:opacity-40"
                style={{ backgroundColor: theme.dark, boxShadow: `0 8px 30px ${theme.dark}30` }}
            >
                <div className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 ease-out" style={{ backgroundColor: theme.primary }} />
                <span className="relative z-10 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-white">
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Verifying…
                        </span>
                    ) : "Verify Code"}
                </span>
            </button>

            {/* Resend */}
            <div className="mt-6 text-center">
                {resendCooldown > 0 ? (
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-30" style={{ color: theme.dark }}>
                        Resend in {resendCooldown}s
                    </p>
                ) : (
                    <button
                        onClick={handleResend}
                        disabled={resending}
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold opacity-40 hover:opacity-70 transition-opacity"
                        style={{ color: theme.dark }}
                    >
                        <RotateCcw size={11} className={resending ? "animate-spin" : ""} />
                        {resending ? "Sending…" : "Resend Code"}
                    </button>
                )}
            </div>
        </div>
    );
}