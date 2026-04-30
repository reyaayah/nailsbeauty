"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import theme from "@/theme";
import { useRouter } from "next/navigation";

const slides = [
    {
        id: 1,
        image: "/nails1.png",
        title: "Mother’s Day Edit",
        subtitle:
            "Because effortless beauty should still feel luxurious. Press-on nails that save time and elevate your look.",
        tag: "LIMITED EDITION",
    },
    {
        id: 2,
        image: "/nails2.png",
        title: "Summer Essentials",
        subtitle:
            "Soft tones, bold finishes — your perfect summer nails without the salon wait.",
        tag: "NEW ARRIVAL",
    },
    {
        id: 3,
        image: "/nails3.png",
        title: "Luxury in Minutes",
        subtitle:
            "Reusable, durable, and stunning. Salon-quality nails from the comfort of home.",
        tag: "BESTSELLER",
    },
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section
            className="relative w-full h-screen overflow-hidden"
            style={{ backgroundColor: theme.colors.light }}
        >
            {/* SLIDES */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-700 ${index === current ? "opacity-100 z-10" : "opacity-0"
                        }`}
                >
                    {/* IMAGE */}
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        priority
                        className="object-cover"
                    />

                    {/* OVERLAY */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(to right,
                ${theme.colors.dark}cc,
                ${theme.colors.dark}66,
                transparent
              )`,
                        }}
                    />

                    {/* CONTENT */}
                    <div
                        className="absolute inset-0 flex items-center"
                        style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
                    >
                        <div className="max-w-xl md:px-20">

                            {/* TAG */}
                            <span
                                className="inline-block mb-4 px-4 py-1 text-xs tracking-widest rounded-full"
                                style={{
                                    backgroundColor: theme.colors.primary,
                                    color: theme.colors.dark,
                                }}
                            >
                                {slide.tag}
                            </span>

                            {/* TITLE */}
                            <h1
                                className="text-4xl md:text-6xl font-serif leading-tight mb-6"
                                style={{ color: theme.colors.light }}
                            >
                                {slide.title}
                            </h1>

                            {/* SUBTITLE */}
                            <p
                                className="text-lg md:text-xl mb-8"
                                style={{ color: theme.colors.subtitle }}
                            >
                                {slide.subtitle}
                            </p>

                            {/* BUTTONS */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => router.push("/collections")}
                                    className="px-6 py-3 rounded-full font-medium transition hover:opacity-90"
                                    style={{
                                        backgroundColor: theme.colors.primary,
                                        color: theme.colors.dark,
                                    }}
                                >
                                    Shop Now
                                </button>

                                <button
                                    className="px-6 py-3 rounded-full border transition"
                                    style={{
                                        borderColor: theme.colors.muted,
                                        color: theme.colors.light,
                                    }}
                                    onMouseOver={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                                            theme.colors.muted;
                                        (e.currentTarget as HTMLButtonElement).style.color =
                                            theme.colors.dark;
                                    }}
                                    onMouseOut={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                                            "transparent";
                                        (e.currentTarget as HTMLButtonElement).style.color =
                                            theme.colors.light;
                                    }}
                                >
                                    Explore
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* DOTS */}
            <div className="absolute bottom-8 w-full flex justify-center gap-3 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className="h-1 rounded-full transition-all duration-300"
                        style={{
                            width: index === current ? "2rem" : "0.75rem",
                            backgroundColor:
                                index === current
                                    ? theme.colors.primary
                                    : theme.colors.muted,
                        }}
                    />
                ))}
            </div>
        </section>
    );
}