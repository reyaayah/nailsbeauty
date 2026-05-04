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

interface WishlistContextValue {
    wishlist: number[];
    addItem: (productId: number) => Promise<void>;
    removeItem: (productId: number) => Promise<void>;
    isInWishlist: (productId: number) => boolean;
    loading: boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Helper: builds headers with the Firebase user uid for API auth
// ─────────────────────────────────────────────────────────────────────────────
function buildHeaders(userId: string): HeadersInit {
    return {
        "Content-Type": "application/json",
        "x-user-id": userId,
    };
}

export function WishlistProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    // ── Load wishlist from API when user logs in ──────────────────────────────
    useEffect(() => {
        if (!user) {
            setWishlist([]);
            return;
        }

        setLoading(true);

        fetch("/api/wishlist", {
            method: "GET",
            headers: buildHeaders(user.uid),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch wishlist");
                return res.json();
            })
            .then((json) => setWishlist(json.data ?? []))
            .catch((err) => console.error("Failed to load wishlist:", err))
            .finally(() => setLoading(false));
    }, [user]);

    // ── Add item ──────────────────────────────────────────────────────────────
    const addItem = useCallback(
        async (productId: number) => {
            if (!user) throw new Error("You must be logged in to add to wishlist");

            // Optimistic update
            setWishlist((prev) => [...new Set([...prev, productId])]);

            try {
                const res = await fetch("/api/wishlist", {
                    method: "POST",
                    headers: buildHeaders(user.uid),
                    body: JSON.stringify({ productId }),
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error ?? "Failed to add to wishlist");
                }
            } catch (error) {
                // Revert optimistic update on failure
                setWishlist((prev) => prev.filter((id) => id !== productId));
                throw error;
            }
        },
        [user]
    );

    // ── Remove item ───────────────────────────────────────────────────────────
    const removeItem = useCallback(
        async (productId: number) => {
            if (!user) throw new Error("You must be logged in to remove from wishlist");

            // Optimistic update
            setWishlist((prev) => prev.filter((id) => id !== productId));

            try {
                const res = await fetch(`/api/wishlist/${productId}`, {
                    method: "DELETE",
                    headers: buildHeaders(user.uid),
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error ?? "Failed to remove from wishlist");
                }
            } catch (error) {
                // Revert optimistic update on failure
                setWishlist((prev) => [...new Set([...prev, productId])]);
                throw error;
            }
        },
        [user]
    );

    // ── Check membership ──────────────────────────────────────────────────────
    const isInWishlist = useCallback(
        (productId: number) => wishlist.includes(productId),
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