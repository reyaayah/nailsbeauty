"use client";

import { useState, useRef } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import theme from "@/theme";
import { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/product";
import ProductCard from "./cards/MainProductCard";


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