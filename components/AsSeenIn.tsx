"use client";

import theme from "@/theme";
import { useState } from "react";

const publications = [
    { name: "BYRDIE", quote: "The most natural-looking press-ons we've tested.", font: "font-bold tracking-[0.3em] text-lg" },
    { name: "INSIDER", quote: "A game changer for at-home manicures.", font: "font-black tracking-tight text-xl" },
    { name: "ELLE", quote: "The high-fashion silhouette every editor is wearing.", font: "font-light tracking-[0.4em] text-2xl italic" },
    { name: "teenVOGUE", quote: "Affordable luxury for the modern nail enthusiast.", custom: true },
    { name: "GLAMOUR", quote: "Salon quality in under ten minutes.", font: "font-serif font-black tracking-widest text-xl" },
    { name: "VOGUE", quote: "Redefining the standard of DIY beauty.", font: "font-serif tracking-[0.2em] text-2xl" },
];

export default function AsSeenIn() {
    const [activeQuote, setActiveQuote] = useState(publications[0].quote);

    return (
        <section
            className="py-24 w-full transition-colors duration-700"
            style={{ backgroundColor: theme.colors.light }}
        >
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Side: The Quote Display */}
                    <div className="space-y-6">
                        <span
                            style={{ color: theme.colors.primary }}
                            className="text-xs uppercase tracking-[0.5em] font-bold"
                        >
                            The Press Room
                        </span>
                        <div className="h-[200px] flex items-center">
                            <h3
                                key={activeQuote}
                                className="text-3xl md:text-4xl font-serif italic leading-snug animate-in fade-in slide-in-from-bottom-4 duration-700"
                                style={{ color: theme.colors.dark }}
                            >
                                "{activeQuote}"
                            </h3>
                        </div>
                    </div>

                    {/* Right Side: The Interactive Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
                        {publications.map((pub, i) => (
                            <button
                                key={i}
                                onMouseEnter={() => setActiveQuote(pub.quote)}
                                className="bg-white aspect-[3/2] flex items-center justify-center p-4 transition-all duration-300 group hover:z-10 relative overflow-hidden"
                            >
                                {/* Hover Background Effect */}
                                <div
                                    className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-5"
                                    style={{ backgroundColor: theme.colors.primary }}
                                />

                                <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                                    {pub.custom ? (
                                        <span className="text-lg font-bold tracking-tighter">
                                            <span style={{ color: theme.colors.primary }}>teen</span>
                                            <span style={{ color: theme.colors.dark }}>VOGUE</span>
                                        </span>
                                    ) : (
                                        <span
                                            className={`${pub.font} text-center leading-none`}
                                            style={{ color: theme.colors.dark }}
                                        >
                                            {pub.name}
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}