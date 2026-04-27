"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
    {
        id: 1,
        image: "/hero1.png",
        title: "Mother’s Day Gifts",
        subtitle:
            "Every mom is a hot mom with chic nails that save time and keep you fabulous.",
    },
    {
        id: 2,
        image: "/nails2.png",
        title: "Summer Nail Collection",
        subtitle: "Fresh, bold, and ready to shine all season long.",
    },
    {
        id: 3,
        image: "/nails3.png",
        title: "Luxury Press-On Nails",
        subtitle: "Salon-quality nails in minutes — no mess, no stress.",
    },
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);

    // Auto slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % slides.length);
    };

    return (
        <section className="relative w-full h-screen overflow-hidden">

            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${index === current ? "opacity-100 z-10" : "opacity-0"
                        }`}
                >
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        priority
                        className="object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30" />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center px-6 md:px-16">
                        <div className="max-w-xl text-white">
                            <p className="text-sm mb-2">★ 4.9 FROM 5000+ REVIEWS</p>

                            <h1 className="text-4xl md:text-6xl font-serif mb-4">
                                {slide.title}
                            </h1>

                            <p className="text-lg mb-6">{slide.subtitle}</p>

                            <button className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition">
                                SHOP NOW
                            </button>
                        </div>
                    </div>
                </div>
            ))}



            {/* Dots */}
            <div className="absolute bottom-6 w-full flex justify-center gap-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-1 rounded-full transition-all ${index === current ? "w-6 bg-white" : "w-3 bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}