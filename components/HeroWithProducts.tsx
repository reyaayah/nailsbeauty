"use client";

import Image from "next/image";
import { Plus, Star, ArrowUpRight } from "lucide-react";

// Themed Constants
const colors = {
    primary: "#DBA1A2",
    dark: "#422B23",
    light: "#F7F3ED",
    muted: "#C2C6B9",
    subtitle: "#EFD8D6",
};

type Product = {
    id: number;
    title: string;
    price: string;
    image: string;
    category: string;
};

const products: Product[] = [
    { id: 1, title: "ProTouch Kit Max", price: "$24.99", image: "/product1.png", category: "Essentials" },
    { id: 2, title: "Ersa Nails Pro", price: "$19.99", image: "/product2.png", category: "Pro Line" },
    { id: 3, title: "ProTouch Mini", price: "$17.99", image: "/product3.png", category: "Starter" },
    { id: 4, title: "Nail Essentials", price: "$29.99", image: "/product1.png", category: "New Arrival" },
];

export default function HeroWithProducts() {
    return (
        <div
            className="min-h-screen font-sans w-full"
            style={{ backgroundColor: colors.light, color: colors.dark }}
        >
            <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">

                {/* --- DYNAMIC GRID LAYOUT --- */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 ">

                    {/* 1. THE HERO BLOCK (Span 8) */}
                    <div className="md:col-span-8 md:row-span-2 relative rounded-[2rem] overflow-hidden group">
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
                                style={{ backgroundColor: colors.subtitle, color: colors.dark }}
                            >
                                Organic Collection
                            </span>
                            <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight max-w-lg">
                                Nail Care <br /> Redefined.
                            </h1>
                            <button
                                className="flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-transform hover:scale-105"
                                style={{ backgroundColor: colors.primary, color: "white" }}
                            >
                                SHOP THE DROP <ArrowUpRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* 2. STATS/INFO BLOCK (Span 4) */}
                    <div
                        className="md:col-span-4 p-8 rounded-[2rem] flex flex-col justify-center border"
                        style={{ borderColor: colors.muted, backgroundColor: 'white' }}
                    >
                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill={colors.primary} color={colors.primary} />
                            ))}
                        </div>
                        <h2 className="text-2xl font-serif mb-2">Loved by 10k+ Stylists</h2>
                        <p className="opacity-70 text-sm leading-relaxed">
                            Our formula is vegan, cruelty-free, and designed for professional longevity.
                        </p>
                    </div>

                    {/* 3. PRODUCT FEATURE BLOCK (Span 4) */}
                    <div
                        className="md:col-span-4 rounded-[2rem] p-6 relative overflow-hidden flex items-center justify-center border"
                        style={{ backgroundColor: colors.subtitle + "50", borderColor: colors.subtitle }}
                    >
                        <div className="text-center">
                            <p className="text-xs uppercase tracking-widest mb-1 opacity-60">Top Rated</p>
                            <p className="text-xl font-bold">{products[0].title}</p>
                            <div className="relative h-40 w-40 mx-auto mt-4">
                                <Image src={products[0].image} alt="feature" fill className="object-contain" />
                            </div>
                        </div>
                    </div>

                    {/* --- LOWER PRODUCT FEED --- */}
                    {products.slice(1).map((product, idx) => (
                        <div
                            key={product.id}
                            className="md:col-span-4 rounded-[2rem] bg-white p-6 group hover:shadow-xl transition-all border border-transparent hover:border-muted"
                        >
                            <div className="relative h-56 w-full mb-6 rounded-2xl bg-stone-50 overflow-hidden">
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <button
                                    className="absolute top-4 right-4 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm"
                                    style={{ backgroundColor: colors.light }}
                                >
                                    <Plus size={20} color={colors.dark} />
                                </button>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: colors.muted }}>{product.category}</p>
                                    <h3 className="font-bold text-lg leading-none">{product.title}</h3>
                                </div>
                                <p className="font-serif text-xl" style={{ color: colors.primary }}>{product.price}</p>
                            </div>
                        </div>
                    ))}

                </div>
            </main>
        </div>
    );
}