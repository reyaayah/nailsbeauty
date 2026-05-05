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

// ── Auth header helper — takes user explicitly so it's always in scope ────────
async function getAuthHeaders(user: User): Promise<HeadersInit> {
    const token = await user.getIdToken();
    console.log("TOKEN:", token ? token.slice(0, 20) + "..." : "NULL"); // ← add this
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

// ── Provider is a normal (non-async) component ────────────────────────────────
export function WishlistProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    // ── Load wishlist when user logs in ───────────────────────────────────────
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
                if (!cancelled) setWishlist(json.data ?? []);
            } catch (err) {
                console.error("Failed to load wishlist:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        // Cleanup: ignore result if user changes mid-flight
        return () => { cancelled = true; };
    }, [user?.uid]); // ← uid, not user object — prevents stale re-runs

    // ── Add item ──────────────────────────────────────────────────────────────
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