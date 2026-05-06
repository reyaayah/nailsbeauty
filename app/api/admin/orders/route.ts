import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin, isNextResponse } from "@/lib/requireAdmin";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (isNextResponse(auth)) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");

    let q: FirebaseFirestore.Query = adminDb.collection("orders").orderBy("createdAt", "desc");
    if (status) q = q.where("status", "==", status);

    const snap = await q.get();
    let orders = snap.docs.map((d) => {
      const data = d.data();
      return {
        ...data,
        id: d.id,
        createdAt: data.createdAt?.toDate?.().toISOString() ?? data.createdAt,
        updatedAt: data.updatedAt?.toDate?.().toISOString() ?? data.updatedAt,
      };
    });

    if (search) {
      const s = search.toLowerCase();
      orders = orders.filter(
        (o: any) =>
          o.id?.toLowerCase().includes(s) ||
          o.userId?.toLowerCase().includes(s) ||
          o.userEmail?.toLowerCase().includes(s) ||
          o.shippingAddress?.fullName?.toLowerCase().includes(s)
      );
    }

    const total = orders.length;
    const start = (page - 1) * limit;
    return NextResponse.json({
      orders: orders.slice(start, start + limit),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("GET /api/admin/orders:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
