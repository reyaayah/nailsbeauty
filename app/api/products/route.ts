import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/types/product";
import { db } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
    const snap = await db.collection("products").get();

    const products = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as unknown as Product[];

    const { searchParams } = new URL(req.url);

    const shape = searchParams.get("shape");
    const length = searchParams.get("length");
    const style = searchParams.get("style");
    const collection = searchParams.get("collection");

    const filtered = products.filter((p) => {
        if (!shape && !length && !style && !collection) return true;

        return (
            (!shape || p.shape?.toLowerCase() === shape.toLowerCase()) &&
            (!length || p.length?.toLowerCase() === length.toLowerCase()) &&
            (!style || p.style?.toLowerCase() === style.toLowerCase()) &&
            (!collection || p.collection?.toLowerCase() === collection.toLowerCase())
        );
    });

    return NextResponse.json({
        products: filtered,
        total: filtered.length,
    });
}