"use client";

import Image from "next/image";
import { Star, ArrowUpRight } from "lucide-react";
import theme from "@/theme";
import { Product } from "@/types/product";
import ProductCard from "./cards/MainProductCard";

const featuredProducts: Product[] = [
    { id: 1, name: "ProTouch Kit Max", price: 24.99, image: "/product1.png", category: "Essentials" },
    { id: 2, name: "Ersa Nails Pro", price: 19.99, image: "/product2.png", category: "Pro Line" },
    { id: 3, name: "ProTouch Mini", price: 17.99, image: "/product3.png", category: "Starter" },
    { id: 4, name: "Nail Essentials", price: 29.99, image: "/product1.png", category: "New Arrival" },
];

export default function HeroWithProducts() {
    return (
        <div
            id="new-arrivals"
            className="min-h-screen font-sans w-full"
            style={{ backgroundColor: theme.colors.light, color: theme.colors.dark }}
        >
            <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">

                {/* ── ROW 1: Hero (8 cols) + Stats card (4 cols) ── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">

                    {/* HERO — spans 8 cols, 2 rows via explicit row-span on a wrapper */}
                    <div className="md:col-span-8 md:row-span-2 relative rounded-[2rem] overflow-hidden group min-h-[420px] md:min-h-[600px]">
                        <Image
                            src="/shoot.png"
                            alt="Hero"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                        <div className="absolute bottom-0 left-0 p-8 lg:p-12 w-full flex flex-col items-start">
                            <span
                                className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
                                style={{ backgroundColor: theme.colors.subtitle, color: theme.colors.dark }}
                            >
                                Organic Collection
                            </span>
                            <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight max-w-lg text-white drop-shadow-md">
                                Nail Care <br /> Redefined.
                            </h1>
                            <button
                                className="flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-transform hover:scale-105 active:scale-95"
                                style={{ backgroundColor: theme.colors.primary, color: "white" }}
                            >
                                SHOP THE DROP <ArrowUpRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* STATS CARD — spans 4 cols */}
                    <div
                        className="md:col-span-4 p-8 rounded-[2rem] flex flex-col justify-center border"
                        style={{ borderColor: theme.colors.muted, backgroundColor: "white" }}
                    >
                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill={theme.colors.primary} color={theme.colors.primary} />
                            ))}
                        </div>
                        <h2 className="text-2xl font-serif mb-2">Loved by 10k+ Stylists</h2>
                        <p className="opacity-70 text-sm leading-relaxed">
                            Our formula is vegan, cruelty-free, and designed for professional longevity.
                        </p>
                    </div>

                    {/* FEATURE PRODUCT BLOCK — spans 4 cols, sits below stats */}
                    <div
                        className="md:col-span-4 rounded-[2rem] p-6 relative overflow-hidden flex items-center justify-center border"
                        style={{
                            backgroundColor: theme.colors.subtitle + "50",
                            borderColor: theme.colors.subtitle,
                        }}
                    >
                        <div className="text-center">
                            <p className="text-xs uppercase tracking-widest mb-1 opacity-60">New Arrival</p>
                            <p className="text-xl font-bold">{featuredProducts[0].name}</p>
                            <div className="relative h-40 w-40 mx-auto mt-4">
                                <Image
                                    src={featuredProducts[0].image}
                                    alt={featuredProducts[0].name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <p className="mt-3 text-sm font-medium opacity-60">
                                ${featuredProducts[0].price.toFixed(2)}
                            </p>
                        </div>
                    </div>

                </div>

                {/* ── ROW 2: Product Cards strip ── */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {featuredProducts.slice(1).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

            </main>
        </div>
    );
}