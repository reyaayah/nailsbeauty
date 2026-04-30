"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import theme from "@/theme";

const reviews = [
    { id: 1, name: "Sarah J.", text: "The quality exceeded my expectations. Truly a premium experience!", role: "Verified Buyer" },
    { id: 2, name: "Marcus T.", text: "Beautiful design and seamless functionality. Highly recommend to everyone.", role: "Interior Designer" },
    { id: 3, name: "Elena R.", text: "Customer support was incredibly helpful. I'm a customer for life.", role: "Regular Client" },
    { id: 4, name: "David L.", text: "Fast shipping and the product looks even better in person.", role: "Architect" },
];

export default function ReviewCarousel() {
    const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" });

    return (
        <section
            className="py-16 px-4 w-full"
            style={{ backgroundColor: theme.colors.light }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold mb-2" style={{ color: theme.colors.dark }}>
                        Customer Stories
                    </h2>
                    <div className="h-1 w-20 mx-auto" style={{ backgroundColor: theme.colors.primary }}></div>
                </div>

                {/* Carousel Viewport */}
                <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
                    <div className="flex">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.33%] px-4"
                            >
                                <div
                                    className="h-full p-8 rounded-2xl shadow-sm border transition-transform duration-300 hover:-translate-y-1"
                                    style={{
                                        backgroundColor: "#ffffff",
                                        borderColor: theme.colors.subtitle
                                    }}
                                >
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} style={{ color: theme.colors.primary }}>★</span>
                                        ))}
                                    </div>

                                    <p className="italic mb-6" style={{ color: theme.colors.dark }}>
                                        "{review.text}"
                                    </p>

                                    <div>
                                        <p className="font-bold uppercase tracking-wider text-sm" style={{ color: theme.colors.dark }}>
                                            {review.name}
                                        </p>
                                        <p className="text-xs" style={{ color: theme.colors.muted }}>
                                            {review.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-center mt-8 text-sm" style={{ color: theme.colors.muted }}>
                    ← Drag to explore reviews →
                </p>
            </div>
        </section>
    );
}