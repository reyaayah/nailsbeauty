// app/checkout/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingBag, ChevronLeft, Check, Loader2, MapPin, CreditCard, Package, Tag, Gift, FileText } from "lucide-react";
import theme from "@/theme";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { placeOrder, ShippingAddress } from "@/lib/orderService";

const DUMMY_PAYMENT_METHODS = [
    { id: "card_ending_4242", label: "Visa ending in 4242", icon: "💳" },
    { id: "card_ending_5555", label: "Mastercard ending in 5555", icon: "💳" },
    { id: "paypal", label: "PayPal (dummy@example.com)", icon: "🅿️" },
];

const EMPTY_ADDRESS: ShippingAddress = {
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
};

type Step = "shipping" | "payment" | "review" | "success";

export default function CheckoutPage() {
    const router = useRouter();
    const {
        items,
        subtotal,
        discount,
        discountAmount,
        discountedSubtotal,
        orderNote,
        isGift,
        giftNote,
        clearCart,
    } = useCart();
    const { user } = useAuth();

    const [step, setStep] = useState<Step>("shipping");
    const [address, setAddress] = useState<ShippingAddress>(EMPTY_ADDRESS);
    const [paymentMethod, setPaymentMethod] = useState(DUMMY_PAYMENT_METHODS[0].id);
    const [placing, setPlacing] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

    const shippingCost = discountedSubtotal >= 70 ? 0 : 9.99;
    const total = discountedSubtotal + shippingCost;

    if (items.length === 0 && step !== "success") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6"
                style={{ backgroundColor: theme.colors.light }}>
                <ShoppingBag size={48} strokeWidth={1} style={{ color: theme.colors.muted }} />
                <h2 className="text-2xl font-serif italic" style={{ color: theme.colors.dark }}>
                    Your bag is empty
                </h2>
                <button
                    onClick={() => router.push("/collections")}
                    className="px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase"
                    style={{ backgroundColor: theme.colors.dark, color: theme.colors.light }}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    function validateAddress(): boolean {
        const e: Partial<ShippingAddress> = {};
        if (!address.fullName.trim()) e.fullName = "Required";
        if (!address.line1?.trim()) e.line1 = "Required";
        if (!address.city?.trim()) e.city = "Required";
        if (!address.state?.trim()) e.state = "Required";
        if (!address.zip?.trim()) e.zip = "Required";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handlePlaceOrder() {
        if (!user) {
            router.push("/auth/login?redirect=/checkout");
            return;
        }
        setPlacing(true);
        try {
            const id = await placeOrder(
                user.uid,
                items,
                subtotal,
                address,
                paymentMethod,
                // ── NEW: pass discount, notes and gift fields ──
                {
                    discount,
                    discountAmount,
                    orderNote: orderNote || undefined,
                    isGift,
                    giftNote: giftNote || undefined,
                }
            );
            setOrderId(id);
            await clearCart();
            setStep("success");
        } catch (err) {
            console.error("Order placement failed:", err);
            alert("Something went wrong placing your order. Please try again.");
        } finally {
            setPlacing(false);
        }
    }

    const STEPS: { key: Step; label: string }[] = [
        { key: "shipping", label: "Shipping" },
        { key: "payment", label: "Payment" },
        { key: "review", label: "Review" },
    ];

    const stepIndex = STEPS.findIndex((s) => s.key === step);

    return (
        <div className="min-h-screen" style={{ backgroundColor: theme.colors.light }}>
            <div className="h-1.5 w-full" style={{ backgroundColor: theme.colors.primary }} />

            <header className="flex items-center justify-between px-6 md:px-16 py-6 border-b border-black/5">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                    style={{ color: theme.colors.dark }}
                >
                    <ChevronLeft size={14} /> Back
                </button>
                <h1 className="text-xl font-serif italic" style={{ color: theme.colors.dark }}>
                    Checkout
                </h1>
                <div className="w-16" />
            </header>

            {step === "success" ? (
                <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg"
                        style={{ backgroundColor: theme.colors.primary }}
                    >
                        <Check size={36} color="white" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-serif italic mb-3" style={{ color: theme.colors.dark }}>
                        Order Placed!
                    </h2>
                    <p className="text-sm opacity-60 mb-2" style={{ color: theme.colors.dark }}>
                        Thank you for your purchase.
                    </p>
                    <p
                        className="text-xs font-bold tracking-widest uppercase mb-8 px-4 py-2 rounded-full"
                        style={{ backgroundColor: `${theme.colors.primary}15`, color: theme.colors.primary }}
                    >
                        Order ID: {orderId}
                    </p>
                    <div className="flex gap-4 flex-wrap justify-center">
                        <button
                            onClick={() => router.push("/account/orders")}
                            className="px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase border"
                            style={{ borderColor: theme.colors.dark, color: theme.colors.dark }}
                        >
                            View Orders
                        </button>
                        <button
                            onClick={() => router.push("/collections")}
                            className="px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase"
                            style={{ backgroundColor: theme.colors.dark, color: theme.colors.light }}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            ) : (
                <div className="max-w-6xl mx-auto px-6 md:px-16 py-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
                    <div>
                        {/* Step indicator */}
                        <div className="flex items-center gap-0 mb-10">
                            {STEPS.map((s, i) => (
                                <div key={s.key} className="flex items-center">
                                    <button
                                        onClick={() => i < stepIndex && setStep(s.key)}
                                        className="flex items-center gap-2"
                                        disabled={i >= stepIndex}
                                    >
                                        <div
                                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors"
                                            style={{
                                                backgroundColor: i <= stepIndex ? theme.colors.primary : `${theme.colors.dark}15`,
                                                color: i <= stepIndex ? "white" : theme.colors.muted,
                                            }}
                                        >
                                            {i < stepIndex ? <Check size={12} /> : i + 1}
                                        </div>
                                        <span
                                            className="text-[10px] font-bold uppercase tracking-widest hidden sm:block"
                                            style={{ color: i <= stepIndex ? theme.colors.dark : theme.colors.muted }}
                                        >
                                            {s.label}
                                        </span>
                                    </button>
                                    {i < STEPS.length - 1 && (
                                        <div
                                            className="w-8 h-px mx-3"
                                            style={{
                                                backgroundColor: i < stepIndex ? theme.colors.primary : `${theme.colors.dark}20`,
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Shipping step */}
                        {step === "shipping" && (
                            <div className="space-y-5">
                                <SectionHeader icon={<MapPin size={16} />} title="Shipping Address" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Full Name" value={address.fullName} error={errors.fullName}
                                        onChange={(v) => setAddress({ ...address, fullName: v })} colSpan="sm:col-span-2" />
                                    <Field label="Address Line 1" value={address.line1 ?? ""} error={errors.line1}
                                        onChange={(v) => setAddress({ ...address, line1: v })} colSpan="sm:col-span-2" />
                                    <Field label="Address Line 2 (optional)" value={address.line2 ?? ""}
                                        onChange={(v) => setAddress({ ...address, line2: v })} colSpan="sm:col-span-2" />
                                    <Field label="City" value={address.city} error={errors.city}
                                        onChange={(v) => setAddress({ ...address, city: v })} />
                                    <Field label="State / Province" value={address.state} error={errors.state}
                                        onChange={(v) => setAddress({ ...address, state: v })} />
                                    <Field label="ZIP / Postal Code" value={address.zip} error={errors.zip}
                                        onChange={(v) => setAddress({ ...address, zip: v })} />
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60"
                                            style={{ color: theme.colors.dark }}>Country</label>
                                        <select
                                            value={address.country}
                                            onChange={(e) => setAddress({ ...address, country: e.target.value })}
                                            className="border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 appearance-none"
                                            style={{ borderColor: `${theme.colors.dark}20`, color: theme.colors.dark, backgroundColor: theme.colors.light }}
                                        >
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="GB">United Kingdom</option>
                                            <option value="AU">Australia</option>
                                            <option value="NP">Nepal</option>
                                            <option value="IN">India</option>
                                        </select>
                                    </div>
                                </div>
                                <PrimaryButton label="Continue to Payment" onClick={() => { if (validateAddress()) setStep("payment"); }} />
                            </div>
                        )}

                        {/* Payment step */}
                        {step === "payment" && (
                            <div className="space-y-5">
                                <SectionHeader icon={<CreditCard size={16} />} title="Payment Method" />
                                <p className="text-xs opacity-50" style={{ color: theme.colors.dark }}>
                                    This is a demo — no real charges will be made.
                                </p>
                                <div className="space-y-3">
                                    {DUMMY_PAYMENT_METHODS.map((pm) => (
                                        <label
                                            key={pm.id}
                                            className="flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all"
                                            style={{
                                                borderColor: paymentMethod === pm.id ? theme.colors.primary : `${theme.colors.dark}15`,
                                                backgroundColor: paymentMethod === pm.id ? `${theme.colors.primary}0D` : "transparent",
                                            }}
                                        >
                                            <input type="radio" name="payment" value={pm.id}
                                                checked={paymentMethod === pm.id}
                                                onChange={() => setPaymentMethod(pm.id)}
                                                style={{ accentColor: theme.colors.primary }} />
                                            <span className="text-lg">{pm.icon}</span>
                                            <span className="text-sm font-medium" style={{ color: theme.colors.dark }}>{pm.label}</span>
                                        </label>
                                    ))}
                                </div>
                                <PrimaryButton label="Review Order" onClick={() => setStep("review")} />
                            </div>
                        )}

                        {/* Review step */}
                        {step === "review" && (
                            <div className="space-y-6">
                                <SectionHeader icon={<Package size={16} />} title="Review Your Order" />

                                <ReviewCard title="Shipping To">
                                    <p className="text-sm" style={{ color: theme.colors.dark }}>{address.fullName}</p>
                                    <p className="text-sm opacity-60" style={{ color: theme.colors.dark }}>
                                        {address.line1}{address.line2 ? `, ${address.line2}` : ""}
                                    </p>
                                    <p className="text-sm opacity-60" style={{ color: theme.colors.dark }}>
                                        {address.city}, {address.state} {address.zip}, {address.country}
                                    </p>
                                    <button onClick={() => setStep("shipping")}
                                        className="text-[10px] font-bold uppercase tracking-widest mt-2 underline underline-offset-2"
                                        style={{ color: theme.colors.primary }}>Edit</button>
                                </ReviewCard>

                                <ReviewCard title="Payment">
                                    <p className="text-sm" style={{ color: theme.colors.dark }}>
                                        {DUMMY_PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label}
                                    </p>
                                    <button onClick={() => setStep("payment")}
                                        className="text-[10px] font-bold uppercase tracking-widest mt-2 underline underline-offset-2"
                                        style={{ color: theme.colors.primary }}>Edit</button>
                                </ReviewCard>

                                <ReviewCard title="Items">
                                    <div className="space-y-3">
                                        {items.map(({ product, quantity, size, shape }) => (
                                            <div key={`${product.id}-${size}-${shape}`} className="flex gap-3 items-center">
                                                <div className="relative w-12 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[#F2ECE4]">
                                                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-serif truncate" style={{ color: theme.colors.dark }}>{product.name}</p>
                                                    <p className="text-[10px] opacity-50 mt-0.5" style={{ color: theme.colors.dark }}>
                                                        {[size && `Size: ${size}`, shape && `Shape: ${shape}`, `Qty: ${quantity}`].filter(Boolean).join(" · ")}
                                                    </p>
                                                </div>
                                                <span className="text-sm font-semibold flex-shrink-0" style={{ color: theme.colors.dark }}>
                                                    £{(product.price * quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </ReviewCard>

                                {/* ── Order note summary (read-only) ── */}
                                {orderNote && (
                                    <ReviewCard title="Order Note">
                                        <div className="flex items-start gap-2">
                                            <FileText size={13} className="mt-0.5 flex-shrink-0" style={{ color: theme.colors.muted }} />
                                            <p className="text-sm opacity-70 whitespace-pre-wrap" style={{ color: theme.colors.dark }}>
                                                {orderNote}
                                            </p>
                                        </div>
                                    </ReviewCard>
                                )}

                                {/* ── Gift summary (read-only) ── */}
                                {isGift && (
                                    <ReviewCard title="Gift Order">
                                        <div className="flex items-start gap-2">
                                            <Gift size={13} className="mt-0.5 flex-shrink-0" style={{ color: theme.colors.primary }} />
                                            <div>
                                                <p className="text-sm font-medium" style={{ color: theme.colors.dark }}>
                                                    This order is marked as a gift
                                                </p>
                                                {giftNote && (
                                                    <p className="text-sm opacity-60 mt-1 whitespace-pre-wrap" style={{ color: theme.colors.dark }}>
                                                        "{giftNote}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </ReviewCard>
                                )}

                                <PrimaryButton
                                    label={placing ? "Placing Order…" : `Place Order — £${total.toFixed(2)}`}
                                    onClick={handlePlaceOrder}
                                    disabled={placing}
                                    icon={placing ? <Loader2 size={14} className="animate-spin" /> : undefined}
                                />
                            </div>
                        )}
                    </div>

                    {/* Order summary sidebar */}
                    <div className="lg:sticky lg:top-10 self-start">
                        <div className="rounded-2xl p-6 space-y-4 border" style={{ borderColor: `${theme.colors.dark}10` }}>
                            <h3 className="text-sm font-bold uppercase tracking-widest opacity-50" style={{ color: theme.colors.dark }}>
                                Order Summary
                            </h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                {items.map(({ product, quantity, size, shape }) => (
                                    <div key={`${product.id}-${size}-${shape}`} className="flex gap-3">
                                        <div className="relative w-12 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[#F2ECE4]">
                                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                                            <span
                                                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                                                style={{ backgroundColor: theme.colors.dark }}
                                            >
                                                {quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium truncate" style={{ color: theme.colors.dark }}>{product.name}</p>
                                            <p className="text-[10px] opacity-40 mt-0.5" style={{ color: theme.colors.dark }}>
                                                {[size, shape].filter(Boolean).join(" · ")}
                                            </p>
                                        </div>
                                        <span className="text-xs font-semibold flex-shrink-0" style={{ color: theme.colors.dark }}>
                                            £{(product.price * quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2" style={{ borderColor: `${theme.colors.dark}10` }}>
                                <div className="flex justify-between text-xs opacity-50" style={{ color: theme.colors.dark }}>
                                    <span>Subtotal</span>
                                    <span>£{subtotal.toFixed(2)}</span>
                                </div>

                                {/* ── Discount row ── */}
                                {discountAmount > 0 && discount && (
                                    <div className="flex justify-between text-xs" style={{ color: theme.colors.primary }}>
                                        <span className="flex items-center gap-1">
                                            <Tag size={10} />
                                            {discount.code} · {discount.label}
                                        </span>
                                        <span>−£{discountAmount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-xs opacity-50" style={{ color: theme.colors.dark }}>
                                    <span>Shipping</span>
                                    <span>{shippingCost === 0 ? "Free" : `£${shippingCost.toFixed(2)}`}</span>
                                </div>

                                {/* ── Gift / note indicators ── */}
                                {isGift && (
                                    <div className="flex items-center gap-1 text-xs" style={{ color: theme.colors.primary }}>
                                        <Gift size={10} />
                                        <span>Gift order</span>
                                    </div>
                                )}
                                {orderNote && (
                                    <div className="flex items-center gap-1 text-xs opacity-50" style={{ color: theme.colors.dark }}>
                                        <FileText size={10} />
                                        <span className="truncate">Note added</span>
                                    </div>
                                )}

                                <div className="flex justify-between font-serif italic text-base pt-2 border-t"
                                    style={{ color: theme.colors.dark, borderColor: `${theme.colors.dark}10` }}>
                                    <span>Total</span>
                                    <span>£{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
        <div className="flex items-center gap-2 mb-2">
            <span style={{ color: theme.colors.primary }}>{icon}</span>
            <h2 className="text-lg font-serif italic" style={{ color: theme.colors.dark }}>{title}</h2>
        </div>
    );
}

function Field({ label, value, onChange, error, colSpan = "" }: {
    label: string; value: string; onChange: (v: string) => void; error?: string; colSpan?: string;
}) {
    return (
        <div className={`flex flex-col gap-1 ${colSpan}`}>
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: theme.colors.dark }}>
                {label}
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="border rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                style={{ borderColor: error ? "#ef4444" : `${theme.colors.dark}20`, color: theme.colors.dark, backgroundColor: theme.colors.light }}
            />
            {error && <span className="text-[10px] text-red-500 font-medium">{error}</span>}
        </div>
    );
}

function ReviewCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border p-5 space-y-1" style={{ borderColor: `${theme.colors.dark}10` }}>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-3" style={{ color: theme.colors.dark }}>
                {title}
            </p>
            {children}
        </div>
    );
}

function PrimaryButton({ label, onClick, disabled = false, icon }: {
    label: string; onClick: () => void; disabled?: boolean; icon?: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-opacity mt-4"
            style={{ backgroundColor: theme.colors.dark, color: theme.colors.light, opacity: disabled ? 0.6 : 1 }}
        >
            {icon}{label}
        </button>
    );
}