import { NextRequest, NextResponse } from "next/server";

// ─── In-memory store (dev only) ───────────────────────────────────────────────
// Replace with Firestore when ready:
//
//   import { db } from "@/lib/firebase/FirebaseConfig";
//   import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
//
//   // GET:    const snap = await getDoc(doc(db, "carts", uid));
//   // SET:    await setDoc(doc(db, "carts", uid), { items, updatedAt: serverTimestamp() });
//
// ─────────────────────────────────────────────────────────────────────────────
const carts: Record<string, CartItem[]> = {};

export interface CartItem {
    productId: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
    shape: string;
}

function getUserId(req: NextRequest): string | null {
    // Read uid from Authorization header: "Bearer <uid>"
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return null;
    return auth.slice(7).trim() || null;
}

/* GET /api/cart — fetch user's cart */
export async function GET(req: NextRequest) {
    const uid = getUserId(req);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    return NextResponse.json({ items: carts[uid] ?? [] });
}

/* POST /api/cart — add or increment an item */
export async function POST(req: NextRequest) {
    const uid = getUserId(req);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body: CartItem = await req.json();
    if (!body.productId || !body.price) {
        return NextResponse.json({ error: "productId and price are required" }, { status: 400 });
    }

    const cart = carts[uid] ?? [];
    // Same product with different size/shape = separate line item
    const existing = cart.find(
        (i) => i.productId === body.productId && i.size === body.size && i.shape === body.shape
    );

    if (existing) {
        existing.quantity += body.quantity ?? 1;
    } else {
        cart.push({ ...body, quantity: body.quantity ?? 1 });
    }

    carts[uid] = cart;
    return NextResponse.json({ items: cart });
}

/* PATCH /api/cart — update quantity of one item */
export async function PATCH(req: NextRequest) {
    const uid = getUserId(req);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId, quantity, size, shape }: { productId: number; quantity: number; size: string; shape: string } = await req.json();
    if (!productId || quantity === undefined) {
        return NextResponse.json({ error: "productId and quantity are required" }, { status: 400 });
    }

    const cart = carts[uid] ?? [];

    if (quantity <= 0) {
        carts[uid] = cart.filter(
            (i) => !(i.productId === productId && i.size === size && i.shape === shape)
        );
    } else {
        const item = cart.find(
            (i) => i.productId === productId && i.size === size && i.shape === shape
        );
        if (item) item.quantity = quantity;
        carts[uid] = cart;
    }

    return NextResponse.json({ items: carts[uid] });
}

/* DELETE /api/cart — remove one item or clear the whole cart */
export async function DELETE(req: NextRequest) {
    const uid = getUserId(req);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const size = searchParams.get("size") ?? "";
    const shape = searchParams.get("shape") ?? "";

    if (productId) {
        // Remove single line item (matched by productId + size + shape)
        carts[uid] = (carts[uid] ?? []).filter(
            (i) => !(i.productId === Number(productId) && i.size === size && i.shape === shape)
        );
    } else {
        // Clear entire cart
        carts[uid] = [];
    }

    return NextResponse.json({ items: carts[uid] });
}