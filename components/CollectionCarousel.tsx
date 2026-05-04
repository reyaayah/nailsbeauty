"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import theme from "@/theme";
import { CollectionCard } from "./cards/CollectionCard";
import { products } from "@/data/product";
import ProductCard from "./cards/MainProductCard";

interface CollectionsCarouselProps {
    activeCollection?: string | null;
}

const COLLECTIONS = [
    { name: "Summer '24", slug: "summer-24", image: "/deal1.png", bg: "#F2DED3", filter: "Summer '24" },
    { name: "G & G Essence", slug: "g-g-essence", image: "/deal2.png", bg: "#EDD9E9", filter: "G & G Essence" },
    { name: "The Love Edit", slug: "the-love-edit", image: "https://images.unsplash.com/photo-1777287852750-53eb2ca506e9?q=80&w=1114&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", bg: "#D9E9E0", filter: "The Love Edit" },
    { name: "LNY Limited", slug: "lny-limited", image: "/deal1.png", bg: "#F5EAD0", filter: "LNY Limited" },
];

const CARD_W = 170;
const GAP = 16;
const STEP = CARD_W + GAP;

export function CollectionsCarousel({ activeCollection }: CollectionsCarouselProps) {
    const wrapRef = useRef<HTMLDivElement>(null);

    const [index, setIndex] = useState(0);
    const [maxIdx, setMaxIdx] = useState(0);

    const [selectedCollection, setSelectedCollection] = useState<string | null>(() => {
        if (!activeCollection) return COLLECTIONS[0]?.filter ?? null;
        return COLLECTIONS.find((c) => c.slug === activeCollection)?.filter ?? null;
    });

    useEffect(() => {
        if (!activeCollection) {
            // No collection in URL — default to the first collection
            setSelectedCollection(COLLECTIONS[0]?.filter ?? null);
            return;
        }
        // activeCollection is a slug like "summer-24" — resolve to filter name like "Summer '24"
        const matched = COLLECTIONS.find((c) => c.slug === activeCollection);
        setSelectedCollection(matched?.filter ?? null);
    }, [activeCollection]);
    const recalc = useCallback(() => {
        if (!wrapRef.current) return;
        const visible = Math.floor((wrapRef.current.offsetWidth + GAP) / STEP);
        setMaxIdx(Math.max(0, COLLECTIONS.length - visible));
    }, []);

    useEffect(() => {
        recalc();
        window.addEventListener("resize", recalc);
        return () => window.removeEventListener("resize", recalc);
    }, [recalc]);

    const goTo = (i: number) => setIndex(Math.max(0, Math.min(i, maxIdx)));

    const collectionProducts = selectedCollection
        ? products.filter((p) => p.collection === selectedCollection)
        : [];

    return (
        <div className="mb-[52px]">

            {/* Arrow navigation */}
            <div className="flex justify-end gap-2 mb-4">
                {([["←", index === 0, index - 1], ["→", index === maxIdx, index + 1]] as const).map(
                    ([label, disabled, target]) => (
                        <button
                            key={label}
                            disabled={disabled}
                            onClick={() => goTo(target)}
                            className="w-9 h-9 rounded-full border flex items-center justify-center
                                       text-sm transition-all duration-200 cursor-pointer disabled:opacity-30"
                            style={{ borderColor: theme.colors.muted, color: theme.colors.dark }}
                        >
                            {label}
                        </button>
                    )
                )}
            </div>

            {/* Scrollable track */}
            <div ref={wrapRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
                <div
                    className="flex"
                    style={{
                        gap: GAP,
                        transform: `translateX(-${index * STEP}px)`,
                        transition: "transform 0.45s cubic-bezier(.25,.8,.25,1)",
                    }}
                >
                    {COLLECTIONS.map((c) => (
                        <div
                            key={c.name}
                            onClick={() =>
                                // ✅ Toggle off if clicking the already-selected collection
                                setSelectedCollection((prev) => (prev === c.filter ? null : c.filter))
                            }
                            className="cursor-pointer flex-shrink-0"
                            style={{
                                outline: selectedCollection === c.filter
                                    ? `2px solid ${theme.colors.primary}`
                                    : "2px solid transparent",
                                borderRadius: 12,
                                transition: "outline 0.2s",
                            }}
                        >
                            <CollectionCard collection={c} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-1.5 mt-5">
                {Array.from({ length: maxIdx + 1 }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className="h-1.5 rounded-full border-0 cursor-pointer transition-all duration-200"
                        style={{
                            width: i === index ? 20 : 6,
                            background: theme.colors.primary,
                            opacity: i === index ? 1 : 0.35,
                        }}
                    />
                ))}
            </div>

            {/* Collection product grid */}
            {selectedCollection && (
                <div className="mt-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2
                            className="text-[22px] font-serif tracking-tight"
                            style={{ color: theme.colors.dark }}
                        >
                            {COLLECTIONS.find((c) => c.filter === selectedCollection)?.name}
                        </h2>
                        <button
                            onClick={() => setSelectedCollection(null)}
                            className="text-[12px] tracking-wide underline cursor-pointer"
                            style={{ color: theme.colors.muted }}
                        >
                            Clear
                        </button>
                    </div>

                    {collectionProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <p className="text-[18px] font-serif tracking-tight" style={{ color: theme.colors.dark }}>
                                No products found
                            </p>
                            <p className="text-[13px] tracking-wide" style={{ color: theme.colors.muted }}>
                                Nothing in this collection yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 lg:gap-x-8 gap-y-16">
                            {collectionProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}