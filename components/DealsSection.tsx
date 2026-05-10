"use client";

import theme from "@/theme";
import { useRef, useState } from "react";



const deals = [
    {
        image: "/deal1.png",
        label: "10% off",
        description: "£20 minimum order",
        code: "WELCOME10",
    },
    {
        image: "/deal2.png",
        label: "£5 off",
        description: "On orders over £30",
        code: "SAVE5",
    },
    {
        image: "https://media.istockphoto.com/id/1543544136/photo/womans-hand-with-trendy-polka-dot-summer-manicure.jpg?s=612x612&w=0&k=20&c=710sjm-AvbteA8TRkv3zXMYwR_XdOJyBFrQF1K7EtwU=",
        label: "£9.99 off",
        description: "Free shipping on orders over £70",
        code: "FREESHIP",
    },
];

function Card({ deal }: { deal: typeof deals[0] }) {
    return (
        <div
            className="relative rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-square md:aspect-[3/4] lg:aspect-[4/5] w-full group shadow-sm transition-all duration-500 hover:shadow-xl"
            style={{ backgroundColor: theme.colors.light }}
        >
            <img
                src={deal.image}
                alt={deal.label}
                className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#422B23]/90 via-[#422B23]/30 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 sm:pb-10 gap-3 px-4 text-center">
                <div className="flex flex-col items-center">
                    <span
                        className="uppercase tracking-[0.25em] text-[9px] sm:text-xs mb-1"
                        style={{ color: theme.colors.subtitle }}
                    >
                        Special Offer
                    </span>
                    <div
                        className="px-3 sm:px-4 py-1 rounded-full"
                        style={{ backgroundColor: theme.colors.primary }}
                    >
                        <span className="text-white text-xl sm:text-2xl lg:text-3xl font-semibold">
                            {deal.label}
                        </span>
                    </div>
                    <p className="text-white/80 text-[10px] sm:text-xs mt-2 tracking-wide">
                        {deal.description}
                    </p>
                </div>

                <div className="h-px w-8 sm:w-12 opacity-50" style={{ backgroundColor: theme.colors.muted }} />

                <p className="text-[10px] sm:text-xs tracking-[0.3em] font-medium text-white/90">
                    CODE: <span className="text-white">{deal.code}</span>
                </p>
            </div>
        </div>
    );
}

export default function DealsSection() {
    const [current, setCurrent] = useState(0);
    const touchStartX = useRef(0);

    const prev = () => setCurrent((c) => (c - 1 + deals.length) % deals.length);
    const next = () => setCurrent((c) => (c + 1) % deals.length);

    return (
        <section className="w-full px-4 sm:px-8 py-12 md:py-20 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 md:mb-14 text-center px-4">
                    <h2
                        className="text-2xl sm:text-3xl md:text-5xl font-serif mb-3"
                        style={{ color: theme.colors.dark }}
                    >
                        Exclusive Seasonal Savings
                    </h2>
                    <p
                        className="text-[10px] sm:text-xs md:text-sm tracking-[0.2em] uppercase font-medium"
                        style={{ color: theme.colors.muted }}
                    >
                        Handpicked deals for your next journey
                    </p>
                </div>

                {/* Desktop/Tablet Grid: Shows 3 columns from 'md' breakpoint up */}
                <div className="hidden md:grid md:grid-cols-3 gap-4 lg:gap-8">
                    {deals.map((deal, i) => (
                        <Card key={i} deal={deal} />
                    ))}
                </div>

                {/* Mobile Carousel: Shows only on screens smaller than 'md' (768px) */}
                <div className="md:hidden relative">
                    <div
                        className="overflow-visible"
                        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                        onTouchEnd={(e) => {
                            const diff = touchStartX.current - e.changedTouches[0].clientX;
                            if (diff > 50) next();
                            else if (diff < -50) prev();
                        }}
                    >
                        <div
                            className="flex transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                            style={{ transform: `translateX(-${current * 100}%)` }}
                        >
                            {deals.map((deal, i) => (
                                <div key={i} className="min-w-full px-2">
                                    <Card deal={deal} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows - Hidden on touch devices usually, but kept for UI cues */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 pointer-events-none">
                        <button
                            onClick={prev}
                            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg pointer-events-auto backdrop-blur-sm transition-transform active:scale-90"
                            style={{ backgroundColor: `${theme.colors.light}CC`, color: theme.colors.dark }}
                        >
                            <span className="text-xl">←</span>
                        </button>
                        <button
                            onClick={next}
                            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg pointer-events-auto backdrop-blur-sm transition-transform active:scale-90"
                            style={{ backgroundColor: `${theme.colors.light}CC`, color: theme.colors.dark }}
                        >
                            <span className="text-xl">→</span>
                        </button>
                    </div>

                    {/* Dynamic Pagination Dots */}
                    <div className="flex justify-center items-center gap-3 mt-8">
                        {deals.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`transition-all duration-500 rounded-full border-none cursor-pointer ${i === current ? "w-10 h-1.5" : "w-1.5 h-1.5 opacity-40"
                                    }`}
                                style={{
                                    backgroundColor: i === current ? theme.colors.primary : theme.colors.dark
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}