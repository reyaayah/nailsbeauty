// components/wishlist/WishlistCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Loader2 } from "lucide-react";
import theme from "@/theme";
import { Product } from "@/types/product";
import { useWishlist } from "@/context/WIshlistContext";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

interface WishlistCardProps {
    product: Product;
}

export default function WishlistCard({ product }: WishlistCardProps) {
    const { removeItem } = useWishlist();
    const { addToCart } = useCart();

    const [removing, setRemoving] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [hovered, setHovered] = useState(false);

    // ── Remove from wishlist ──────────────────────────────────────────────────
    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setRemoving(true);
        try {
            await removeItem(product.id);
            toast.success("Removed from wishlist");
        } catch {
            toast.error("Failed to remove from wishlist");
        } finally {
            setRemoving(false);
        }
    };

    // ── Move to cart ──────────────────────────────────────────────────────────
    const handleMoveToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setAddingToCart(true);
        try {
            // Default to first size/shape — user can refine on product page
            const defaultSize = product.sizes?.[0] ?? "M";
            const defaultShape = product.shape ?? "Almond";
            await addToCart(product, defaultSize, defaultShape);
            await removeItem(product.id);
            toast.success(`${product.name} moved to bag!`, {
                icon: <ShoppingBag size={14} />,
            });
        } catch {
            toast.error("Failed to move to bag");
        } finally {
            setAddingToCart(false);
        }
    };

    return (
        <div className="group relative">
            <Link href={`/products/${product.id}`}>
                {/* ── Image Container ─────────────────────────────────────── */}
                <div
                    className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-sm transition-all duration-500 group-hover:shadow-xl"
                    style={{ backgroundColor: "#F2ECE4" }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    {/* Primary image */}
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className={`object-cover transition-all duration-700 ${hovered ? "opacity-0 scale-110" : "opacity-100 scale-100"
                            }`}
                    />

                    {/* Hover image */}
                    <Image
                        src={product.hoverImage || product.image}
                        alt={`${product.name} alternate`}
                        fill
                        className={`object-cover transition-all duration-700 ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                            }`}
                    />

                    {/* Discount / tag badge */}
                    {product.discount && (
                        <span
                            className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold text-white z-10"
                            style={{ backgroundColor: theme.colors.primary }}
                        >
                            {product.discount}
                        </span>
                    )}

                    {/* ── Remove button (top-right) ──────────────────────── */}
                    <button
                        onClick={handleRemove}
                        disabled={removing}
                        className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 active:scale-90 disabled:opacity-50"
                        aria-label="Remove from wishlist"
                    >
                        {removing ? (
                            <Loader2 size={14} className="animate-spin" style={{ color: theme.colors.primary }} />
                        ) : (
                            <Heart
                                size={14}
                                strokeWidth={2}
                                style={{ fill: theme.colors.primary, stroke: theme.colors.primary }}
                            />
                        )}
                    </button>

                    {/* ── Hover overlay: Move to Bag ─────────────────────── */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                        <button
                            onClick={handleMoveToCart}
                            disabled={addingToCart}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 disabled:opacity-70"
                            style={{ color: theme.colors.dark }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.backgroundColor = theme.colors.primary;
                                (e.currentTarget as HTMLButtonElement).style.color = "white";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "white";
                                (e.currentTarget as HTMLButtonElement).style.color = theme.colors.dark;
                            }}
                        >
                            {addingToCart ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <ShoppingBag size={14} />
                            )}
                            {addingToCart ? "Moving..." : "Move to Bag"}
                        </button>
                    </div>
                </div>
            </Link>

            {/* ── Product Info ───────────────────────────────────────────── */}
            <Link href={`/products/${product.id}`} className="hover:opacity-80 transition-opacity">
                <div className="mt-5 text-center">
                    {/* Star rating */}
                    {product.rating && (
                        <div className="flex items-center justify-center gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                                <span
                                    key={i}
                                    className="text-[10px]"
                                    style={{
                                        color: i < (product.rating ?? 5)
                                            ? theme.colors.primary
                                            : theme.colors.muted,
                                    }}
                                >
                                    ✦
                                </span>
                            ))}
                            <span className="text-[9px] opacity-50 ml-1">
                                ({product.reviews})
                            </span>
                        </div>
                    )}

                    <h3
                        className="text-base font-serif tracking-tight mb-1"
                        style={{ color: theme.colors.dark }}
                    >
                        {product.name}
                    </h3>

                    <div className="flex items-center justify-center gap-2">
                        <span
                            className="text-sm font-bold"
                            style={{ color: theme.colors.primary }}
                        >
                            ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                            <span
                                className="text-xs line-through opacity-30"
                                style={{ color: theme.colors.dark }}
                            >
                                ${product.originalPrice.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Shape / Style tags */}
                    {(product.shape || product.style) && (
                        <div className="flex items-center justify-center gap-2 mt-2">
                            {product.shape && (
                                <span
                                    className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border"
                                    style={{
                                        borderColor: theme.colors.muted,
                                        color: theme.colors.dark,
                                        opacity: 0.6,
                                    }}
                                >
                                    {product.shape}
                                </span>
                            )}
                            {product.style && (
                                <span
                                    className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border"
                                    style={{
                                        borderColor: theme.colors.muted,
                                        color: theme.colors.dark,
                                        opacity: 0.6,
                                    }}
                                >
                                    {product.style}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
}