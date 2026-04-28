"use client";

import { useState, useRef } from "react";
import { Heart, ShoppingCart } from "lucide-react";

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
        name: "Rich Girl",
        image: "/product1.png",
        hoverImage: "/backimg1.png",
        price: 59.99,
    },
    {
        id: 2,
        name: "Spiced Bloom",
        image: "/product2.png",
        hoverImage: "/backimg2.png",
        price: 44.99,
        originalPrice: 49.99,
        discount: "$5 USD OFF",
        reviews: 18,
        rating: 5,
    },
    {
        id: 3,
        name: "Lush Green",
        image: "/product3.png",
        hoverImage: "/backimg3.png",
        price: 44.99,
        originalPrice: 49.99,
        discount: "$5 USD OFF",
        reviews: 12,
        rating: 5,
    },
    {
        id: 4,
        name: "Candy Blossom",
        image: "/product1.png",
        hoverImage: "/backimg1.png",
        price: 49.99,
    },
    {
        id: 5,
        name: "Petal Rush",
        image: "/product2.png",
        hoverImage: "/backimg2.png",
        price: 54.99,
        originalPrice: 59.99,
        discount: "$5 USD OFF",
        reviews: 8,
        rating: 5,
    },
];

function StarRating({ rating, count }: { rating: number; count: number }) {
    return (
        <div className="flex items-center justify-center gap-1 mb-1">
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
            <span className="text-xs text-gray-500">{count} reviews</span>
        </div>
    );
}

function ProductCard({ product }: { product: Product }) {
    const [wished, setWished] = useState(false);
    const [hovered, setHovered] = useState(false);

    return (
        <div className="flex flex-col">
            <div
                className="relative bg-[#f7f4f4] rounded-lg overflow-hidden aspect-square mb-3 cursor-grab active:cursor-grabbing"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {product.discount && (
                    <div className="absolute top-3 left-3 z-10 bg-[#c8102e] text-white text-[10px] font-semibold px-2 py-1 tracking-wide">
                        {product.discount}
                    </div>
                )}
                <button
                    onClick={() => setWished(!wished)}
                    className="absolute top-3 right-3 z-10"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <Heart
                        size={20}
                        className={wished ? "fill-[#c8102e] text-[#c8102e]" : "text-[#c8102e]"}
                    />
                </button>

                <img
                    src={product.image}
                    alt={product.name}
                    draggable={false}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100"
                        }`}
                />
                <img
                    src={product.hoverImage}
                    alt={`${product.name} alternate view`}
                    draggable={false}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"
                        }`}
                />

                <button
                    onClick={() => console.log(`Added ${product.name} to cart`)}
                    onMouseDown={(e) => e.stopPropagation()}
                    className={`absolute bottom-3 right-3 z-10 bg-black text-white p-2 rounded-full shadow-md transition-all duration-300 hover:bg-[#c8102e] ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                        }`}
                >
                    <ShoppingCart size={16} />
                </button>
            </div>

            <div className="text-center">
                {product.reviews && product.rating && (
                    <StarRating rating={product.rating} count={product.reviews} />
                )}
                <p className="text-sm text-gray-800 mb-1">{product.name}</p>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-gray-800">${product.price.toFixed(2)} USD</span>
                    {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                            ${product.originalPrice.toFixed(2)} USD
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function BestSellers() {
    const trackRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const scrollStart = useRef(0);
    const touchStartX = useRef(0);
    const [current, setCurrent] = useState(0);

    // Desktop drag handlers
    const onMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        dragStartX.current = e.clientX;
        scrollStart.current = trackRef.current?.scrollLeft || 0;
    };
    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !trackRef.current) return;
        e.preventDefault();
        trackRef.current.scrollLeft = scrollStart.current - (e.clientX - dragStartX.current);
    };
    const onMouseUp = () => { isDragging.current = false; };

    // Mobile swipe handlers
    const prevMobile = () => setCurrent((c) => (c - 1 + products.length) % products.length);
    const nextMobile = () => setCurrent((c) => (c + 1) % products.length);

    return (
        <section className="px-4 md:px-10 py-12 w-full mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
                    Best Sellers Loved by Thousands
                </h2>
                <a

                    href="/best-sellers"
                    className="hidden md:flex items-center bg-black text-white text-xs font-semibold tracking-widest px-5 py-3 whitespace-nowrap hover:bg-gray-800 transition-colors"
                >
                    SHOP BEST SELLERS
                </a>
            </div>
            <p className="text-sm text-gray-500 mb-8 max-w-xl">
                Our most popular nail sets, chosen by over 100,000 customers. Proven styles that deliver salon-quality results—every time.
            </p>

            {/* Desktop — drag to scroll, no scrollbar */}
            <div
                ref={trackRef}
                className="hidden md:flex gap-6 overflow-x-auto cursor-grab active:cursor-grabbing select-none"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
            >
                <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
                {products.map((product) => (
                    <div key={product.id} className="min-w-[calc(25%-18px)] shrink-0">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* Mobile — swipe carousel, no arrows */}
            <div className="md:hidden">
                <div
                    className="overflow-hidden rounded-lg"
                    onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                    onTouchEnd={(e) => {
                        const diff = touchStartX.current - e.changedTouches[0].clientX;
                        if (diff > 40) nextMobile();
                        else if (diff < -40) prevMobile();
                    }}
                >
                    <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(-${current * 100}%)` }}
                    >
                        {products.map((product) => (
                            <div key={product.id} className="min-w-full px-1">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots only — no arrows */}
                <div className="flex justify-center gap-1.5 mt-4">
                    {products.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`w-2 h-2 rounded-full border-none cursor-pointer transition-colors ${i === current ? "bg-[#c8102e]" : "bg-gray-300"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Mobile CTA */}
            <div className="mt-8 flex justify-center md:hidden">
                <a
                    href="/best-sellers"
                    className="bg-black text-white text-xs font-semibold tracking-widest px-8 py-3"
                >
                    SHOP BEST SELLERS
                </a>
            </div>
        </section>
    );
}