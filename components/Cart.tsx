// components/CartSidebar.tsx
"use client";

import { X, ShoppingBag, MoveRight, Minus, Plus, Trash2, Loader2, Tag, Gift, FileText, ChevronDown, ChevronUp, XCircle, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import theme from "@/theme";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const categories = [
    {
        title: "New Arrival",
        image: "/newarrivals.png",
        href: "/collections/newarrivals",
        label: "THE LATEST",
    },
    {
        title: "Tools & Accessories",
        image: "/tools.png",
        href: "/collections/toolsandaccessories",
        label: "ESSENTIALS",
    },
];

const FREE_SHIPPING_THRESHOLD = 70;

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
    const {
        items,
        removeFromCart,
        updateQuantity,
        totalItems,
        subtotal,
        discount,
        discountAmount,
        discountedSubtotal,
        applyDiscount,
        removeDiscount,
        orderNote,
        setOrderNote,
        isGift,
        setIsGift,
        giftNote,
        setGiftNote,
        syncing,
    } = useCart();
    const { user } = useAuth();
    const [isRemoving, setIsRemoving] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const isEmpty = items.length === 0;
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);
    const shippingProgress = Math.min(100, (discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100);
    const shippingCost = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99;
    const total = discountedSubtotal + shippingCost;

    const handleCategoryClick = () => {
        if (window.innerWidth < 1024) onClose();
    };

    const handleRemoveItem = async (productId: string, size: string, shape: string) => {
        const itemKey = `${productId}-${size}-${shape}`;
        setIsRemoving(itemKey);
        try {
            await removeFromCart(productId, size, shape);
            toast.success("Removed from cart");
        } catch (error) {
            toast.error("Failed to remove item");
        } finally {
            setIsRemoving(null);
        }
    };

    const handleQuantityUpdate = async (
        productId: string,
        newQuantity: number,
        size: string,
        shape: string
    ) => {
        const itemKey = `${productId}-${size}-${shape}`;
        if (newQuantity < 1) {
            handleRemoveItem(productId, size, shape);
            return;
        }
        setIsUpdating(itemKey);
        try {
            await updateQuantity(productId, newQuantity, size, shape);
        } catch (error) {
            toast.error("Failed to update quantity");
        } finally {
            setIsUpdating(null);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <div
                style={{ backgroundColor: theme.colors.light }}
                className={`fixed top-0 right-0 h-full w-full max-w-[480px] z-[70] flex flex-col shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-title"
            >
                {/* Top Accent Bar */}
                <div style={{ backgroundColor: theme.colors.primary }} className="h-1.5 w-full" />

                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 md:px-10 py-6 md:py-8 border-b"
                    style={{ borderColor: `${theme.colors.dark}08` }}
                >
                    <div className="space-y-1">
                        <h2
                            id="cart-title"
                            style={{ color: theme.colors.dark }}
                            className="text-2xl md:text-3xl font-serif italic leading-none"
                        >
                            Your Selection
                        </h2>
                        <p
                            style={{ color: theme.colors.muted }}
                            className="text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-2"
                        >
                            {totalItems} {totalItems === 1 ? "item" : "items"}
                            {syncing && (
                                <span
                                    className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
                                    style={{ backgroundColor: theme.colors.primary }}
                                    aria-label="Syncing cart"
                                />
                            )}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ color: theme.colors.dark }}
                        className="group flex items-center gap-2 text-sm font-medium hover:opacity-60 transition-all p-2 -mr-2 md:-mr-4"
                        aria-label="Close cart sidebar"
                    >
                        <span className="hidden sm:block transition-all">Close</span>
                        <X size={24} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto flex flex-col">
                    {/* Free Shipping Progress */}
                    {!isEmpty && (
                        <div
                            className="px-6 md:px-10 py-4 md:py-6 border-b"
                            style={{ borderColor: `${theme.colors.dark}08` }}
                        >
                            {remaining > 0 ? (
                                <p
                                    style={{ color: theme.colors.muted }}
                                    className="text-[10px] tracking-widest uppercase font-bold mb-3"
                                >
                                    Add{" "}
                                    <span style={{ color: theme.colors.primary }}>
                                        £{remaining.toFixed(2)}
                                    </span>{" "}
                                    for free shipping
                                </p>
                            ) : (
                                <p
                                    style={{ color: theme.colors.primary }}
                                    className="text-[10px] tracking-widest uppercase font-bold mb-3 flex items-center gap-2"
                                >
                                    ✓ Free shipping unlocked!
                                </p>
                            )}
                            <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700 ease-out"
                                    style={{
                                        width: `${shippingProgress}%`,
                                        backgroundColor: theme.colors.primary,
                                    }}
                                    role="progressbar"
                                    aria-valuenow={Math.round(shippingProgress)}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-label="Free shipping progress"
                                />
                            </div>
                        </div>
                    )}

                    {/* Cart Items or Empty State */}
                    <div className="flex-1 overflow-y-auto">
                        {isEmpty ? (
                            <EmptyCart
                                categories={categories}
                                onCategoryClick={handleCategoryClick}
                            />
                        ) : (
                            <>
                                <CartItems
                                    items={items}
                                    isRemoving={isRemoving}
                                    isUpdating={isUpdating}
                                    onRemove={handleRemoveItem}
                                    onUpdateQuantity={handleQuantityUpdate}
                                    user={user}
                                />
                                {!isEmpty && (
                                    <div
                                        className="border-t px-6 md:px-10 py-4 space-y-3"
                                        style={{ borderColor: `${theme.colors.dark}08` }}
                                    >
                                        <DiscountSection
                                            discount={discount}
                                            onApply={applyDiscount}
                                            onRemove={removeDiscount}
                                        />
                                        <OrderNotesSection
                                            orderNote={orderNote}
                                            setOrderNote={setOrderNote}
                                            isGift={isGift}
                                            setIsGift={setIsGift}
                                            giftNote={giftNote}
                                            setGiftNote={setGiftNote}
                                        />
                                    </div>
                                )}</>
                        )}
                    </div>


                </div>

                {/* Footer */}
                <CartFooter
                    isEmpty={isEmpty}
                    subtotal={subtotal}
                    discountAmount={discountAmount}
                    discountLabel={discount?.label}
                    shippingCost={shippingCost}
                    total={total}
                    isCheckoutDisabled={syncing}
                    onClose={onClose}
                />
            </div>
        </>
    );
}

/* ─────────────────────────────────────────────
   Discount Section
───────────────────────────────────────────── */
interface DiscountSectionProps {
    discount: ReturnType<typeof useCart>["discount"];
    onApply: (code: string) => Promise<{ success: boolean; message: string }>;
    onRemove: () => void;
}

function DiscountSection({ discount, onApply, onRemove }: DiscountSectionProps) {
    const [open, setOpen] = useState(false);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 50);
    }, [open]);

    const handleApply = async () => {
        if (!code.trim()) return;
        setLoading(true);
        setFeedback(null);
        const result = await onApply(code);
        setFeedback({ ok: result.success, msg: result.message });
        setLoading(false);
        if (result.success) {
            setCode("");
            setOpen(false);
        }
    };

    if (discount) {
        return (
            <div
                className="flex items-center justify-between px-3 py-2.5 rounded-xl border"
                style={{
                    borderColor: `${theme.colors.primary}40`,
                    backgroundColor: `${theme.colors.primary}08`,
                }}
            >
                <div className="flex items-center gap-2">
                    <Tag size={13} style={{ color: theme.colors.primary }} />
                    <span
                        className="text-xs text-gray-800 font-bold tracking-wider uppercase"
                        style={{ color: theme.colors.primary }}
                    >
                        {discount.code}
                    </span>
                    <span className="text-[10px] font-medium opacity-70" style={{ color: theme.colors.primary }}>
                        · {discount.label}
                    </span>
                </div>
                <button
                    onClick={onRemove}
                    className="opacity-50 hover:opacity-100 transition-opacity"
                    aria-label="Remove discount code"
                >
                    <XCircle size={15} style={{ color: theme.colors.dark }} />
                </button>
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-opacity hover:opacity-60"
                style={{ color: theme.colors.dark }}
            >
                <Tag size={13} />
                Discount code
                {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {open && (
                <div className="mt-2.5 flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value.toUpperCase());
                            setFeedback(null);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleApply()}
                        placeholder="Enter code"
                        className="flex-1 h-9 text-gray-600 px-3 text-xs font-mono rounded-xl border outline-none transition-all focus:ring-2"
                        style={{
                            borderColor: feedback
                                ? feedback.ok
                                    ? `${theme.colors.primary}80`
                                    : "#f87171"
                                : `${theme.colors.dark}20`,
                            // @ts-ignore
                            "--tw-ring-color": `${theme.colors.primary}25`,
                        }}
                    />
                    <button
                        onClick={handleApply}
                        disabled={loading || !code.trim()}
                        className="px-4 h-9 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all hover:opacity-90 disabled:opacity-40 flex items-center gap-1.5"
                        style={{ backgroundColor: theme.colors.dark }}
                    >
                        {loading ? <Loader2 size={12} className="animate-spin" /> : "Apply"}
                    </button>
                </div>
            )}

            {feedback && !feedback.ok && (
                <p className="mt-1.5 text-[10px] font-medium text-red-500 flex items-center gap-1">
                    <XCircle size={10} />
                    {feedback.msg}
                </p>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────
   Order Notes Section
───────────────────────────────────────────── */
interface OrderNotesSectionProps {
    orderNote: string;
    setOrderNote: (v: string) => void;
    isGift: boolean;
    setIsGift: (v: boolean) => void;
    giftNote: string;
    setGiftNote: (v: string) => void;
}

function OrderNotesSection({
    orderNote,
    setOrderNote,
    isGift,
    setIsGift,
    giftNote,
    setGiftNote,
}: OrderNotesSectionProps) {
    const [noteOpen, setNoteOpen] = useState(!!orderNote);
    const [giftOpen, setGiftOpen] = useState(isGift);

    return (
        <div className="space-y-2.5">
            {/* Order note toggle */}
            <button
                onClick={() => setNoteOpen((v) => !v)}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-opacity hover:opacity-60"
                style={{ color: theme.colors.dark }}
            >
                <FileText size={13} />
                Add order note
                {noteOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {noteOpen && (
                <textarea
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Any special instructions for your order…"
                    rows={3}
                    maxLength={500}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border outline-none resize-none transition-all focus:ring-2"
                    style={{
                        borderColor: `${theme.colors.dark}20`,
                        backgroundColor: "white",
                        color: theme.colors.dark,
                        // @ts-ignore
                        "--tw-ring-color": `${theme.colors.primary}25`,
                    }}
                />
            )}

            {/* Gift toggle */}
            <div className="space-y-2">
                <button
                    onClick={() => {
                        const next = !isGift;
                        setIsGift(next);
                        setGiftOpen(next);
                    }}
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-opacity hover:opacity-60 w-full"
                    style={{ color: theme.colors.dark }}
                >
                    <Gift size={13} />
                    <span>Is this a gift?</span>
                    {/* Toggle pill */}
                    <span
                        className="ml-auto w-9 h-5 rounded-full relative transition-colors duration-200 flex-shrink-0"
                        style={{
                            backgroundColor: isGift ? theme.colors.primary : `${theme.colors.dark}20`,
                        }}
                    >
                        <span
                            className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                            style={{ transform: isGift ? "translateX(16px)" : "translateX(0)" }}
                        />
                    </span>
                </button>

                {isGift && (
                    <textarea
                        value={giftNote}
                        onChange={(e) => setGiftNote(e.target.value)}
                        placeholder="Add a personalised gift message…"
                        rows={2}
                        maxLength={300}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border outline-none resize-none transition-all focus:ring-2"
                        style={{
                            borderColor: `${theme.colors.primary}40`,
                            backgroundColor: `${theme.colors.primary}05`,
                            color: theme.colors.dark,
                            // @ts-ignore
                            "--tw-ring-color": `${theme.colors.primary}25`,
                        }}
                    />
                )}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Empty Cart
───────────────────────────────────────────── */
interface EmptyCartProps {
    categories: typeof categories;
    onCategoryClick: () => void;
}

function EmptyCart({ categories, onCategoryClick }: EmptyCartProps) {
    return (
        <div className="flex flex-col h-full px-6 md:px-10 py-8">
            <div className="mb-10 md:mb-12">
                <h3
                    style={{ color: theme.colors.dark }}
                    className="text-lg md:text-xl font-medium mb-3 md:mb-4"
                >
                    It looks a bit lonely here.
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
                    Your curated collection is waiting to be built. Start with our favorite picks below.
                </p>
            </div>

            <div className="grid gap-4 md:gap-6">
                {categories.map((cat) => (
                    <Link
                        key={cat.title}
                        href={cat.href}
                        onClick={onCategoryClick}
                        className="relative group block overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2"
                        style={{ outlineColor: theme.colors.primary }}
                    >
                        <div className="aspect-[16/7] overflow-hidden">
                            <Image
                                src={cat.image}
                                alt={cat.title}
                                width={400}
                                height={175}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                priority
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#422B23]/60 to-transparent flex flex-col justify-center px-6 md:px-8">
                            <span
                                style={{ color: theme.colors.subtitle }}
                                className="text-[10px] font-bold tracking-widest uppercase mb-1"
                            >
                                {cat.label}
                            </span>
                            <h4 className="text-white text-base md:text-lg font-serif italic">
                                {cat.title}
                            </h4>
                        </div>
                        <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                            <div
                                style={{ backgroundColor: theme.colors.light }}
                                className="p-2 rounded-full shadow-lg"
                            >
                                <MoveRight size={18} style={{ color: theme.colors.dark }} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Cart Items
───────────────────────────────────────────── */
interface CartItemsProps {
    items: any[];
    isRemoving: string | null;
    isUpdating: string | null;
    onRemove: (productId: string, size: string, shape: string) => void;
    onUpdateQuantity: (productId: string, quantity: number, size: string, shape: string) => void;
    user: any;
}

function CartItems({ items, isRemoving, isUpdating, onRemove, onUpdateQuantity }: CartItemsProps) {
    return (
        <div className="space-y-3 px-6 md:px-10 py-4 md:py-6">
            {items.map(({ product, quantity, size, shape }) => {
                const itemKey = `${product.id}-${size}-${shape}`;
                const isItemRemoving = isRemoving === itemKey;
                const isItemUpdating = isUpdating === itemKey;

                return (
                    <div
                        key={itemKey}
                        className="flex gap-3 md:gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors shadow-sm"
                    >
                        {/* Thumbnail */}
                        <div className="relative w-16 md:w-20 h-20 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#F2ECE4]">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 64px, 80px"
                            />
                            {isItemRemoving && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 size={20} className="animate-spin text-white" />
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div
                            className="flex flex-col justify-between flex-1 min-w-0 transition-opacity"
                            style={{ opacity: isItemRemoving ? 0.5 : 1 }}
                        >
                            {/* Name + Delete */}
                            <div className="flex items-start justify-between gap-2">
                                <h4
                                    className="text-xs md:text-sm font-serif leading-snug flex-1"
                                    style={{ color: theme.colors.dark }}
                                >
                                    {product.name}
                                </h4>
                                <button
                                    onClick={() => onRemove(product.id, size, shape)}
                                    disabled={isItemRemoving}
                                    className="flex-shrink-0 opacity-30 hover:opacity-100 hover:text-red-500 transition-all disabled:opacity-50 p-1 -mr-1"
                                    aria-label={`Remove ${product.name}`}
                                >
                                    {isItemRemoving ? (
                                        <Loader2 size={14} className="animate-spin" style={{ color: theme.colors.dark }} />
                                    ) : (
                                        <Trash2 size={14} style={{ color: theme.colors.dark }} />
                                    )}
                                </button>
                            </div>

                            {/* Size & Shape badges */}
                            <div className="flex items-center gap-1 mt-1.5 flex-wrap text-[8px] md:text-[9px]">
                                {size && (
                                    <span
                                        className="inline-flex items-center gap-0.5 font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded-full border"
                                        style={{
                                            borderColor: `${theme.colors.primary}40`,
                                            color: theme.colors.primary,
                                            backgroundColor: `${theme.colors.primary}0D`,
                                        }}
                                    >
                                        <span className="opacity-50">S</span>
                                        <span className="opacity-80">{size}</span>
                                    </span>
                                )}
                                {shape && (
                                    <span
                                        className="inline-flex items-center gap-0.5 font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded-full border"
                                        style={{
                                            borderColor: `${theme.colors.dark}25`,
                                            color: theme.colors.dark,
                                            backgroundColor: `${theme.colors.dark}06`,
                                        }}
                                    >
                                        <span className="opacity-40">SH</span>
                                        <span className="opacity-70">{shape}</span>
                                    </span>
                                )}
                            </div>

                            {/* Quantity + Price */}
                            <div className="flex items-center justify-between mt-2 md:mt-2.5 gap-2">
                                <QuantityControl
                                    quantity={quantity}
                                    isUpdating={isItemUpdating}
                                    onDecrease={() => onUpdateQuantity(product.id, quantity - 1, size, shape)}
                                    onIncrease={() => onUpdateQuantity(product.id, quantity + 1, size, shape)}
                                />
                                <span
                                    className="text-xs md:text-sm font-semibold flex-shrink-0"
                                    style={{ color: theme.colors.dark }}
                                >
                                    £{(product.price * quantity).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/* ─────────────────────────────────────────────
   Quantity Control
───────────────────────────────────────────── */
interface QuantityControlProps {
    quantity: number;
    isUpdating: boolean;
    onDecrease: () => void;
    onIncrease: () => void;
}

function QuantityControl({ quantity, isUpdating, onDecrease, onIncrease }: QuantityControlProps) {
    return (
        <div
            className="flex items-center gap-1 md:gap-2 border rounded-full px-2 py-1 transition-opacity"
            style={{ borderColor: `${theme.colors.dark}20`, opacity: isUpdating ? 0.5 : 1 }}
        >
            <button
                onClick={onDecrease}
                disabled={isUpdating}
                className="w-4 md:w-5 h-4 md:h-5 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors disabled:opacity-50"
                aria-label="Decrease quantity"
            >
                <Minus size={10} style={{ color: theme.colors.dark }} />
            </button>
            <span className="text-xs md:text-xs font-bold w-4 text-center" style={{ color: theme.colors.dark }}>
                {quantity}
            </span>
            <button
                onClick={onIncrease}
                disabled={isUpdating}
                className="w-4 md:w-5 h-4 md:h-5 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors disabled:opacity-50"
                aria-label="Increase quantity"
            >
                <Plus size={10} style={{ color: theme.colors.dark }} />
            </button>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Cart Footer
───────────────────────────────────────────── */
interface CartFooterProps {
    isEmpty: boolean;
    subtotal: number;
    discountAmount: number;
    discountLabel?: string;
    shippingCost: number;
    total: number;
    isCheckoutDisabled: boolean;
    onClose: () => void;
}

function CartFooter({
    isEmpty,
    subtotal,
    discountAmount,
    discountLabel,
    shippingCost,
    total,
    isCheckoutDisabled,
    onClose,
}: CartFooterProps) {
    return (
        <div
            className="border-t p-6 md:p-6 space-y-2 md:space-y-2"
            style={{ borderColor: `${theme.colors.dark}08` }}
        >
            {!isEmpty && (
                <div className="space-y-2 text-xs opacity-70">
                    <div className="flex justify-between" style={{ color: theme.colors.dark }}>
                        <span className="uppercase tracking-widest font-bold">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>

                    {discountAmount > 0 && (
                        <div className="flex justify-between" style={{ color: theme.colors.primary }}>
                            <span className="uppercase tracking-widest font-bold flex items-center gap-1">
                                <Tag size={10} />
                                Discount {discountLabel ? `(${discountLabel})` : ""}
                            </span>
                            <span>−£{discountAmount.toFixed(2)}</span>
                        </div>
                    )}

                    <div className="flex justify-between" style={{ color: theme.colors.dark }}>
                        <span className="uppercase tracking-widest font-bold">Shipping</span>
                        <span>
                            {shippingCost === 0 ? (
                                <span style={{ color: theme.colors.primary }} className="font-semibold">
                                    Free
                                </span>
                            ) : (
                                `£${shippingCost.toFixed(2)}`
                            )}
                        </span>
                    </div>
                </div>
            )}

            {/* Total */}
            {!isEmpty && (
                <div
                    className="flex justify-between text-sm md:text-base font-serif italic pt-2 border-t"
                    style={{ color: theme.colors.dark, borderColor: `${theme.colors.dark}10` }}
                >
                    <span>Total</span>
                    <span style={{ color: theme.colors.primary }}>${total.toFixed(2)}</span>
                </div>
            )}

            {/* Checkout Button */}
            <Link
                href={isEmpty ? "/products" : "/checkout"}
                onClick={onClose}
                className="flex items-center justify-between w-full px-6 md:px-8 py-4 md:py-5 text-white rounded-xl transition-all hover:shadow-xl"
                style={{
                    backgroundColor: theme.colors.dark,
                    pointerEvents: isCheckoutDisabled ? "none" : "auto",
                    opacity: isCheckoutDisabled ? 0.6 : 1,
                }}
                aria-disabled={isCheckoutDisabled}
            >
                <span className="text-xs font-bold tracking-[0.15em] uppercase">
                    {isEmpty ? "Continue Shopping" : "Proceed to Checkout"}
                </span>
                <ShoppingBag size={16} />
            </Link>


        </div>
    );
}