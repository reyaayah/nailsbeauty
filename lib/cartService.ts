/**
 * cartService.ts
 * Firestore-backed cart operations.
 *
 * Collection path: users/{uid}/cart/{cartItemId}
 * Each document shape: { productId, name, image, price, quantity, size, shape }
 */

import {
    collection,
    doc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    writeBatch,
} from "firebase/firestore";
import { Product } from "@/types/product";
import { db } from "./firebase/FirebaseConfig";

export interface CartAPIItem {
    productId: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
    shape: string;
}

/** Deterministic doc ID so we never duplicate the same variant */
function cartDocId(productId: number, size: string, shape: string) {
    return `${productId}__${size}__${shape}`.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function cartRef(uid: string) {
    return collection(db, "users", uid, "cart");
}

/** Fetch all cart items for a user */
export async function fetchCart(uid: string): Promise<CartAPIItem[]> {
    const snapshot = await getDocs(query(cartRef(uid)));
    return snapshot.docs.map((d) => d.data() as CartAPIItem);
}

/** Add or increment a cart item */
export async function addCartItem(
    uid: string,
    product: Product,
    quantity: number,
    size: string,
    shape: string
): Promise<void> {
    const id = cartDocId(product.id, size, shape);
    const ref = doc(db, "users", uid, "cart", id);

    // setDoc with merge=true: if the doc exists it merges, so we add to qty
    // We instead read-then-write to properly increment
    const snapshot = await getDocs(query(cartRef(uid)));
    const existing = snapshot.docs.find((d) => d.id === id);

    if (existing) {
        const currentQty = (existing.data() as CartAPIItem).quantity;
        await updateDoc(ref, { quantity: currentQty + quantity });
    } else {
        await setDoc(ref, {
            productId: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity,
            size,
            shape,
        });
    }
}

/** Overwrite the quantity of a specific cart variant */
export async function updateCartItem(
    uid: string,
    productId: number,
    quantity: number,
    size: string,
    shape: string
): Promise<void> {
    const id = cartDocId(productId, size, shape);
    const ref = doc(db, "users", uid, "cart", id);
    await updateDoc(ref, { quantity });
}

/** Remove one specific variant from the cart */
export async function removeCartItem(
    uid: string,
    productId: number,
    size: string,
    shape: string
): Promise<void> {
    const id = cartDocId(productId, size, shape);
    const ref = doc(db, "users", uid, "cart", id);
    await deleteDoc(ref);
}

/** Wipe the entire cart (used after successful checkout) */
export async function clearCart(uid: string): Promise<void> {
    const snapshot = await getDocs(query(cartRef(uid)));
    const batch = writeBatch(db);
    snapshot.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
}