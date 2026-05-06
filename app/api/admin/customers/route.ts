import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin, isNextResponse } from "@/lib/requireAdmin";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (isNextResponse(auth)) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");

    const snap = await adminDb.collection("users").orderBy("createdAt", "desc").get();
    let customers = await Promise.all(
      snap.docs.map(async (d) => {
        const data = d.data();
        // Count orders
        const orderHistory = data.orderHistory ?? [];
        // Compute total spent from global orders collection
        let totalSpent = 0;
        if (orderHistory.length > 0) {
          const ordersSnap = await adminDb
            .collection("orders")
            .where("userId", "==", d.id)
            .get();
          totalSpent = ordersSnap.docs.reduce((sum, o) => {
            const od = o.data();
            if (od.status !== "cancelled") sum += od.total ?? 0;
            return sum;
          }, 0);
        }

        return {
          uid: d.id,
          email: data.email ?? null,
          displayName: data.displayName ?? null,
          photoURL: data.photoURL ?? null,
          phoneNumber: data.phoneNumber ?? null,
          provider: data.provider ?? "email",
          isBlocked: data.isBlocked ?? false,
          orderCount: orderHistory.length,
          totalSpent,
          createdAt: data.createdAt?.toDate?.().toISOString() ?? data.createdAt ?? null,
          updatedAt: data.updatedAt?.toDate?.().toISOString() ?? data.updatedAt ?? null,
        };
      })
    );

    if (search) {
      const s = search.toLowerCase();
      customers = customers.filter(
        (c) =>
          c.email?.toLowerCase().includes(s) ||
          c.displayName?.toLowerCase().includes(s)
      );
    }

    const total = customers.length;
    const start = (page - 1) * limit;
    return NextResponse.json({
      customers: customers.slice(start, start + limit),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("GET /api/admin/customers:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
