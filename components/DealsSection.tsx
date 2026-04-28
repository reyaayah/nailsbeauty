"use client";

import { useRef, useState, useEffect } from "react";

const deals = [
    {
        image: "/deal1.png",
        buy: "$99",
        get: "10",
        code: "VACAYREADY10",
    },
    {
        image: "/deal2.png",
        buy: "$149",
        get: "20",
        code: "VACAYREADY20",
    },
    {
        image: "/deal3.png",
        buy: "$249",
        get: "25",
        code: "VACAYREADY25",
    },
];

function Card({ deal }: { deal: typeof deals[0] }) {
    return (
        <div className="relative rounded-xl overflow-hidden aspect-video bg-white w-full ">
            <img
                src={deal.image}
                alt={`Buy ${deal.buy} Get ${deal.get}% off`}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4">
                <div className="flex items-center gap-1.5">
                    <span className="text-white text-2xl md:text-3xl font-serif">
                        Buy {deal.buy}
                    </span>
                    <div className="bg-[#c8102e] flex items-start gap-1 px-2 py-1">
                        <span className="text-white text-2xl md:text-3xl font-serif leading-none">
                            Get {deal.get}
                        </span>
                        <div className="flex flex-col leading-none pt-1">
                            <span className="text-white text-[9px] font-semibold">%</span>
                            <span className="text-white text-[9px] font-semibold">off</span>
                        </div>
                    </div>
                </div>
                <p className="text-white text-[11px] md:text-xs tracking-widest">
                    CODE: {deal.code}
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
        <section className="px-4 py-8 max-w-7xl mx-auto">

            {/* Desktop: 3 columns */}
            <div className="hidden md:flex gap-4">
                {deals.map((deal, i) => (
                    <div key={i} className="flex-1">
                        <Card deal={deal} />
                    </div>
                ))}
            </div>

            {/* Mobile: carousel */}
            <div className="md:hidden relative">
                <div
                    className="overflow-hidden rounded-xl"
                    onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                    onTouchEnd={(e) => {
                        const diff = touchStartX.current - e.changedTouches[0].clientX;
                        if (diff > 40) next();
                        else if (diff < -40) prev();
                    }}
                >
                    <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(-${current * 100}%)` }}
                    >
                        {deals.map((deal, i) => (
                            <div key={i} className="min-w-full">
                                <Card deal={deal} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Arrows */}
                <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/45 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg border-none cursor-pointer"
                >
                    ‹
                </button>
                <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/45 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg border-none cursor-pointer"
                >
                    ›
                </button>

                {/* Dots */}
                <div className="flex justify-center gap-1.5 mt-3">
                    {deals.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`w-2 h-2 rounded-full border-none cursor-pointer transition-colors ${i === current ? "bg-[#c8102e]" : "bg-gray-300"
                                }`}
                        />
                    ))}
                </div>
            </div>

        </section>
    );
}