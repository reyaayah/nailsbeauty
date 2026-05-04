
import { db } from "./firebaseAdmin";

export async function addToWishlist(userId: string, productId: number) {
    try {
        const ref = db
            .collection("wishlists")
            .doc(userId)
            .collection("items");

        const existing = await ref
            .where("productId", "==", productId)
            .get();

        if (!existing.empty) return;

        await ref.add({
            productId,
            createdAt: new Date(),
        });

    } catch (error) {
        console.error("addToWishlist error:", error);
        throw error;
    }
}


export async function removeFromWishlist(userId: string, productId: number) {
    try {
        const ref = db
            .collection("wishlists")
            .doc(userId)
            .collection("items");

        const snapshot = await ref
            .where("productId", "==", productId)
            .get();

        if (snapshot.empty) return;

        const batch = db.batch();
        snapshot.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();

    } catch (error) {
        console.error("removeFromWishlist error:", error);
        throw error;
    }
}

export async function fetchWishlist(userId: string) {
    try {
        console.log("Fetching wishlist for:", userId);

        const snapshot = await db
            .collection("wishlists")
            .doc(userId)
            .collection("items")
            .get();

        console.log("Docs:", snapshot.docs.length);

        return snapshot.docs.map((doc) => Number(doc.data().productId));
    } catch (error) {
        console.error("fetchWishlist error:", error);
        throw error;
    }
}

export async function isInWishlist(uid: string, productId: number): Promise<boolean> {
    const wishlist = await fetchWishlist(uid);
    return wishlist.includes(productId);
}
