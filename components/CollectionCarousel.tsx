import { useCallback, useEffect, useRef, useState } from "react";
import theme from "@/theme";
import { CollectionCard } from "./cards/CollectionCard";

const COLLECTIONS = [
    { name: "Gel Sets", image: "/deal1.png", bg: "#F2DED3" },
    { name: "Press-On", image: "/deal2.png", bg: "#EDD9E9" },
    { name: "Nail Art", image: "/deal3.png", bg: "#D9E9E0" },
    { name: "Bundles", image: "/deal1.png", bg: "#F5EAD0" },
    { name: "Glitter & Foil", image: "/deal2.png", bg: "#D9E2F5" },
    { name: "French Tips", image: "/deal3.png", bg: "#EEDFD9" },
    { name: "Seasonal Edit", image: "/deal1.png", bg: "#FAE0EC" },
];

const CARD_W = 170;
const GAP = 16;
const STEP = CARD_W + GAP;

export function CollectionsCarousel() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const dragStart = useRef(0);

    const [index, setIndex] = useState(0);
    const [maxIdx, setMaxIdx] = useState(0);

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
            <div
                ref={wrapRef}
                className="overflow-hidden cursor-grab active:cursor-grabbing"

            >
                <div
                    className="flex"
                    style={{
                        gap: GAP,
                        transform: `translateX(-${index * STEP}px)`,
                        transition: "transform 0.45s cubic-bezier(.25,.8,.25,1)",
                    }}
                >
                    {COLLECTIONS.map((c) => (
                        <CollectionCard key={c.name} collection={c} />
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

        </div>
    );
}