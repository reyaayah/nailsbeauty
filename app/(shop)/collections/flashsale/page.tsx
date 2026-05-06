// app/collections/flashsale/page.tsx
import { Suspense } from "react";
import CollectionPage from "@/components/CollectionPage";

async function FlashSaleContent({
    searchParams,
}: {
    searchParams: Promise<{ shape?: string; length?: string; style?: string }>;
}) {
    const { shape, length, style } = await searchParams;
    return (
        <CollectionPage
            collection="flash-sale"
            filters={{
                shape: shape ?? null,
                length: length ?? null,
                style: style ?? null,
            }}
        />
    );
}

export default function FlashSalePage({
    searchParams,
}: {
    searchParams: Promise<{ shape?: string; length?: string; style?: string }>;
}) {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FlashSaleContent searchParams={searchParams} />
        </Suspense>
    );
}