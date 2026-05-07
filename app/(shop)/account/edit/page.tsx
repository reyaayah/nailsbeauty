"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, User, Mail, Phone, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";
import theme from "@/theme";
// 1. Import toast and Toaster
import toast, { Toaster } from "react-hot-toast";

export default function EditProfilePage() {
    const { user, userProfile, loading } = useAuth();
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [emailMarketing, setEmailMarketing] = useState(userProfile?.marketingEmail ?? false);
    const [smsMarketing, setSmsMarketing] = useState(userProfile?.marketingSms ?? false);
    const [smsWarning, setSmsWarning] = useState(false);

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/login");
        }
        if (userProfile) {
            const parts = (userProfile.displayName ?? "").split(" ");
            setFirstName(parts[0] ?? "");
            setLastName(parts.slice(1).join(" "));
            setEmail(userProfile.email ?? "");
            setPhone(userProfile.phoneNumber ?? "");
            setEmailMarketing(userProfile.marketingEmail ?? false);
            setSmsMarketing(userProfile.marketingSms ?? false);
        }
    }, [userProfile, user, loading, router]);

    const handleSmsToggle = (val: boolean) => {
        setSmsMarketing(val);
        if (val && phone) {
            setSmsWarning(true);
        } else {
            setSmsWarning(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        // 2. Use toast.promise for a better UX during the async call
        const updatePromise = (async () => {
            const db = getClientDb();
            const ref = doc(db, "users", user.uid);
            await updateDoc(ref, {
                displayName: `${firstName} ${lastName}`.trim(),
                phoneNumber: phone || null,
                marketingEmail: emailMarketing,
                marketingSms: smsMarketing,
                updatedAt: serverTimestamp(),
            });
        })();

        toast.promise(updatePromise, {
            loading: 'Saving changes...',
            success: 'Profile updated successfully!',
            error: 'Failed to save. Please try again.',
        }, {
            // Style the toast to match your theme
            style: {
                borderRadius: '16px',
                background: '#333',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold'
            },
        });

        try {
            await updatePromise;
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading || !userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.light }}>
                <div
                    className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: theme.colors.primary }}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-4" style={{ backgroundColor: theme.colors.light }}>
            {/* 3. Add the Toaster component */}
            <Toaster position="top-center" reverseOrder={false} />

            <div className="max-w-lg mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                        <ChevronLeft size={20} style={{ color: theme.colors.dark }} />
                    </button>
                    <h1 className="text-2xl font-serif font-bold" style={{ color: theme.colors.dark }}>
                        Edit Profile
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Personal info card */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm space-y-5">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Personal Information</h2>

                        <Field label="First name" icon={<User size={16} />}>
                            <input
                                type="text"
                                placeholder="First name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3.5 border-2 rounded-xl text-sm bg-gray-50 outline-none focus:bg-white focus:border-black transition-all placeholder:text-gray-500 text-gray-600 font-bold"
                                style={{ borderColor: theme.colors.muted }}
                            />
                        </Field>

                        <Field label="Last name" icon={<User size={16} />}>
                            <input
                                type="text"
                                placeholder="Last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3.5 border-2 rounded-xl text-sm bg-gray-50 outline-none focus:bg-white focus:border-black transition-all placeholder:text-gray-500 text-gray-600 font-bold"
                                style={{ borderColor: theme.colors.muted }}
                            />
                        </Field>

                        <Field label="Email" icon={<Mail size={16} />}>
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full pl-10 pr-4 py-3.5 border-2 rounded-xl text-sm bg-gray-100 text-gray-600 font-bold cursor-not-allowed"
                                style={{ borderColor: theme.colors.muted }}
                            />
                        </Field>

                        <Field label="Phone" icon={<Phone size={16} />}>
                            <input
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-10 pr-4 py-3.5 border-2 rounded-xl text-sm bg-gray-50 outline-none focus:bg-white focus:border-black transition-all placeholder:text-gray-500 text-gray-600 font-bold"
                                style={{ borderColor: theme.colors.muted }}
                            />
                        </Field>
                    </div>

                    {/* Marketing Communications card */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-5">Marketing Communications</h2>

                        {smsWarning && (
                            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-950 rounded-2xl px-4 py-3 mb-4 text-xs font-bold leading-relaxed">
                                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                                <span>Incomplete text messaging subscription. Reply <strong>YES</strong> to confirm.</span>
                            </div>
                        )}

                        <ToggleRow
                            label="Email"
                            description="Receive promo offers, product launches & beauty tips."
                            checked={emailMarketing}
                            onChange={setEmailMarketing}
                            primaryColor={theme.colors.primary}
                        />

                        <div className="h-px bg-gray-200 my-4" />

                        <ToggleRow
                            label="Text messaging"
                            description="Get order updates and exclusive SMS-only offers."
                            checked={smsMarketing}
                            onChange={handleSmsToggle}
                            primaryColor={theme.colors.primary}
                        />

                        <p className="text-[10px] leading-relaxed text-gray-600 font-medium mt-5">
                            By submitting this form and signing up for texts, you consent to receive marketing text messages (e.g. promos, reminders) from Ersa Nails at the number provided, including messages sent by autodialer. Consent is not a condition of purchase. Msg &amp; data rates may apply. Msg frequency varies. Unsubscribe at any time by replying STOP or clicking the unsubscribe link (where available).
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 rounded-full text-white text-xs font-black uppercase tracking-[0.15em] transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/10"
                        style={{ backgroundColor: theme.colors.primary }}
                    >
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}

/* ── Helpers (Remaining the same) ── */

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-2 ml-1 text-gray-600">
                {label}
            </label>
            <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">{icon}</span>
                {children}
            </div>
        </div>
    );
}

function ToggleRow({ label, description, checked, onChange, primaryColor }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void; primaryColor: string; }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
                <p className="text-sm font-black text-gray-600 mb-0.5">{label}</p>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">{description}</p>
            </div>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className="shrink-0 w-12 h-6 rounded-full transition-all duration-200 relative mt-0.5"
                style={{ backgroundColor: checked ? primaryColor : "#d1d5db" }}
                aria-checked={checked}
                role="switch"
            >
                <span
                    className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                    style={{ transform: checked ? "translateX(24px)" : "translateX(0)" }}
                />
            </button>
        </div>
    );
}