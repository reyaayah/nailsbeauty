// app/collections/flashsale/page.tsx
import { Suspense } from "react";
import CollectionPage from "@/components/CollectionPage";

async function NewArrivalsContent({
    searchParams,
}: {
    searchParams: Promise<{ shape?: string; length?: string; style?: string }>;
}) {
    const { shape, length, style } = await searchParams;
    return (
        <CollectionPage
            collection="new-arrivals"
            filters={{
                shape: shape ?? null,
                length: length ?? null,
                style: style ?? null,
            }}
        />
    );
}

export default async function NewArrivalsPage({
    searchParams,
}: {
    searchParams: Promise<{ shape?: string; length?: string; style?: string }>;
}) {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewArrivalsContent searchParams={searchParams} />
        </Suspense>
    );
}