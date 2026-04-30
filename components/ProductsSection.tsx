"use client";

import { useState, useRef } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import theme from "@/theme";

interface Product {
    id: number;
    name: string;
    image: string;
    hoverImage: string;
    price: number;
    originalPrice?: number;
    discount?: string;
    reviews?: number;
    rating?: number;
}

const products: Product[] = [
    {
        id: 1,
        name: "Midnight Silk",
        image: "/product1.png",
        hoverImage: "/backimg1.png",
        price: 64.00,
        discount: "BEST SELLER",
        reviews: 124,
        rating: 5
    },
    {
        id: 2,
        name: "Vintage Rose Gold",
        image: "/product2.png",
        hoverImage: "/backimg2.png",
        price: 48.00,
        originalPrice: 55.00,
        discount: "LIMITED RUN",
        reviews: 89,
        rating: 5
    },
    {
        id: 3,
        name: "Frosted Peony",
        image: "/product3.png",
        hoverImage: "/backimg3.png",
        price: 52.00,
        reviews: 210,
        rating: 5
    },
    {
        id: 4,
        name: "Champagne Toast",
        image: "/product1.png",
        hoverImage: "/backimg1.png",
        price: 49.00,
        discount: "NEW ARRIVAL",
        reviews: 45,
        rating: 5
    },
    {
        id: 5,
        name: "Obsidian Glaze",
        image: "/product2.png",
        hoverImage: "/backimg2.png",
        price: 58.00,
        originalPrice: 65.00,
        reviews: 156,
        rating: 5
    },

];

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

                <button
                    onClick={(e) => { e.stopPropagation(); setWished(!wished); }}
                    className="absolute top-4 right-4 z-10 transition-all hover:scale-110 active:scale-90 bg-white/50 backdrop-blur-sm p-2 rounded-full"
                >
                    <Heart
                        size={16}
                        strokeWidth={1.5}
                        style={{ fill: wished ? theme.colors.primary : "transparent", stroke: wished ? theme.colors.primary : theme.colors.dark }}
                    />
                </button>

                <img
                    src={product.image}
                    alt={product.name}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${hovered ? "opacity-0 scale-110" : "opacity-100 scale-100"}`}
                />
                <img
                    src={product.hoverImage}
                    alt={`${product.name} alternate`}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                />

                <button
                    className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%] py-3.5 rounded-full flex items-center justify-center gap-2 text-[9px] tracking-[0.25em] font-bold transition-all duration-500 backdrop-blur-lg ${hovered ? "translate-y-0 opacity-100 shadow-xl" : "translate-y-4 opacity-0"}`}
                    style={{ backgroundColor: `${theme.colors.dark}F2`, color: theme.colors.light }}
                >
                    <ShoppingBag size={12} />
                    ADD TO BAG
                </button>
            </div>

            <div className="text-center">
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
            </div>
        </div>
    );
}

export default function BestSellers() {
    const [current, setCurrent] = useState(0);

    const nextMobile = () => setCurrent((c) => (c + 1) % products.length);
    const prevMobile = () => setCurrent((c) => (c - 1 + products.length) % products.length);

    return (
        <section
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
                    onTouchStart={(e) => { (window as any).startX = e.touches[0].clientX; }}
                    onTouchEnd={(e) => {
                        const diff = (window as any).startX - e.changedTouches[0].clientX;
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

                <div className="flex justify-center items-center gap-5 mt-12">
                    {products.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`transition-all duration-500 rounded-full ${i === current ? "w-10 h-1" : "w-1.5 h-1.5"}`}
                            style={{ backgroundColor: i === current ? theme.colors.primary : theme.colors.muted }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}