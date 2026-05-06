import {
    doc,
    updateDoc,
    setDoc,
    arrayUnion,
    arrayRemove,
    serverTimestamp,
    getDoc,
} from "firebase/firestore";
import { getDbInstance, initializeFirebase } from "@/lib/firebase/FirebaseConfig";
import { Address, UserProfile } from "@/types/user";

const userRef = (uid: string, db: any) => doc(db, "users", uid);

/* ── Profile ─────────────────────────────────────────────── */
export async function updateUserProfile(uid: string, data: Partial<Pick<UserProfile, "displayName" | "phoneNumber">>) {
    await initializeFirebase();
    const db = getDbInstance();
    await setDoc(userRef(uid, db), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

/* ── Wishlist ─────────────────────────────────────────────── */
export async function addToWishlist(uid: string, productId: number) {
    await initializeFirebase();
    const db = getDbInstance();
    await setDoc(userRef(uid, db), {
        wishlist: arrayUnion(productId),
        updatedAt: serverTimestamp(),
    }, { merge: true });
}

export async function removeFromWishlist(uid: string, productId: number) {
    await initializeFirebase();
    const db = getDbInstance();
    await updateDoc(userRef(uid, db), {
        wishlist: arrayRemove(productId),
        updatedAt: serverTimestamp(),
    });
}

export async function getWishlist(uid: string): Promise<number[]> {
    await initializeFirebase();
    const db = getDbInstance();
    const snap = await getDoc(userRef(uid, db));
    return snap.exists() ? (snap.data() as UserProfile).wishlist ?? [] : [];
}

/* ── Addresses ───────────────────────────────────────────── */
export async function addAddress(uid: string, address: Address) {
    await initializeFirebase();
    const db = getDbInstance();
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
    await initializeFirebase();
    const db = getDbInstance();
    const snap = await getDoc(userRef(uid, db));
    if (!snap.exists()) return;
    const addresses = ((snap.data() as UserProfile).addresses ?? []).filter((a) => a.id !== addressId);
    await updateDoc(userRef(uid, db), { addresses, updatedAt: serverTimestamp() });
}

/* ── Orders ──────────────────────────────────────────────── */
export async function addOrderToHistory(uid: string, orderId: string) {
    await initializeFirebase();
    const db = getDbInstance();
    await setDoc(userRef(uid, db), {
        orderHistory: arrayUnion(orderId),
        updatedAt: serverTimestamp(),
    }, { merge: true });
}