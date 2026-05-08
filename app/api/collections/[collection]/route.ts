// app/api/collections/[collection]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/types/product";
import { db } from "@/lib/firebaseAdmin";

type CollectionConfig = {
    collectionName: string;
    field: string;
    value: string | boolean;
};

const COLLECTION_CONFIG: Record<string, CollectionConfig> = {
    "best-sellers": {
        collectionName: "Best Sellers",
        field: "isBestSeller",
        value: true,
    },
    "flash-sale": {
        collectionName: "Flash Sale",
        field: "onSale",
        value: true,
    },
    "new-arrivals": {
        collectionName: "New Arrivals",
        field: "isNew",
        value: true,
    },
    "tools-accessories": {
        collectionName: "Tools & Accessories",
        field: "category",
        value: "Tools & Accessories",
    },
    bundles: {
        collectionName: "Bundles",
        field: "category",
        value: "Bundles",
    },
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ collection: string }> }
) {
    const { collection } = await params;

    const config = COLLECTION_CONFIG[collection];
    if (!config) {
        return NextResponse.json(
            { error: `Collection "${collection}" not found` },
            { status: 404 }
        );
    }

    const { collectionName, field, value } = config;
    const searchParams = request.nextUrl.searchParams;

    const shape = searchParams.get("shape");
    const length = searchParams.get("length");
    const style = searchParams.get("style");

    try {
        // Base query for the collection type
        let query = db.collection("products").where(field, "==", value);

        // Push array-contains filters to Firestore where possible
        // (Firestore supports only one array-contains per query, so we chain
        //  the first filter in Firestore and do the rest in memory)
        const firestoreFilters: Array<{ key: string; val: string }> = [];
        if (shape) firestoreFilters.push({ key: "shape", val: shape });
        if (length) firestoreFilters.push({ key: "length", val: length });
        if (style) firestoreFilters.push({ key: "style", val: style });

        if (firestoreFilters.length > 0) {
            query = query.where(firestoreFilters[0].key, "array-contains", firestoreFilters[0].val);
        }

        const snapshot = await query.get();
        const collectionProducts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as unknown as Product[];

        // Total count is the unfiltered collection size (before extra filters)
        const totalCount = collectionProducts.length;

        // Apply remaining filters in memory
        const remainingFilters = firestoreFilters.slice(1);
        const filteredProducts =
            remainingFilters.length === 0
                ? collectionProducts
                : collectionProducts.filter((product) =>
                    remainingFilters.every(({ key, val }) =>
                        (product[key as keyof Product] as string[] | undefined)?.includes(val)
                    )
                );

        return NextResponse.json({
            collectionName,
            collection,
            filters: { shape, length, style },
            totalCount,
            filteredCount: filteredProducts.length,
            products: filteredProducts,
        });
    } catch (err) {
        console.error("[collections] Firestore error:", err);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}