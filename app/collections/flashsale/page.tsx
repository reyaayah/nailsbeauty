// app/collections/flashsale/page.tsx
import { Suspense } from "react";
import CollectionPage from "@/components/CollectionPage";

function FlashSaleContent({
    searchParams,
}: {
    searchParams: { shape?: string; length?: string; style?: string };
}) {
    return (
        <CollectionPage
            collection="flash-sale"
            filters={{
                shape: searchParams.shape ?? null,
                length: searchParams.length ?? null,
                style: searchParams.style ?? null,
            }}
        />
    );
}

export default function FlashSalePage({
    searchParams,
}: {
    searchParams: { shape?: string; length?: string; style?: string };
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FlashSaleContent searchParams={searchParams} />
        </Suspense>
    );
}