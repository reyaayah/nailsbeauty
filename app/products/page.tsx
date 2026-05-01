"use client";

import theme from "@/theme";
import { products } from "@/data/product";
import { useRouter, useSearchParams } from "next/navigation";
import { MobileFilterBar, DesktopFilterSidebar } from "@/components/FilterBar";
import ProductCard from "@/components/cards/MainProductCard";

export default function AllProductsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const filteredProducts = products.filter((product) => {
        const shape = searchParams.get("shape");
        const length = searchParams.get("length");
        const style = searchParams.get("style");

        if (!shape && !length && !style) return true;

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
                    <span onClick={() => { router.push("/") }}>Home</span>
                    <span>/</span>
                    <span className="font-bold" style={{ color: theme.colors.dark }}>
                        All Products
                    </span>
                </nav>
            </div>


            <MobileFilterBar totalCount={products.length} />


            <div className="flex max-w-[1400px] mx-auto">
                <DesktopFilterSidebar totalCount={products.length} />

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
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}