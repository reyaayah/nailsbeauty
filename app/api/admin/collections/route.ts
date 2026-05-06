import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin, isNextResponse } from "@/lib/requireAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (isNextResponse(auth)) return auth;

  const snap = await adminDb.collection("collections").orderBy("sortOrder", "asc").get();
  const collections = snap.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: data.createdAt?.toDate?.().toISOString() ?? data.createdAt,
      updatedAt: data.updatedAt?.toDate?.().toISOString() ?? data.updatedAt,
    };
  });
  return NextResponse.json({ collections });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (isNextResponse(auth)) return auth;

  const body = await req.json();
  const ref = adminDb.collection("collections").doc();
  const now = FieldValue.serverTimestamp();
  await ref.set({
    ...body,
    id: ref.id,
    slug: body.slug || slugify(body.name || ""),
    isActive: body.isActive ?? true,
    sortOrder: body.sortOrder ?? 999,
    createdAt: now,
    updatedAt: now,
  });
  return NextResponse.json({ id: ref.id }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (isNextResponse(auth)) return auth;

  const body = await req.json();
  const { id, createdAt: _c, ...updates } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await adminDb.collection("collections").doc(id).update({ ...updates, updatedAt: FieldValue.serverTimestamp() });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (isNextResponse(auth)) return auth;

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await adminDb.collection("collections").doc(id).delete();
  return NextResponse.json({ success: true });
}
