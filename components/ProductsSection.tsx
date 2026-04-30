"use client";

import { useState, useRef } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import theme from "@/theme";
import { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/product";





function StarRating({ rating, count }: { rating: number; count: number }) {
    return (
        <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[10px]" style={{ color: i < rating ? theme.colors.primary : theme.colors.muted }}>
                        ✦
                    </span>
                ))}
            </div>
            <span className="text-[9px] tracking-[0.1em] font-medium opacity-60" style={{ color: theme.colors.dark }}>{count} REVIEWS</span>
        </div>
    );
}

function ProductCard({ product }: { product: Product }) {
    const [wished, setWished] = useState(false);
    const [hovered, setHovered] = useState(false);

    return (
        <div className="flex flex-col group">
            {/* WRAP THE IMAGE AREA IN A LINK */}
            <Link href={`/products/${product.id}`} className="block">
                <div
                    className="relative bg-[#F2ECE4] rounded-2xl overflow-hidden aspect-[3/4] mb-5 cursor-pointer shadow-sm group-hover:shadow-md transition-shadow duration-500"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    {product.discount && (
                        <div
                            className="absolute top-4 left-4 z-10 text-[8px] font-bold px-3 py-1.5 rounded-full tracking-widest uppercase shadow-sm"
                            style={{ backgroundColor: theme.colors.primary, color: 'white' }}
                        >
                            {product.discount}
                        </div>
                    )}

                    {/* Wishlist Button - Propagation stopped so it doesn't navigate */}
                    <button
                        onClick={(e) => {
                            e.preventDefault(); // Prevents the Link from triggering
                            e.stopPropagation();
                            setWished(!wished);
                        }}
                        className="absolute top-4 right-4 z-20 transition-all hover:scale-110 active:scale-90 bg-white/50 backdrop-blur-sm p-2 rounded-full"
                    >
                        <Heart
                            size={16}
                            strokeWidth={1.5}
                            style={{ fill: wished ? theme.colors.primary : "transparent", stroke: wished ? theme.colors.primary : theme.colors.dark }}
                        />
                    </button>

                    <Image
                        src={product.image}
                        alt={product.name}
                        height={400}
                        width={300}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${hovered ? "opacity-0 scale-110" : "opacity-100 scale-100"}`}
                    />
                    <Image
                        src={product.hoverImage || product.image}
                        alt={`${product.name} alternate`}
                        height={400}
                        width={300}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    />

                    {/* Add to Bag Button - Also prevent navigation */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Handle add to cart logic here
                        }}
                        className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%] py-3.5 rounded-full flex items-center justify-center gap-2 text-[9px] tracking-[0.25em] font-bold transition-all duration-500 backdrop-blur-lg z-10 ${hovered ? "translate-y-0 opacity-100 shadow-xl" : "translate-y-4 opacity-0"}`}
                        style={{ backgroundColor: `${theme.colors.dark}F2`, color: theme.colors.light }}
                    >
                        <ShoppingBag size={12} />
                        ADD TO BAG
                    </button>
                </div>
            </Link>

            <Link href={`/products/${product.id}`} className="text-center hover:opacity-80 transition-opacity">
                <StarRating rating={product.rating || 5} count={product.reviews || 0} />
                <h3 className="text-base font-serif tracking-tight mb-1" style={{ color: theme.colors.dark }}>{product.name}</h3>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-medium" style={{ color: theme.colors.dark }}>${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                        <span className="text-xs line-through opacity-30" style={{ color: theme.colors.dark }}>
                            ${product.originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>
            </Link>
        </div>
    );
}

export default function BestSellers() {
    const [current, setCurrent] = useState(0);
    const touchStartRef = useRef<number>(0);
    const nextMobile = () => setCurrent((c) => (c + 1) % products.length);
    const prevMobile = () => setCurrent((c) => (c - 1 + products.length) % products.length);

    return (
        <section id="best-sellers"
            className="px-6 md:px-12 py-24 w-full max-w-[1600px] mx-auto overflow-hidden"
            style={{ backgroundColor: theme.colors.light }}
        >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
                <div className="max-w-xl">
                    <h2 className="text-5xl md:text-6xl font-serif mb-6 leading-[1.1]" style={{ color: theme.colors.dark }}>
                        The Iconic <span className="italic font-light">Essentials</span>
                    </h2>
                    <p className="text-sm md:text-base leading-relaxed opacity-70 max-w-md" style={{ color: theme.colors.dark }}>
                        Discover the sets that started a movement. Hand-crafted, reusable art that looks and feels like a professional salon application.
                    </p>
                </div>

                <a
                    href="/collections/best-sellers"
                    className="group flex items-center gap-6 text-[10px] tracking-[0.4em] font-bold uppercase transition-all"
                    style={{ color: theme.colors.dark }}
                >
                    VIEW ALL CURATIONS
                    <div className="relative flex items-center justify-center">
                        <div className="w-12 h-[1px] transition-all group-hover:w-20" style={{ backgroundColor: theme.colors.primary }} />
                    </div>
                </a>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden">
                <div
                    className="overflow-visible"
                    // 2. Update these handlers to use the ref
                    onTouchStart={(e) => {
                        touchStartRef.current = e.touches[0].clientX;
                    }}
                    onTouchEnd={(e) => {
                        const diff = touchStartRef.current - e.changedTouches[0].clientX;
                        if (diff > 50) nextMobile();
                        else if (diff < -50) prevMobile();
                    }}
                >
                    <div
                        className="flex transition-transform duration-1000 ease-[cubic-bezier(0.2,1,0.2,1)]"
                        style={{ transform: `translateX(-${current * 100}%)` }}
                    >
                        {products.map((product) => (
                            <div key={product.id} className="min-w-full px-1">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                </div>


            </div>
        </section>
    );
}