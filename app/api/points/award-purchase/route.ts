/**
 * app/api/points/award-purchase/route.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Called by your payment provider's webhook (Stripe, etc.) OR from your
 * internal order-complete server action after payment is confirmed.
 *
 * POST body: { uid: string, orderTotal: number, orderId: string }
 *
 * Authentication: Sign requests with AWARD_POINTS_SECRET in the
 * Authorization header → Bearer <secret>.  Set this in .env.local.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";          // your Admin SDK initializer
import { FieldValue } from "firebase-admin/firestore";
import { POINTS_CONFIG } from "@/lib/referral";

const SECRET = process.env.AWARD_POINTS_SECRET ?? "";

export async function POST(req: NextRequest) {
    // ── Auth check ──────────────────────────────────────────────────────────
    const authHeader = req.headers.get("authorization") ?? "";
    if (!SECRET || authHeader !== `Bearer ${SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Parse body ──────────────────────────────────────────────────────────
    let body: { uid?: string; orderTotal?: number; orderId?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { uid, orderTotal, orderId } = body;
    if (!uid || typeof orderTotal !== "number" || !orderId) {
        return NextResponse.json({ error: "uid, orderTotal, orderId are required" }, { status: 400 });
    }

    // ── Idempotency: don't double-award the same order ──────────────────────
    const histRef = adminDb
        .collection("users").doc(uid)
        .collection("pointsHistory");

    const existing = await histRef.where("orderId", "==", orderId).get();
    if (!existing.empty) {
        return NextResponse.json({ message: "Already awarded", orderId }, { status: 200 });
    }

    // ── Award points ────────────────────────────────────────────────────────
    const points = Math.floor(orderTotal * POINTS_CONFIG.POINTS_PER_POUND);
    if (points <= 0) {
        return NextResponse.json({ message: "No points to award", points: 0 });
    }

    const batch = adminDb.batch();

    // 1. Increment user's loyaltyPoints
    batch.update(adminDb.collection("users").doc(uid), {
        loyaltyPoints: FieldValue.increment(points),
        updatedAt: FieldValue.serverTimestamp(),
    });

    // 2. Log the transaction
    const txRef = histRef.doc();
    batch.set(txRef, {
        uid,
        type: "purchase",
        points,
        description: `Points for order #${orderId}`,
        orderId,
        createdAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();

    return NextResponse.json({ success: true, pointsAwarded: points, orderId });
}