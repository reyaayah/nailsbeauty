"use client";

import { CollectionsCarousel } from "@/components/CollectionCarousel";
import theme from "@/theme";
import { useState } from "react";


// ─── Main Component ───────────────────────────────────────────────────────────

export default function ShopCollection() {
    const [loadMoreHovered, setLoadMoreHovered] = useState(false);


    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-enter {
          animation: fadeUp 0.38s ease both;
        }
      `}</style>

            <section
                className="min-h-screen py-[72px] px-6"
                style={{ background: theme.colors.light, fontFamily: "'DM Sans', sans-serif" }}
            >
                <div className="max-w-[1160px] mx-auto">

                    {/* ── Header ── */}
                    <div className="text-center mb-[52px]">
                        <p
                            className="text-[11px] font-medium uppercase tracking-[0.22em] mb-3
                         flex items-center justify-center gap-3"
                            style={{ color: theme.colors.primary }}
                        >
                            <span
                                className="inline-block w-7 h-[1.5px]"
                                style={{ background: theme.colors.primary }}
                            />
                            Handcrafted with love
                            <span
                                className="inline-block w-7 h-[1.5px]"
                                style={{ background: theme.colors.primary }}
                            />
                        </p>

                        <h2
                            className="font-bold leading-[1.1] tracking-tight"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                                color: theme.colors.dark,
                            }}
                        >
                            Shop Our{" "}
                            <em
                                className="italic"
                                style={{ color: theme.colors.primary }}
                            >
                                Collection
                            </em>
                        </h2>

                        <p
                            className="mt-3 text-[14px] leading-relaxed max-w-[380px] mx-auto"
                            style={{ color: theme.colors.muted }}
                        >
                            Salon-quality nails at home — gel sets, press-ons &amp; nail art
                            delivered to your door.
                        </p>
                    </div>
                    <CollectionsCarousel />



                </div>
            </section>
        </>
    );
}