import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function requireAdmin(req: NextRequest): Promise<{ uid: string } | NextResponse> {
  const authorization = req.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authorization.slice(7);
  try {
    const decoded = await adminAuth.verifyIdToken(token);

    // Check admin role in Firestore
    const adminDoc = await adminDb.collection("admins").doc(decoded.uid).get();
    if (!adminDoc.exists) {
      return NextResponse.json({ error: "Forbidden: not an admin" }, { status: 403 });
    }

    return { uid: decoded.uid };
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export function isNextResponse(val: unknown): val is NextResponse {
  return val instanceof NextResponse;
}
