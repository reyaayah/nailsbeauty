import { NextResponse } from "next/server";
import { Product } from "@/types/product";
import { db } from "@/lib/firebaseAdmin";

export async function GET() {
    const snap = await db
        .collection("products")
        .where("onSale", "==", true)
        .get();

    const products = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as unknown as Product[];

    return NextResponse.json({ products, total: products.length });
}