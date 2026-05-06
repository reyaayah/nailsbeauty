// context/WishlistContext.tsx
"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { User } from "firebase/auth";

interface WishlistContextValue {
    wishlist: number[];
    addItem: (productId: number) => Promise<void>;
    removeItem: (productId: number) => Promise<void>;
    isInWishlist: (productId: number) => boolean;
    loading: boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

async function getAuthHeaders(user: User): Promise<HeadersInit> {
    const token = await user.getIdToken();
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

export function WishlistProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            setWishlist([]);
            return;
        }

        let cancelled = false;
        setLoading(true);

        (async () => {
            try {
                const headers = await getAuthHeaders(user);
                const res = await fetch("/api/wishlist", { method: "GET", headers });
                if (!res.ok) throw new Error("Failed to fetch wishlist");
                const json = await res.json();

                // ✅ Coerce to number[] — JSON serialisation can silently
                //    turn numbers to strings, which breaks wishlist.includes(p.id)
                const ids: number[] = (json.data ?? []).map(Number);

                if (!cancelled) setWishlist(ids);
            } catch (err) {
                console.error("Failed to load wishlist:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [user?.uid]);

    const addItem = useCallback(
        async (productId: number) => {
            if (!user) throw new Error("You must be logged in to add to wishlist");

            // Optimistic update
            setWishlist((prev) => [...new Set([...prev, productId])]);

            try {
                const headers = await getAuthHeaders(user);
                const res = await fetch("/api/wishlist", {
                    method: "POST",
                    headers,
                    // ✅ Explicitly send as number — route does Number(body.productId)
                    body: JSON.stringify({ productId: Number(productId) }),
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error ?? "Failed to add to wishlist");
                }
            } catch (error) {
                // Revert on failure
                setWishlist((prev) => prev.filter((id) => id !== productId));
                throw error;
            }
        },
        [user]
    );

    const removeItem = useCallback(
        async (productId: number) => {
            if (!user) throw new Error("You must be logged in to remove from wishlist");

            // Optimistic update
            setWishlist((prev) => prev.filter((id) => id !== productId));

            try {
                const headers = await getAuthHeaders(user);
                const res = await fetch(`/api/wishlist/${productId}`, {
                    method: "DELETE",
                    headers,
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error ?? "Failed to remove from wishlist");
                }
            } catch (error) {
                // Revert on failure
                setWishlist((prev) => [...new Set([...prev, productId])]);
                throw error;
            }
        },
        [user]
    );

    // ✅ Coerce here too so MainProductCard comparisons always work
    const isInWishlist = useCallback(
        (productId: number) => wishlist.includes(Number(productId)),
        [wishlist]
    );

    return (
        <WishlistContext.Provider
            value={{ wishlist, addItem, removeItem, isInWishlist, loading }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
    return ctx;
}