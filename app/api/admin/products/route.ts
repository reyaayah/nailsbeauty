import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin, isNextResponse } from "@/lib/requireAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (isNextResponse(auth)) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    let q: FirebaseFirestore.Query = adminDb.collection("products").orderBy("createdAt", "desc");
    if (category) q = q.where("category", "==", category);

    const snap = await q.get();
    let products = snap.docs.map((d) => {
      const data = d.data();
      return {
        ...data,
        id: d.id,
        createdAt: data.createdAt?.toDate?.().toISOString() ?? data.createdAt ?? null,
        updatedAt: data.updatedAt?.toDate?.().toISOString() ?? data.updatedAt ?? null,
      };
    });

    if (search) {
      const s = search.toLowerCase();
      products = products.filter(
        (p: any) =>
          p.name?.toLowerCase().includes(s) ||
          p.category?.toLowerCase().includes(s) ||
          p.collection?.toLowerCase().includes(s)
      );
    }

    const total = products.length;
    const start = (page - 1) * limit;
    return NextResponse.json({
      products: products.slice(start, start + limit),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("GET /api/admin/products:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (isNextResponse(auth)) return auth;

  try {
    const body = await req.json();
    const now = FieldValue.serverTimestamp();
    const ref = adminDb.collection("products").doc();

    const data = {
      ...body,
      id: ref.id,
      slug: body.slug || slugify(body.name || ""),
      isActive: body.isActive ?? true,
      stock: body.stock ?? 0,
      reviews: body.reviews ?? 0,
      rating: body.rating ?? 0,
      createdAt: now,
      updatedAt: now,
    };

    await ref.set(data);
    return NextResponse.json({ id: ref.id, product: { ...data, id: ref.id } }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/products:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
