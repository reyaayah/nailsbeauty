import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin, isNextResponse } from "@/lib/requireAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (isNextResponse(auth)) return auth;

  const { id } = await params;
  try {
    const snap = await adminDb.collection("orders").doc(id).get();
    if (!snap.exists) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const data = snap.data()!;

    // Try to enrich with user info
    let userEmail: string | null = null;
    let userName: string | null = null;
    if (data.userId) {
      try {
        const userSnap = await adminDb.collection("users").doc(data.userId).get();
        if (userSnap.exists) {
          userEmail = userSnap.data()?.email ?? null;
          userName = userSnap.data()?.displayName ?? null;
        }
      } catch { /* user lookup failure is non-fatal */ }
    }

    return NextResponse.json({
      ...data,
      id: snap.id,
      userEmail,
      userName,
      createdAt: data.createdAt?.toDate?.().toISOString() ?? data.createdAt,
      updatedAt: data.updatedAt?.toDate?.().toISOString() ?? data.updatedAt,
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (isNextResponse(auth)) return auth;

  const { id } = await params;
  try {
    const body = await req.json();
    const { status, trackingNumber, notes } = body;

    const valid = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (status && !valid.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const orderSnap = await adminDb.collection("orders").doc(id).get();
    if (!orderSnap.exists) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const updates: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };
    if (status) updates.status = status;
    if (trackingNumber !== undefined) updates.trackingNumber = trackingNumber;
    if (notes !== undefined) updates.notes = notes;

    const batch = adminDb.batch();
    // Update global order
    batch.update(adminDb.collection("orders").doc(id), updates);
    // Also update the user's subcollection copy
    const userId = orderSnap.data()?.userId;
    if (userId) {
      const userOrderRef = adminDb.collection("users").doc(userId).collection("orders").doc(id);
      const userOrderSnap = await userOrderRef.get();
      if (userOrderSnap.exists) {
        batch.update(userOrderRef, updates);
      }
    }
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/admin/orders/[id]:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
