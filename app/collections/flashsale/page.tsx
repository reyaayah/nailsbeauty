"use client";

import theme from "@/theme";
import { products } from "@/data/product";
import { useRouter, useSearchParams } from "next/navigation";
import { MobileFilterBar, DesktopFilterSidebar } from "@/components/FilterBar";
import ProductCard from "@/components/cards/ProductCard";
import VacaySection from "@/components/headers/BestSellers";

export default function BestSellerPage() {
    const searchParams = useSearchParams();
    const flashSaleProducts = products.filter(
        (product) => product.onSale
    );
    const filteredProducts = flashSaleProducts.filter((product) => {
        const shape = searchParams.get("shape");
        const length = searchParams.get("length");
        const style = searchParams.get("style");

        return (
            (!shape || product.shape?.includes(shape)) &&
            (!length || product.length?.includes(length)) &&
            (!style || product.style?.includes(style))
        );
    });

    return (
        <main
            className="min-h-screen font-sans"
            style={{ backgroundColor: theme.colors.light }}
        >
            <VacaySection collectionName="Flash Sale" />


            <MobileFilterBar totalCount={flashSaleProducts.length} />


            <div className="flex max-w-[1400px] mx-auto pt-10">
                <DesktopFilterSidebar totalCount={flashSaleProducts.length} />

                {/* Product grid */}
                <div className="flex-1 min-w-0 px-6 lg:px-8 pb-20">
                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <p
                                className="text-[22px] font-serif tracking-tight"
                                style={{ color: theme.colors.dark }}
                            >
                                No products in this category
                            </p>
                            <p
                                className="text-[13px] tracking-wide"
                                style={{ color: theme.colors.muted }}
                            >
                                Try adjusting or clearing your filters.
                            </p>
                        </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 lg:gap-x-8 gap-y-16 lg:gap-y-20">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}