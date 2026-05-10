import { NextRequest, NextResponse } from "next/server";
import { db, auth } from "@/lib/firebaseAdmin";
import * as admin from "firebase-admin";

export interface Review {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;          // 1–5
    title: string;
    body: string;
    createdAt: string;       // ISO string
    verified: boolean;       // true if user purchased the product
}

// ── GET /api/products/[id]/reviews ───────────────────────────────────────────
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    let snap;
    try {
        snap = await db
            .collection("products")
            .doc(id)
            .collection("reviews")
            .orderBy("createdAt", "desc")
            .limit(50)
            .get();
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Firestore query failed";
        console.error("[reviews GET]", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }

    const reviews: Review[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Review, "id">),
    }));

    const totalCount = reviews.length;
    const avgRating =
        totalCount > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount
            : 0;

    const distribution = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => r.rating === star).length,
    }));

    return NextResponse.json({ reviews, totalCount, avgRating, distribution });
}

// ── POST /api/products/[id]/reviews ──────────────────────────────────────────
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Auth: verify Bearer token
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
        return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    let decoded: { uid: string; name?: string; picture?: string };
    try {
        decoded = await auth.verifyIdToken(token);
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Validate product exists
    const productSnap = await db.collection("products").doc(id).get();
    if (!productSnap.exists) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Parse body — guard against empty / non-JSON payloads
    let rating: number, title: string, reviewBody: string;
    try {
        const body = await req.json();
        ({ rating, title, reviewBody } = body as {
            rating: number;
            title: string;
            reviewBody: string;
        });
    } catch {
        return NextResponse.json({ error: "Invalid or empty request body" }, { status: 400 });
    }

    if (!rating || rating < 1 || rating > 5) {
        return NextResponse.json({ error: "Rating must be 1–5" }, { status: 422 });
    }
    if (!title?.trim() || !reviewBody?.trim()) {
        return NextResponse.json({ error: "Title and review body are required" }, { status: 422 });
    }

    // Prevent duplicate reviews from same user
    const existing = await db
        .collection("products")
        .doc(id)
        .collection("reviews")
        .where("userId", "==", decoded.uid)
        .limit(1)
        .get();

    if (!existing.empty) {
        return NextResponse.json(
            { error: "You have already reviewed this product" },
            { status: 409 }
        );
    }

    // Check if user has purchased this product (verified buyer badge)
    const orderSnap = await db
        .collection("orders")
        .where("userId", "==", decoded.uid)
        .where("productIds", "array-contains", id)
        .limit(1)
        .get();
    const verified = !orderSnap.empty;

    const reviewData: Omit<Review, "id"> = {
        productId: id,
        userId: decoded.uid,
        userName: decoded.name ?? "Anonymous",
        ...(decoded.picture ? { userAvatar: decoded.picture } : {}),
        rating,
        title: title.trim(),
        body: reviewBody.trim(),
        createdAt: new Date().toISOString(),
        verified,
    };

    let reviewId: string;
    try {
        const reviewRef = await db
            .collection("products")
            .doc(id)
            .collection("reviews")
            .add(reviewData);
        reviewId = reviewRef.id;
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to save review";
        console.error("[reviews POST] Firestore add failed:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }

    // Denormalise rating summary onto the product doc (best-effort — never blocks the response)
    try {
        const allReviewsSnap = await db
            .collection("products")
            .doc(id)
            .collection("reviews")
            .get();

        const allRatings = allReviewsSnap.docs.map((d) => (d.data() as Review).rating);
        const newAvg = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;

        await db.collection("products").doc(id).update({
            rating: parseFloat(newAvg.toFixed(1)),
            reviewCount: admin.firestore.FieldValue.increment(1),
        });
    } catch {
        // Non-fatal: the review is saved; the summary will self-heal on next submit
        console.warn("Failed to update product rating summary:", id);
    }

    return NextResponse.json(
        { id: reviewId, ...reviewData },
        { status: 201 }
    );
}