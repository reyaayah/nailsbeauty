import {
    doc,
    updateDoc,
    setDoc,
    arrayUnion,
    arrayRemove,
    serverTimestamp,
    getDoc,
} from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";
import { Address, UserProfile } from "@/types/user";

const userRef = (uid: string, db: any) => doc(db, "users", uid);

/* ── Profile ─────────────────────────────────────────────── */
export async function updateUserProfile(uid: string, data: Partial<Pick<UserProfile, "displayName" | "phoneNumber">>) {
    const db = getClientDb();
    await setDoc(userRef(uid, db), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

/* ── Wishlist ─────────────────────────────────────────────── */
export async function addToWishlist(uid: string, productId: number) {
    const db = getClientDb();
    await setDoc(userRef(uid, db), {
        wishlist: arrayUnion(productId),
        updatedAt: serverTimestamp(),
    }, { merge: true });
}

export async function removeFromWishlist(uid: string, productId: number) {
    const db = getClientDb();
    await updateDoc(userRef(uid, db), {
        wishlist: arrayRemove(productId),
        updatedAt: serverTimestamp(),
    });
}

export async function getWishlist(uid: string): Promise<number[]> {
    const db = getClientDb();
    const snap = await getDoc(userRef(uid, db));
    return snap.exists() ? (snap.data() as UserProfile).wishlist ?? [] : [];
}

/* ── Addresses ───────────────────────────────────────────── */
export async function addAddress(uid: string, address: Address) {
    const db = getClientDb();
    const snap = await getDoc(userRef(uid, db));
    const existing = snap.exists() ? ((snap.data() as UserProfile).addresses ?? []) : [];

    const updated = address.isDefault
        ? existing.map((a) => ({ ...a, isDefault: false }))
        : existing;

    await setDoc(userRef(uid, db), {
        addresses: [...updated, address],
        updatedAt: serverTimestamp(),
    }, { merge: true });
}

export async function removeAddress(uid: string, addressId: string) {
    const db = getClientDb();
    const snap = await getDoc(userRef(uid, db));
    if (!snap.exists()) return;
    const addresses = ((snap.data() as UserProfile).addresses ?? []).filter((a) => a.id !== addressId);
    await updateDoc(userRef(uid, db), { addresses, updatedAt: serverTimestamp() });
}

/* ── Orders ──────────────────────────────────────────────── */
export async function addOrderToHistory(uid: string, orderId: string) {
    const db = getClientDb();
    await setDoc(userRef(uid, db), {
        orderHistory: arrayUnion(orderId),
        updatedAt: serverTimestamp(),
    }, { merge: true });
}