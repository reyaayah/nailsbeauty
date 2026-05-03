// app/collections/flashsale/page.tsx
import { Suspense } from "react";
import CollectionPage from "@/components/CollectionPage";

function BestSellerContent({
    searchParams,
}: {
    searchParams: { shape?: string; length?: string; style?: string };
}) {
    return (
        <CollectionPage
            collection="best-sellers"
            filters={{
                shape: searchParams.shape ?? null,
                length: searchParams.length ?? null,
                style: searchParams.style ?? null,
            }}
        />
    );
}

export default function BestSellerPage({
    searchParams,
}: {
    searchParams: { shape?: string; length?: string; style?: string };
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BestSellerContent searchParams={searchParams} />
        </Suspense>
    );
}