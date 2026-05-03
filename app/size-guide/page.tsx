"use client";

import { useState } from "react";
import theme from "@/theme";

const shapes = ["Square", "Oval", "Almond", "Stiletto", "Coffin", "Round"];

const sizeData = [
    { size: "XXS", width: "≤ 12mm", fits: "Very narrow nail beds, petite hands" },
    { size: "XS", width: "13–14mm", fits: "Narrow nail beds, slim fingers" },
    { size: "S", width: "15–16mm", fits: "Average-small nail beds" },
    { size: "M", width: "17–18mm", fits: "Average nail beds (most common)" },
    { size: "L", width: "19–20mm", fits: "Wider nail beds, broad fingers" },
    { size: "XL", width: "21–22mm", fits: "Very wide nail beds" },
];

const fingers = ["Thumb", "Index", "Middle", "Ring", "Pinky"];

const measureSteps = [
    {
        num: "01",
        title: "Gather your tools",
        desc: "You'll need a soft measuring tape or a thin strip of paper and a ruler.",
    },
    {
        num: "02",
        title: "Measure your nail width",
        desc: "Place the tape across the widest part of your nail — not the fingertip — and note the measurement in millimetres.",
    },
    {
        num: "03",
        title: "Repeat for each finger",
        desc: "Each finger is different. Measure all ten to build your complete size profile.",
    },
    {
        num: "04",
        title: "Use the table below",
        desc: "Match each measurement to our size chart. When between sizes, size up for press-ons, down for gel overlays.",
    },
];

export default function SizeGuidePage() {
    const [activeShape, setActiveShape] = useState("Almond");

    return (
        <main
            className="min-h-screen"
            style={{ backgroundColor: theme.colors.light, fontFamily: "'DM Sans', sans-serif", color: theme.colors.dark }}
        >
            {/* Hero */}
            <section className="py-24 px-6 text-center" style={{ backgroundColor: "#FAF5F0" }}>
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] mb-4" style={{ color: theme.colors.primary }}>
                    Find Your Fit
                </p>
                <h1
                    className="text-5xl md:text-6xl font-bold leading-none mb-6"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Nail <em className="italic" style={{ color: theme.colors.primary }}>Size</em> Guide
                </h1>
                <p className="max-w-md mx-auto text-sm leading-relaxed opacity-60">
                    The perfect press-on starts with the perfect fit. Follow our guide to find your exact size — no guessing required.
                </p>
            </section>

            {/* How to measure */}
            <section className="py-24 px-6 max-w-4xl mx-auto">
                <h2
                    className="text-3xl font-bold mb-14 text-center"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    How to Measure
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {measureSteps.map((s) => (
                        <div key={s.num} className="flex gap-6">
                            <span
                                className="text-4xl font-bold shrink-0 leading-none"
                                style={{ fontFamily: "'Playfair Display', serif", color: theme.colors.primary, opacity: 0.35 }}
                            >
                                {s.num}
                            </span>
                            <div>
                                <h3 className="font-semibold text-base mb-1">{s.title}</h3>
                                <p className="text-sm leading-relaxed opacity-60">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Size Chart */}
            <section className="py-24 px-6" style={{ backgroundColor: theme.colors.dark, color: theme.colors.light }}>
                <div className="max-w-4xl mx-auto">
                    <h2
                        className="text-3xl font-bold mb-14 text-center"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Size Chart
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: `1px solid rgba(255,255,255,0.12)` }}>
                                    <th className="text-left py-4 pr-8 uppercase tracking-widest text-xs opacity-50">Size</th>
                                    <th className="text-left py-4 pr-8 uppercase tracking-widest text-xs opacity-50">Nail Width</th>
                                    <th className="text-left py-4 uppercase tracking-widest text-xs opacity-50">Best For</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sizeData.map((row, i) => (
                                    <tr
                                        key={row.size}
                                        style={{
                                            borderBottom: `1px solid rgba(255,255,255,0.06)`,
                                            backgroundColor: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                                        }}
                                    >
                                        <td className="py-4 pr-8 font-bold" style={{ color: theme.colors.primary }}>{row.size}</td>
                                        <td className="py-4 pr-8 opacity-80">{row.width}</td>
                                        <td className="py-4 opacity-60">{row.fits}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Per-finger guide */}
                    <div className="mt-16">
                        <h3 className="text-xl font-bold mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Typical Per-Finger Sizing
                        </h3>
                        <div className="flex justify-center gap-4 flex-wrap">
                            {fingers.map((f, i) => {
                                const sizes = ["M", "M", "S", "XS", "XXS"];
                                return (
                                    <div key={f} className="text-center">
                                        <div
                                            className="w-14 h-20 rounded-t-full mx-auto mb-3 flex items-end justify-center pb-2 text-xs font-bold"
                                            style={{ backgroundColor: "rgba(255,255,255,0.06)", color: theme.colors.primary }}
                                        >
                                            {sizes[i]}
                                        </div>
                                        <p className="text-[10px] uppercase tracking-wider opacity-40">{f}</p>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-center text-xs opacity-40 mt-6">
                            ↑ Approximate sizes for an average hand. Always measure your own.
                        </p>
                    </div>
                </div>
            </section>

            {/* Shape guide */}
            <section className="py-24 px-6 max-w-4xl mx-auto">
                <h2
                    className="text-3xl font-bold mb-6 text-center"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Choose Your Shape
                </h2>
                <p className="text-center text-sm opacity-60 mb-12">
                    Shape is a matter of style — but some suit certain nail beds better than others.
                </p>
                <div className="flex flex-wrap gap-3 justify-center mb-10">
                    {shapes.map((shape) => (
                        <button
                            key={shape}
                            onClick={() => setActiveShape(shape)}
                            className="px-5 py-2 text-sm uppercase tracking-widest transition-all"
                            style={{
                                backgroundColor: activeShape === shape ? theme.colors.dark : "transparent",
                                color: activeShape === shape ? theme.colors.light : theme.colors.dark,
                                border: `1px solid ${theme.colors.dark}`,
                            }}
                        >
                            {shape}
                        </button>
                    ))}
                </div>

                {/* Shape descriptions */}
                {{
                    Square: "A clean, flat tip with sharp corners. Modern and bold — great for wider nail beds.",
                    Oval: "Softly rounded edges that elongate the finger. Universally flattering and timeless.",
                    Almond: "Tapered sides meeting a rounded point. Delicate and feminine, suits most hand shapes.",
                    Stiletto: "Dramatically pointed for maximum impact. Best for longer nail beds with good structure.",
                    Coffin: "Tapered sides with a flat, squared-off tip — a sleek, fashion-forward favourite.",
                    Round: "Follows the natural curve of the fingertip. Practical, classic, and always in style.",
                }[activeShape] && (
                        <div
                            className="max-w-md mx-auto text-center p-8 rounded-sm"
                            style={{ backgroundColor: "#FAF5F0" }}
                        >
                            <p className="font-semibold text-base mb-2">{activeShape}</p>
                            <p className="text-sm leading-relaxed opacity-70">
                                {{
                                    Square: "A clean, flat tip with sharp corners. Modern and bold — great for wider nail beds.",
                                    Oval: "Softly rounded edges that elongate the finger. Universally flattering and timeless.",
                                    Almond: "Tapered sides meeting a rounded point. Delicate and feminine, suits most hand shapes.",
                                    Stiletto: "Dramatically pointed for maximum impact. Best for longer nail beds with good structure.",
                                    Coffin: "Tapered sides with a flat, squared-off tip — a sleek, fashion-forward favourite.",
                                    Round: "Follows the natural curve of the fingertip. Practical, classic, and always in style.",
                                }[activeShape]}
                            </p>
                        </div>
                    )}
            </section>
        </main>
    );
}