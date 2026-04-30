"use client";

import { useState } from "react";
import theme from "@/theme";
import Image from "next/image";
import { Heart, ChevronDown, SlidersHorizontal, ArrowRight, Check } from "lucide-react";
import { products } from "@/data/product";

export default function AllProductsPage() {
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const filterOptions = {
        length: ["Extra-long", "Long", "Med", "Short"],
        shape: ["Almond", "Coffin", "Oval", "Square", "Squoval"],
        style: ["3D", "Aura", "Cat Eye", "Chrome", "French Tip", "Glitter"]
    };

    const toggleFilterSelection = (option: string) => {
        setSelectedFilters(prev =>
            prev.includes(option) ? prev.filter(i => i !== option) : [...prev, option]
        );
    };
    return (
        <main className="min-h-screen pt-24 pb-20 font-sans" style={{ backgroundColor: theme.colors.light }}>
            {/* Hero Header */}
            <div className="max-w-[1400px] mx-auto px-6 mb-16 text-center">
                <h1 className="text-5xl md:text-6xl font-serif mb-5 tracking-tight" style={{ color: theme.colors.dark }}>
                    The Collection
                </h1>
                <nav className="text-[12px] uppercase tracking-[0.3em] flex justify-center gap-3 items-center" style={{ color: theme.colors.muted }}>
                    <span>Home</span> <span>/</span>
                    <span className="font-bold" style={{ color: theme.colors.dark }}>All Products</span>
                </nav>
            </div>

            {/* Filter Bar with Dropdowns */}
            <div className="sticky top-[80px] z-40 bg-white/90 backdrop-blur-md border-y border-neutral-200/50 mb-12 shadow-sm">
                <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex gap-4 md:gap-8 items-center">
                        <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.15em] mr-4" style={{ color: theme.colors.dark }}>
                            <SlidersHorizontal size={16} /> <span className="hidden sm:inline">Filter:</span>
                        </div>

                        {Object.entries(filterOptions).map(([key, options]) => (
                            <div key={key} className="relative">
                                <button
                                    onClick={() => setActiveFilter(activeFilter === key ? null : key)}
                                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest py-2 px-3 rounded-md transition-colors"
                                    style={{
                                        color: theme.colors.dark,
                                        backgroundColor: activeFilter === key ? theme.colors.subtitle : 'transparent'
                                    }}
                                >
                                    {key} <ChevronDown size={14} className={`transition-transform duration-300 ${activeFilter === key ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {activeFilter === key && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setActiveFilter(null)} />
                                        <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-2xl border border-neutral-100 z-20 py-3 rounded-sm animate-in fade-in slide-in-from-top-2 duration-200">
                                            {options.map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => toggleFilterSelection(option)}
                                                    className="w-full flex items-center justify-between px-5 py-2.5 text-[13px] hover:bg-neutral-50 transition-colors"
                                                    style={{ color: theme.colors.dark }}
                                                >
                                                    <span className={selectedFilters.includes(option) ? "font-bold" : "font-normal"}>
                                                        {option}
                                                    </span>
                                                    {selectedFilters.includes(option) && (
                                                        <Check size={14} style={{ color: theme.colors.primary }} />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-[12px] font-medium hidden lg:block" style={{ color: theme.colors.muted }}>
                            {products.length} Designs
                        </span>

                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20">
                    {products.map((product) => (
                        <div key={product.id} className="group relative">
                            {/* Image Wrapper */}
                            <div className="relative aspect-[4/5] overflow-hidden shadow-sm transition-all duration-500 group-hover:shadow-xl" style={{ backgroundColor: theme.colors.subtitle }}>
                                {product.isNew && (
                                    <span className="absolute top-4 left-4 z-10 text-white text-[10px] font-bold px-3 py-1 tracking-widest" style={{ backgroundColor: theme.colors.primary }}>
                                        NEW
                                    </span>
                                )}

                                <button className="absolute top-4 right-4 z-10 hover:scale-110 transition-transform" style={{ color: theme.colors.dark }}>
                                    <Heart size={20} strokeWidth={1.5} />
                                </button>

                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-6 transition-transform duration-1000 group-hover:scale-105"
                                />

                                {/* Premium Quick Add Overlay */}
                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                                    <button className="w-full text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2"
                                        style={{ backgroundColor: theme.colors.dark }}>
                                        Add To Bag <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Text Info */}
                            <div className="mt-6 text-center lg:text-left">
                                <h3 className="text-[17px] font-medium tracking-tight mb-1" style={{ color: theme.colors.dark }}>
                                    {product.name}
                                </h3>
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-1">
                                    <p className="text-[15px] font-bold" style={{ color: theme.colors.primary }}>
                                        ${product.price.toFixed(2)} USD
                                    </p>
                                    {product.discount && (
                                        <span className="text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded" style={{ backgroundColor: theme.colors.subtitle, color: theme.colors.dark }}>
                                            {product.discount} OFF
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </main>
    );
}