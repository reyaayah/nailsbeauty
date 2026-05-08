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

    // Fetch all — filter/sort in JS to avoid composite index requirement
    const snap = await adminDb.collection("products").get();

    let products = snap.docs.map((d) => {
      const data = d.data();
      return {
        ...data,
        id: d.id,
        createdAt: data.createdAt?.toDate?.().toISOString() ?? data.createdAt ?? null,
        updatedAt: data.updatedAt?.toDate?.().toISOString() ?? data.updatedAt ?? null,
      };
    });

    // Sort by createdAt desc
    products.sort((a: any, b: any) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    // Filter by category
    if (category) {
      products = products.filter((p: any) => p.category === category);
    }

    // Filter by search
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