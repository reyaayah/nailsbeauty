"use client";

import theme from "@/theme";
import { Heart, RefreshCw, Sparkles, Truck } from "lucide-react";

const features = [
    {
        icon: <Heart size={22} strokeWidth={1.2} />,
        title: "Artisan Made",
        description: "Hand-painted with premium salon-grade gel for a flawless finish.",
    },
    {
        icon: <RefreshCw size={22} strokeWidth={1.2} />,
        title: "Endless Wear",
        description: "Durable design, crafted specifically for multiple applications.",
    },
    {
        icon: <Sparkles size={22} strokeWidth={1.2} />,
        title: "4-Week Hold",
        description: "Salon-strength durability using our signature solid glue.",
    },
    {
        icon: <Truck size={22} strokeWidth={1.2} />,
        title: "Fast Delivery",
        description: "Complimentary shipping on all orders over £70.",
    },
];

export default function Features() {
    return (
        <section
            className="w-full py-6 md:py-14 px-6"
            style={{ backgroundColor: "#F9F8F6" }} // Soft Paper Color
        >
            <div className="max-w-7xl mx-auto">
                {/* Asymmetrical Header */}
                <div className="flex flex-col md:flex-row items-baseline justify-between mb-20 gap-8">
                    <h2
                        className="text-5xl md:text-6xl font-serif leading-tight"
                        style={{ color: theme.colors.dark }}
                    >
                        Quality <br />
                        <span className="italic pl-12 md:pl-20">Redefined.</span>
                    </h2>
                    <div className="max-w-xs">
                        <div
                            className="h-1 w-12 mb-6"
                            style={{ backgroundColor: theme.colors.primary }}
                        />
                        <p style={{ color: theme.colors.muted }} className="text-sm leading-relaxed uppercase tracking-widest">
                            We believe in beauty without compromise. Professional results, from the comfort of home.
                        </p>
                    </div>
                </div>

                {/* Minimalist Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-black/10">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className={`py-2 lg:py-4 group transition-all duration-500
                                ${i !== 3 ? 'lg:border-r border-black/10 lg:pr-8' : ''}
                                ${i !== 0 ? 'lg:pl-8' : ''}
                                border-b lg:border-b-0 border-black/10
                            `}
                        >
                            {/* Icon with Floating Effect */}
                            <div
                                style={{ color: theme.colors.dark }}
                                className="mb-10 relative inline-block"
                            >
                                <div className="relative z-10 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
                                    {feature.icon}
                                </div>
                                {/* Decorative "Shadow" Icon */}
                                <div
                                    style={{ color: theme.colors.primary }}
                                    className="absolute inset-0 translate-x-1 translate-y-1 opacity-0 group-hover:opacity-20 transition-all duration-500 blur-[1px]"
                                >
                                    {feature.icon}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3
                                    className="text-xl font-serif tracking-tight"
                                    style={{ color: theme.colors.dark }}
                                >
                                    {feature.title}
                                </h3>
                                <p
                                    style={{ color: theme.colors.muted }}
                                    className="text-sm leading-relaxed font-light group-hover:text-black transition-colors"
                                >
                                    {feature.description}
                                </p>
                            </div>

                            {/* Corner Accent that appears on hover */}
                            <div className="relative mt-8 h-8 w-8 overflow-hidden">
                                <div
                                    style={{ borderColor: theme.colors.primary }}
                                    className="absolute bottom-0 left-0 w-full h-full border-b border-l scale-0 group-hover:scale-100 transition-transform duration-500 origin-bottom-left"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}