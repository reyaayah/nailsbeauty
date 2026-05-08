// hooks/useAdminPasswordReset.ts
import { useState } from "react";

type Step = "email" | "otp" | "reset" | "done";

export function useAdminPasswordReset() {
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function callApi(body: object) {
        const res = await fetch("/api/admin/password-reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || "Something went wrong");
        return data;
    }

    async function sendOtp(adminEmail: string) {
        setLoading(true);
        setError("");
        try {
            await callApi({ action: "send", email: adminEmail });
            setEmail(adminEmail);
            setStep("otp");
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    async function verifyOtp(otp: string) {
        setLoading(true);
        setError("");
        try {
            await callApi({ action: "verify", email, otp });
            setStep("reset");
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    async function resetPassword(newPassword: string) {
        setLoading(true);
        setError("");
        try {
            await callApi({ action: "reset", email, newPassword });
            setStep("done");
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    function resendOtp() {
        return sendOtp(email);
    }

    return { step, email, loading, error, sendOtp, verifyOtp, resetPassword, resendOtp };
}