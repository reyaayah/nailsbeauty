"use client";

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
        <div className="relative rounded-xl overflow-hidden aspect-video bg-white w-full ">
            <img
                src={promo.image}
                alt={`Buy ${promo.buy} `}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 flex flex-col items-center justify-end mb-6 gap-2 px-4">
                <div className="flex items-center gap-1.5">
                    <span className="text-white text-2xl md:text-3xl font-serif">
                        {promo.buy}
                    </span>

                </div>
                <div className="text-black text-[11px] px-4 py-3 rounded-md md:text-xs tracking-widest bg-white">
                    SHOP COLLECTION
                </div>
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
        <section className="px-10 py-8 w-full mx-auto">

            <h2 className="text-center text-3xl md:text-4xl font-serif text-gray-900 mb-10">
                Curated for Your Style
            </h2>
            {/* Desktop: 2 columns */}
            <div className="hidden md:flex gap-4">
                {promos.map((promo, i) => (
                    <div key={i} className="flex-1">
                        <Card promo={promo} />
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
                        {promos.map((promo, i) => (
                            <div key={i} className="min-w-full">
                                <Card promo={promo} />
                            </div>
                        ))}
                    </div>
                </div>


            </div>

        </section>
    );
}