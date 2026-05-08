// app/collections/bundles/page.tsx
import { Suspense } from "react";
import CollectionPage from "@/components/CollectionPage";

async function BundlesContent({
    searchParams,
}: {
    searchParams: Promise<{ shape?: string; length?: string; style?: string }>;
}) {
    const { shape, length, style } = await searchParams;
    return (
        <CollectionPage
            collection="bundles"
            filters={{
                shape: shape ?? null,
                length: length ?? null,
                style: style ?? null,
            }}
        />
    );
}

export default function BundlesPage({
    searchParams,
}: {
    searchParams: Promise<{ shape?: string; length?: string; style?: string }>;
}) {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BundlesContent searchParams={searchParams} />
        </Suspense>
    );
}