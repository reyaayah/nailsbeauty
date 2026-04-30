"use client";

import theme from "@/theme";
import { useRef, useState } from "react";

const promos = [
    {
        image: "/deal1.png",
        buy: "Hot Girl Summer",
    },
    {
        image: "/deal2.png",
        buy: "Bloom for yourself",
    },
];

function Card({ promo }: { promo: typeof promos[0] }) {
    return (
        <div className="relative rounded-2xl overflow-hidden aspect-[4/5] md:aspect-video bg-white w-full group cursor-pointer">
            {/* Image with hover zoom */}
            <img
                src={promo.image}
                alt={`Buy ${promo.buy}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 gap-5 px-6">
                <div className="text-center">
                    <span
                        className="text-white text-3xl md:text-4xl font-serif italic"
                    >
                        {promo.buy}
                    </span>
                </div>

                <button
                    style={{
                        backgroundColor: "white",
                        color: theme.colors.dark
                    }}
                    className="px-6 py-3 rounded-full text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#DBA1A2] hover:text-white transform group-hover:scale-105 shadow-xl"
                >
                    SHOP COLLECTION
                </button>
            </div>
        </div>
    );
}

export default function ByStyle() {
    const [current, setCurrent] = useState(0);
    const touchStartX = useRef(0);

    const prev = () => setCurrent((c) => (c - 1 + promos.length) % promos.length);
    const next = () => setCurrent((c) => (c + 1) % promos.length);

    return (
        <section
            style={{ backgroundColor: theme.colors.light }}
            className="px-6 md:px-12 py-20 w-full"
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center mb-12 text-center">
                    <h2
                        style={{ color: theme.colors.dark }}
                        className="text-4xl md:text-5xl font-serif mb-4"
                    >
                        Curated for Your Style
                    </h2>
                    <div
                        style={{ backgroundColor: theme.colors.muted }}
                        className="h-[1px] w-24 opacity-50"
                    />
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:grid grid-cols-2 gap-8">
                    {promos.map((promo, i) => (
                        <Card key={i} promo={promo} />
                    ))}
                </div>

                {/* Mobile Carousel */}
                <div className="md:hidden relative">
                    <div
                        className="overflow-hidden rounded-2xl shadow-2xl"
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
                                <div key={i} className="min-w-full">
                                    <Card promo={promo} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {promos.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`h-1.5 transition-all duration-300 rounded-full ${current === i ? "w-8" : "w-2"
                                    }`}
                                style={{
                                    backgroundColor: current === i ? theme.colors.primary : theme.colors.muted
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}