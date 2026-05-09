"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import theme from "@/theme";

// FilterBar.tsx
export const filterOptions: Record<string, string[]> = {
    length: ["XL", "Long", "Medium", "Short", "XS"],  // "Med" → "Medium"
    shape: ["Almond", "Coffin", "Oval", "Square", "Squoval"],
    style: ["Glossy", "Metallic", "Matte", "French Tip", "Glitter", "Cat Eye", "Chrome"],

};

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 3;

export function useFilterState() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const getSelected = (category: string) => searchParams.get(category);

    const hasActiveFilters = Object.keys(filterOptions).some(
        (key) => !!searchParams.get(key)
    );

    const toggleFilter = (category: string, option: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (params.get(category) === option) {
            params.delete(category);
        } else {
            params.set(category, option);
        }

        const pathname = window.location.pathname; // 🔥 key fix
        router.push(`${pathname}?${params.toString()}`);
    };

    const clearAll = () => {
        const pathname = window.location.pathname;
        router.push(pathname);
    };

    return { getSelected, hasActiveFilters, toggleFilter, clearAll };
}

// ─── Desktop: vertical carousel sidebar ──────────────────────────────────────

function CategoryCarousel({
    category,
    options,
    selected,
    onToggle,
}: {
    category: string;
    options: string[];
    selected: string | null;
    onToggle: (category: string, option: string) => void;
}) {
    const [offset, setOffset] = useState(0);
    const maxOffset = Math.max(0, options.length - VISIBLE_ITEMS);

    return (
        <div className="flex flex-col gap-1">
            <span
                className="text-[14px] font-bold uppercase tracking-[0.2em] px-1 mb-1"
                style={{ color: theme.colors.dark }}
            >
                {category}
            </span>

            <button
                onClick={() => setOffset((o) => Math.max(0, o - 1))}
                disabled={offset === 0}
                className="flex items-center justify-center h-5 w-full rounded transition-opacity"
                style={{ opacity: offset === 0 ? 0.2 : 1 }}
            >
                <ChevronUp size={14} style={{ color: theme.colors.dark }} />
            </button>

            <div className="overflow-hidden" style={{ height: VISIBLE_ITEMS * ITEM_HEIGHT }}>
                <div
                    className="flex flex-col transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateY(-${offset * ITEM_HEIGHT}px)` }}
                >
                    {options.map((option) => {
                        const isSelected = selected === option;
                        return (
                            <button
                                key={option}
                                onClick={() => onToggle(category, option)}
                                className="flex items-center justify-between px-3 rounded-sm transition-all duration-200 text-left shrink-0"
                                style={{
                                    height: ITEM_HEIGHT,
                                    marginBottom: 4,
                                    backgroundColor: isSelected ? theme.colors.dark : "transparent",
                                    border: `1px solid ${isSelected ? theme.colors.dark : "#e5e5e5"}`,
                                }}
                            >
                                <span
                                    className="text-[12px] font-medium tracking-wide"
                                    style={{ color: isSelected ? "#fff" : theme.colors.dark }}
                                >
                                    {option}
                                </span>
                                {isSelected && <Check size={12} color="#fff" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            <button
                onClick={() => setOffset((o) => Math.min(maxOffset, o + 1))}
                disabled={offset >= maxOffset}
                className="flex items-center justify-center h-5 w-full rounded transition-opacity"
                style={{ opacity: offset >= maxOffset ? 0.2 : 1 }}
            >
                <ChevronDown size={14} style={{ color: theme.colors.dark }} />
            </button>
        </div>
    );
}


export function DesktopFilterSidebar({
    totalCount,
}: {
    totalCount?: number;
}) {
    const { getSelected, hasActiveFilters, toggleFilter, clearAll } = useFilterState();

    return (
        <aside
            className="hidden lg:flex sticky top-[80px] h-[calc(100vh-80px)] flex-col gap-6 py-8 px-5 border-r overflow-y-auto shrink-0"
            style={{
                backgroundColor: theme.colors.light,
                borderColor: "#e5e5e5",
                width: 200,
            }}
        >
            <div className="flex items-center justify-between">
                <span
                    className="text-[11px] font-bold uppercase tracking-[0.25em]"
                    style={{ color: "#111111" }}   // darker
                >
                    Filter
                </span>

                {hasActiveFilters && (
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-1 text-[10px] uppercase tracking-widest transition-opacity hover:opacity-60"
                        style={{ color: "#333333" }} // darker than muted
                    >
                        <X size={10} /> Clear
                    </button>
                )}
            </div>

            <div className="h-px w-full" style={{ backgroundColor: "#d6d6d6" }} />

            <div className="flex flex-col gap-8">
                {Object.entries(filterOptions).map(([key, options]) => (
                    <CategoryCarousel
                        key={key}
                        category={key}
                        options={options}
                        selected={getSelected(key)}
                        onToggle={toggleFilter}
                    />
                ))}
            </div>

            <div className="h-px w-full mt-auto" style={{ backgroundColor: "#d6d6d6" }} />

            {totalCount !== undefined && (
                <p
                    className="text-[11px] text-center tracking-widest font-medium"
                    style={{ color: "#222222" }} // darker count text
                >
                    {totalCount} designs
                </p>
            )}
        </aside>
    );
}

/**
 * Mobile filter bar — place this OUTSIDE and ABOVE the flex row.
 * Hidden on desktop via `lg:hidden`.
 */
export function MobileFilterBar({
    totalCount,
}: {
    totalCount?: number;
}) {
    const { getSelected, toggleFilter } = useFilterState();
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    return (
        <div className="lg:hidden sticky top-[80px] z-40 bg-white/90 backdrop-blur-md border-y border-neutral-200/50 mb-8 shadow-sm">
            <div className="px-4 h-14 flex items-center justify-between">
                <div className="flex gap-3 items-center">
                    <div
                        className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.15em] mr-2"
                        style={{ color: theme.colors.dark }}
                    >
                        <SlidersHorizontal size={15} />
                        <span className="hidden sm:inline">Filter:</span>
                    </div>

                    {Object.entries(filterOptions).map(([key, options]) => {
                        const selected = getSelected(key);
                        const isOpen = activeFilter === key;

                        return (
                            <div key={key} className="relative">
                                <button
                                    onClick={() => setActiveFilter(isOpen ? null : key)}
                                    className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest py-1.5 px-2.5 rounded-md transition-colors"
                                    style={{
                                        color: selected && !isOpen ? "#fff" : theme.colors.dark,
                                        backgroundColor: isOpen
                                            ? (theme.colors.subtitle ?? "#f0f0f0")
                                            : selected
                                                ? theme.colors.dark
                                                : "transparent",
                                    }}
                                >
                                    {selected ?? key}
                                    <ChevronDown
                                        size={13}
                                        className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {isOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setActiveFilter(null)}
                                        />
                                        <div className="absolute top-full left-0 mt-2 w-52 bg-white shadow-2xl border border-neutral-100 z-20 py-3 rounded-sm animate-in fade-in slide-in-from-top-2 duration-200">
                                            {options.map((option) => {
                                                const isSelected = getSelected(key) === option;
                                                return (
                                                    <button
                                                        key={option}
                                                        onClick={() => {
                                                            toggleFilter(key, option);
                                                            setActiveFilter(null);
                                                        }}
                                                        className="w-full flex items-center justify-between px-5 py-2.5 text-[13px] hover:bg-neutral-50 transition-colors"
                                                        style={{ color: theme.colors.dark }}
                                                    >
                                                        <span className={isSelected ? "font-bold" : "font-normal"}>
                                                            {option}
                                                        </span>
                                                        {isSelected && (
                                                            <Check size={14} style={{ color: theme.colors.primary }} />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                {totalCount !== undefined && (
                    <span
                        className="text-[12px] font-medium hidden sm:block"
                        style={{ color: theme.colors.muted }}
                    >
                        {totalCount} Designs
                    </span>
                )}
            </div>
        </div>
    );
}