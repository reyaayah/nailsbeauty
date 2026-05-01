import {
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    serverTimestamp,
    getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/FirebaseConfig";
import { Address, UserProfile } from "@/types/user";

const userRef = (uid: string) => doc(db, "users", uid);

/* ── Profile ─────────────────────────────────────────────── */
export async function updateUserProfile(uid: string, data: Partial<Pick<UserProfile, "displayName" | "phoneNumber">>) {
    await updateDoc(userRef(uid), { ...data, updatedAt: serverTimestamp() });
}

/* ── Wishlist ─────────────────────────────────────────────── */
export async function addToWishlist(uid: string, productId: number) {
    await updateDoc(userRef(uid), {
        wishlist: arrayUnion(productId),
        updatedAt: serverTimestamp(),
    });
}

export async function removeFromWishlist(uid: string, productId: number) {
    await updateDoc(userRef(uid), {
        wishlist: arrayRemove(productId),
        updatedAt: serverTimestamp(),
    });
}

export async function getWishlist(uid: string): Promise<number[]> {
    const snap = await getDoc(userRef(uid));
    return snap.exists() ? (snap.data() as UserProfile).wishlist ?? [] : [];
}

/* ── Addresses ───────────────────────────────────────────── */
export async function addAddress(uid: string, address: Address) {
    // If this is the first or marked as default, clear others
    const snap = await getDoc(userRef(uid));
    const existing = snap.exists() ? ((snap.data() as UserProfile).addresses ?? []) : [];

    const updated = address.isDefault
        ? existing.map((a) => ({ ...a, isDefault: false }))
        : existing;

    await updateDoc(userRef(uid), {
        addresses: [...updated, address],
        updatedAt: serverTimestamp(),
    });
}

export async function removeAddress(uid: string, addressId: string) {
    const snap = await getDoc(userRef(uid));
    if (!snap.exists()) return;
    const addresses = ((snap.data() as UserProfile).addresses ?? []).filter((a) => a.id !== addressId);
    await updateDoc(userRef(uid), { addresses, updatedAt: serverTimestamp() });
}

/* ── Orders ──────────────────────────────────────────────── */
export async function addOrderToHistory(uid: string, orderId: string) {
    await updateDoc(userRef(uid), {
        orderHistory: arrayUnion(orderId),
        updatedAt: serverTimestamp(),
    });
}
