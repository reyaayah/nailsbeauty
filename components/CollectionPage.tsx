// components/CollectionPage.tsx
"use client";

import { useEffect, useState } from "react";
import theme from "@/theme";
import { MobileFilterBar, DesktopFilterSidebar } from "@/components/FilterBar";
import VacaySection from "@/components/headers/BestSellers";
import { Product } from "@/types/product";
import ProductCard from "./cards/MainProductCard";

const COLLECTION_NAMES: Record<string, string> = {
    "best-sellers": "Best Sellers",
    "flash-sale": "Flash Sale",
    "new-arrivals": "New Arrivals",
    "tools-accessories": "Tools & Accessories",
    "bundles": "Bundles",
};

type Filters = {
    shape?: string | null;
    length?: string | null;
    style?: string | null;
};

type ApiResponse = {
    collectionName: string;
    totalCount: number;
    filteredCount: number;
    products: Product[];
};

export default function CollectionPage({
    collection,
    filters,
    showFilters = true,
}: {
    collection: keyof typeof COLLECTION_NAMES;
    filters: Filters;
    showFilters?: boolean;
}) {
    const collectionName = COLLECTION_NAMES[collection];

    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.shape) params.set("shape", filters.shape);
        if (filters.length) params.set("length", filters.length);
        if (filters.style) params.set("style", filters.style);

        const query = params.toString();
        const url = `/api/collections/${collection}${query ? `?${query}` : ""}`;

        setLoading(true);
        setError(null);

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch products");
                return res.json();
            })
            .then((json: ApiResponse) => setData(json))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [collection, filters.shape, filters.length, filters.style]);

    return (
        <main className="min-h-screen font-sans" style={{ backgroundColor: theme.colors.light }}>
            <VacaySection collectionName={collectionName} />

            {showFilters && (
                <MobileFilterBar totalCount={data?.totalCount ?? 0} />
            )}

            <div className="flex max-w-[1400px] mx-auto pt-10">
                {showFilters && (
                    <DesktopFilterSidebar totalCount={data?.totalCount ?? 0} />
                )}

                <div className="flex-1 min-w-0 px-6 lg:px-8 pb-20">
                    {loading && (
                        <div className="flex items-center justify-center py-32">
                            <p className="text-[14px] tracking-wide" style={{ color: theme.colors.muted }}>
                                Loading...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center justify-center py-32">
                            <p className="text-[14px] tracking-wide" style={{ color: theme.colors.muted }}>
                                Something went wrong. Please try again.
                            </p>
                        </div>
                    )}

                    {!loading && !error && data?.products.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <p className="text-[22px] font-serif tracking-tight" style={{ color: theme.colors.dark }}>
                                No products in this category
                            </p>
                            <p className="text-[13px] tracking-wide" style={{ color: theme.colors.muted }}>
                                Try adjusting or clearing your filters.
                            </p>
                        </div>
                    )}

                    {!loading && !error && data && (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 lg:gap-x-8 gap-y-16 lg:gap-y-20">
                            {data.products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}