"use client";

import Image from "next/image";
import { Star, ArrowUpRight } from "lucide-react";
import theme from "@/theme";
import ProductCard from "./cards/MainProductCard";
import { useNewArrivals } from "@/hooks/useNewArrivals";
import { useRouter } from "next/navigation";

export default function HeroWithProducts() {
    const { featured, rest, loading, error } = useNewArrivals();
    const router = useRouter();
    return (
        <div
            id="new-arrivals"
            className="min-h-screen font-sans w-full"
            style={{ backgroundColor: theme.colors.light, color: theme.colors.dark }}
        >
            <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">

                {/* ── ROW 1: Hero (8 cols) + Stats card (4 cols) ── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">

                    {/* HERO */}
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
                                onClick={() => { router.push("/collections/newarrivals") }}
                                className="flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-transform hover:scale-105 active:scale-95"
                                style={{ backgroundColor: theme.colors.primary, color: "white" }}
                            >
                                SHOP THE DROP <ArrowUpRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* STATS CARD */}
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

                    {/* FEATURED NEW ARRIVAL BLOCK */}
                    <div
                        className="md:col-span-4 rounded-[2rem] p-6 relative overflow-hidden flex items-center justify-center border"
                        style={{
                            backgroundColor: theme.colors.subtitle + "50",
                            borderColor: theme.colors.subtitle,
                        }}
                    >
                        {/* Skeleton */}
                        {loading && (
                            <div className="animate-pulse text-center w-full">
                                <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto mb-2" />
                                <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto mb-4" />
                                <div className="w-40 h-40 bg-gray-200 rounded-full mx-auto" />
                                <div className="h-3 bg-gray-200 rounded w-1/4 mx-auto mt-4" />
                            </div>
                        )}

                        {/* Error */}
                        {!loading && error && (
                            <p className="text-sm text-red-400 text-center">{error}</p>
                        )}

                        {/* Featured product */}
                        {!loading && !error && featured && (
                            <div className="text-center">
                                <p className="text-xs uppercase tracking-widest mb-1 opacity-60">New Arrival</p>
                                <p className="text-xl font-bold">{featured.name}</p>
                                <div className="relative h-40 w-40 mx-auto mt-4">
                                    <Image
                                        src={featured.image}
                                        alt={featured.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <p className="mt-3 text-sm font-medium opacity-60">
                                    ${featured.price.toFixed(2)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── ROW 2: Product Cards strip ── */}
                {loading && (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 rounded-2xl aspect-[3/4] mb-4" />
                                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !error && rest.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {rest.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
