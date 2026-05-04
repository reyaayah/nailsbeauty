"use client";

import { useState } from "react";

import { Heart, ShoppingBag } from "lucide-react";
import theme from "@/theme";
import { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";
import SizeShapeSelector from "../modals/SizeShapeSelector";
import { useWishlist } from "@/context/WIshlistContext";
import toast from "react-hot-toast";

function StarRating({ rating, count }: { rating: number; count: number }) {
    return (
        <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <span
                        key={i}
                        className="text-[10px]"
                        style={{ color: i < rating ? theme.colors.primary : theme.colors.muted }}
                    >
                        ✦
                    </span>
                ))}
            </div>
            <span
                className="text-[9px] tracking-[0.1em] font-medium opacity-60"
                style={{ color: theme.colors.dark }}
            >
                {count} REVIEWS
            </span>
        </div>
    );
}

export default function ProductCard({ product }: { product: Product }) {
    const { addItem, removeItem, isInWishlist } = useWishlist();

    const wished = isInWishlist(product.id); const [hovered, setHovered] = useState(false);
    const [added, setAdded] = useState(false);
    const [selectorOpen, setSelectorOpen] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectorOpen(true);
    };

    const handleAdded = () => {
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
    };

    return (
        <div className="flex flex-col group">
            {/* Image area wrapped in a Link */}
            <Link href={`/products/${product.id}`} className="block">
                <div
                    className="relative bg-[#F2ECE4] rounded-2xl overflow-hidden aspect-[3/4] mb-5 cursor-pointer shadow-sm group-hover:shadow-md transition-shadow duration-500"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    {/* Discount Badge */}
                    {product.discount && (
                        <div
                            className="absolute top-4 left-4 z-10 text-[8px] font-bold px-3 py-1.5 rounded-full tracking-widest uppercase shadow-sm"
                            style={{ backgroundColor: theme.colors.primary, color: "white" }}
                        >
                            {product.discount}
                        </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                        onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            try {
                                if (wished) {
                                    await removeItem(product.id);
                                    toast.success("Removed from wishlist 💔");
                                } else {
                                    await addItem(product.id);
                                    toast.success("Added to wishlist ❤️");
                                }
                            } catch (error) {
                                toast.error("Something went wrong 😢");
                            }
                        }}
                        className="absolute top-4 right-4 z-20 transition-all hover:scale-110 active:scale-90 bg-white/50 backdrop-blur-sm p-2 rounded-full"
                        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart
                            size={16}
                            strokeWidth={1.5}
                            style={{
                                fill: wished ? theme.colors.primary : "transparent",
                                stroke: wished ? theme.colors.primary : theme.colors.dark,
                            }}
                        />
                    </button>

                    {/* Primary Image */}
                    <Image
                        src={product.image}
                        alt={product.name}
                        height={400}
                        width={300}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${hovered ? "opacity-0 scale-110" : "opacity-100 scale-100"
                            }`}
                    />

                    {/* Hover Image */}
                    <Image
                        src={product.hoverImage || product.image}
                        alt={`${product.name} alternate`}
                        height={400}
                        width={300}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                            }`}
                    />

                    <button
                        onClick={handleAddToCart}
                        className={`
    absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%] py-3.5 rounded-full 
    flex items-center justify-center gap-2 text-[9px] tracking-[0.25em] font-bold 
    transition-all duration-500 backdrop-blur-lg z-10

    /* MOBILE: always visible */
    translate-y-0 opacity-100

    /* DESKTOP: hover behavior */
    lg:translate-y-4 lg:opacity-0 
    lg:group-hover:translate-y-0 lg:group-hover:opacity-100

    shadow-xl
  `}
                        style={{
                            backgroundColor: added
                                ? `${theme.colors.primary}F2`
                                : `${theme.colors.dark}F2`,
                            color: theme.colors.light,
                        }}
                        aria-label={`Add ${product.name} to bag`}
                    >
                        <ShoppingBag size={12} />
                        {added ? "ADDED!" : "ADD TO BAG"}
                    </button>
                </div>
            </Link>

            {/* Product Info */}
            <Link href={`/products/${product.id}`} className="text-center hover:opacity-80 transition-opacity">
                <StarRating rating={product.rating || 5} count={product.reviews || 0} />
                <h3
                    className="text-base font-serif tracking-tight mb-1"
                    style={{ color: theme.colors.dark }}
                >
                    {product.name}
                </h3>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-medium" style={{ color: theme.colors.dark }}>
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
            </Link>

            {selectorOpen && (
                <SizeShapeSelector
                    product={product}
                    onClose={() => setSelectorOpen(false)}
                    onAdded={handleAdded}
                />
            )}
        </div>
    );
}