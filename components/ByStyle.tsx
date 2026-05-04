"use client";

import theme from "@/theme";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const promos = [
    {
        image: "https://images.unsplash.com/photo-1754799670410-b282791342c3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHx8",
        title: "Hot Girl Summer",
        subtitle: "The Neon Collection",
        description: "Bold pops of color and playful patterns designed for golden hour.",
    },
    {
        image: "https://images.unsplash.com/photo-1777287852750-53eb2ca506e9?q=80&w=1114&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Bloom for Yourself",
        subtitle: "The Botanical Series",
        description: "Soft pastels and intricate floral hand-pressed details.",
    },
];

function Card({ promo }: { promo: typeof promos[0] }) {

    return (
        <div className="flex flex-col group cursor-pointer">
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-sm aspect-[4/5] mb-6">
                <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                {/* Subtle border overlay that appears on hover */}
                <div className="absolute inset-0 border-[0px] group-hover:border-[12px] border-white/20 transition-all duration-500" />
            </div>

            {/* Content Below Image */}
            <div className="flex flex-col items-start px-1">
                <span
                    style={{ color: theme.colors.primary }}
                    className="text-[10px] uppercase tracking-[0.3em] font-bold mb-2"
                >
                    {promo.subtitle}
                </span>

                <h3
                    style={{ color: theme.colors.dark }}
                    className="text-3xl font-serif mb-3 leading-tight"
                >
                    {promo.title}
                </h3>

                <p
                    style={{ color: theme.colors.dark }}
                    className="text-sm opacity-70 leading-relaxed mb-6 max-w-[90%]"
                >
                    {promo.description}
                </p>


            </div>
        </div>
    );
}

export default function ByStyle() {
    const [current, setCurrent] = useState(0);
    const touchStartX = useRef(0);

    const prev = () => setCurrent((c) => (c - 1 + promos.length) % promos.length);
    const next = () => setCurrent((c) => (c + 1) % promos.length);
    const router = useRouter();
    const handleNavigation = () => {
        router.push(`/products`);
    };
    return (
        <section
            style={{ backgroundColor: theme.colors.light }}
            className="px-6 md:px-12 py-10 w-full"
        >
            <div className="max-w-7xl mx-auto">
                {/* Minimalist Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-xl">
                        <h2
                            style={{ color: theme.colors.dark }}
                            className="text-5xl md:text-6xl font-serif leading-[1.1]"
                        >
                            Curated for <br />
                            <em className="italic" style={{ color: theme.colors.primary }}>Your Style</em>
                        </h2>
                    </div>
                    <p
                        style={{ color: theme.colors.dark }}
                        className="text-sm opacity-60 md:text-right max-w-xs leading-relaxed"
                    >
                        Every collection is a mood. Discover the press-on sets that match your current aesthetic.
                    </p>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:grid grid-cols-2 gap-16">
                    {promos.map((promo, i) => (
                        <Card key={i} promo={promo} />
                    ))}
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden">
                    <div
                        className="overflow-hidden"
                        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                        onTouchEnd={(e) => {
                            const diff = touchStartX.current - e.changedTouches[0].clientX;
                            if (diff > 50) next();
                            else if (diff < -50) prev();
                        }}
                    >
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${current * 100}%)` }}
                        >
                            {promos.map((promo, i) => (
                                <div key={i} className="min-w-full px-2">
                                    <Card promo={promo} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Minimalist Pagination dots */}
                    <div className="flex justify-center gap-3 mt-10">
                        {promos.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`h-[2px] transition-all duration-500 ${current === i ? "w-12" : "w-4"}`}
                                style={{
                                    backgroundColor: current === i ? theme.colors.primary : `${theme.colors.dark}20`
                                }}
                            />
                        ))}
                    </div>
                </div>
                {/* Elegant Text Link replacement for Button */}
                <div
                    onClick={() => { handleNavigation() }}
                    style={{ color: theme.colors.dark }}
                    className="flex items-center gap-2 group/link text-[11px] font-bold uppercase tracking-[0.2em] relative"
                >
                    <span>Explore Style</span>
                    <div className="w-6 h-[1px] bg-current transition-all duration-300 group-hover/link:w-10" />

                    {/* Hover Underline Animation */}
                    <div
                        className="absolute -bottom-1 left-0 h-[1px] w-0 transition-all duration-300 group-hover/link:w-full"
                        style={{ backgroundColor: theme.colors.primary }}
                    />
                </div>
            </div>
        </section>
    );
}