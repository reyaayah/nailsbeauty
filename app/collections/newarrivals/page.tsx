// app/collections/flashsale/page.tsx
import { Suspense } from "react";
import CollectionPage from "@/components/CollectionPage";

function NewArrivalsContent({
    searchParams,
}: {
    searchParams: { shape?: string; length?: string; style?: string };
}) {
    return (
        <CollectionPage
            collection="new-arrivals"
            filters={{
                shape: searchParams.shape ?? null,
                length: searchParams.length ?? null,
                style: searchParams.style ?? null,
            }}
        />
    );
}

export default function NewArrivalsPage({
    searchParams,
}: {
    searchParams: { shape?: string; length?: string; style?: string };
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewArrivalsContent searchParams={searchParams} />
        </Suspense>
    );
}