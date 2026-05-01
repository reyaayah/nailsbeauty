"use client";

import theme from "@/theme";
import { useRouter, useSearchParams } from "next/navigation";
import { MobileFilterBar, DesktopFilterSidebar } from "@/components/FilterBar";
import ProductCard from "@/components/cards/MainProductCard";
import { useProducts } from "@/hooks/useProducts";

export default function AllProductsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const shape = searchParams.get("shape");
    const length = searchParams.get("length");
    const style = searchParams.get("style");

    const { products, total, loading, error } = useProducts({ shape, length, style });

    return (
        <main
            className="min-h-screen font-sans"
            style={{ backgroundColor: theme.colors.light }}
        >
            {/* Hero Header */}
            <div className="max-w-[1400px] mx-auto px-6 pt-24 pb-12 text-center">
                <h1
                    className="text-5xl md:text-6xl font-serif mb-5 tracking-tight"
                    style={{ color: theme.colors.dark }}
                >
                    The Collection
                </h1>
                <nav
                    className="text-[12px] uppercase tracking-[0.3em] flex justify-center gap-3 items-center"
                    style={{ color: theme.colors.muted }}
                >
                    <span className="cursor-pointer" onClick={() => router.push("/")}>Home</span>
                    <span>/</span>
                    <span className="font-bold" style={{ color: theme.colors.dark }}>
                        All Products
                    </span>
                </nav>
            </div>

            <MobileFilterBar totalCount={total} />

            <div className="flex max-w-[1400px] mx-auto">
                <DesktopFilterSidebar totalCount={total} />

                {/* Product grid */}
                <div className="flex-1 min-w-0 px-6 lg:px-8 pb-20">

                    {/* Loading skeleton */}
                    {loading && (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 lg:gap-x-8 gap-y-16 lg:gap-y-20">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-gray-200 rounded-2xl aspect-[3/4] mb-4" />
                                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error state */}
                    {!loading && error && (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <p className="text-[22px] font-serif tracking-tight" style={{ color: theme.colors.dark }}>
                                Something went wrong
                            </p>
                            <p className="text-[13px] tracking-wide" style={{ color: theme.colors.muted }}>
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && products.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <p className="text-[22px] font-serif tracking-tight" style={{ color: theme.colors.dark }}>
                                No products in this category
                            </p>
                            <p className="text-[13px] tracking-wide" style={{ color: theme.colors.muted }}>
                                Try adjusting or clearing your filters.
                            </p>
                        </div>
                    )}

                    {/* Products */}
                    {!loading && !error && products.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 lg:gap-x-8 gap-y-16 lg:gap-y-20">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}