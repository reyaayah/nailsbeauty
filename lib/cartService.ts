// lib/cartService.ts
import {
    doc,
    setDoc,
    getDoc,
    getDocs,
    collection,
    query,
    where,
    deleteDoc,
    updateDoc,
    writeBatch,
} from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";
import { Product } from "@/types/product";

export interface CartItemData {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
    shape: string;
}

export async function addCartItem(
    uid: string,
    product: Product,
    quantity: number,
    size: string,
    shape: string
): Promise<void> {
    const db = getClientDb();
    const cartRef = doc(db, "users", uid, "cart", `${product.id}_${size}_${shape}`);

    const snap = await getDoc(cartRef);
    if (snap.exists()) {
        await updateDoc(cartRef, {
            quantity: snap.data().quantity + quantity,
            updatedAt: new Date(),
        });
    } else {
        await setDoc(cartRef, {
            productId: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity,
            size,
            shape,
            addedAt: new Date(),
            updatedAt: new Date(),
        });
    }
}

export async function fetchCart(uid: string): Promise<CartItemData[]> {
    const db = getClientDb();
    const cartQuery = query(collection(db, "users", uid, "cart"));
    const snap = await getDocs(cartQuery);
    return snap.docs.map((doc) => doc.data() as CartItemData);
}

export async function updateCartItem(
    uid: string,
    productId: string,
    quantity: number,
    size: string,
    shape: string
): Promise<void> {
    const db = getClientDb();
    const cartRef = doc(db, "users", uid, "cart", `${productId}_${size}_${shape}`);

    if (quantity < 1) {
        await deleteDoc(cartRef);
    } else {
        await updateDoc(cartRef, { quantity, updatedAt: new Date() });
    }
}

export async function removeCartItem(
    uid: string,
    productId: string,
    size: string,
    shape: string
): Promise<void> {
    const db = getClientDb();
    const cartRef = doc(db, "users", uid, "cart", `${productId}_${size}_${shape}`);
    await deleteDoc(cartRef);
}

export async function clearCart(uid: string): Promise<void> {
    const db = getClientDb();
    const cartQuery = query(collection(db, "users", uid, "cart"));
    const snap = await getDocs(cartQuery);

    const batch = writeBatch(db);
    snap.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
}