import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase/admin";
import { requireAdmin, isNextResponse } from "@/lib/requireAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (isNextResponse(auth)) return auth;

  const { id } = await params;
  try {
    const [userSnap, ordersSnap] = await Promise.all([
      adminDb.collection("users").doc(id).get(),
      adminDb.collection("orders").where("userId", "==", id).orderBy("createdAt", "desc").get(),
    ]);

    if (!userSnap.exists) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const data = userSnap.data()!;
    const orders = ordersSnap.docs.map((d) => {
      const od = d.data();
      return {
        ...od,
        id: d.id,
        createdAt: od.createdAt?.toDate?.().toISOString() ?? od.createdAt,
        updatedAt: od.updatedAt?.toDate?.().toISOString() ?? od.updatedAt,
      };
    });

    return NextResponse.json({
      uid: userSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.().toISOString() ?? data.createdAt,
      updatedAt: data.updatedAt?.toDate?.().toISOString() ?? data.updatedAt,
      orders,
      orderCount: orders.length,
      totalSpent: orders
        .filter((o: any) => o.status !== "cancelled")
        .reduce((s: number, o: any) => s + (o.total ?? 0), 0),
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
    const { isBlocked } = await req.json();
    await Promise.all([
      adminDb.collection("users").doc(id).update({
        isBlocked: !!isBlocked,
        updatedAt: FieldValue.serverTimestamp(),
      }),
      adminAuth.updateUser(id, { disabled: !!isBlocked }),
    ]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
