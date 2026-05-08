import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/types/product";
import { db } from "@/lib/firebaseAdmin";


export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const snap = await db.collection("products").doc(id).get();

    if (!snap.exists) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = { id: snap.id, ...snap.data() } as unknown as Product;

    const productsRef = db.collection("products");

    const [byShapeSnap, byCollectionSnap] = await Promise.all([
        productsRef.where("shape", "==", product.shape).limit(5).get(),
        productsRef.where("collection", "==", product.collection).limit(5).get(),
    ]);

    const seen = new Set<string>();
    const related: Product[] = [];

    for (const doc of [...byShapeSnap.docs, ...byCollectionSnap.docs]) {
        if (doc.id === id || seen.has(doc.id)) continue;
        seen.add(doc.id);
        related.push({ id: doc.id, ...doc.data() } as unknown as Product);
        if (related.length === 4) break;
    }

    return NextResponse.json({ product, related });
}