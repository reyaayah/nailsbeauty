"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";
import { Product } from "@/types/product";
import { useAuth } from "@/context/AuthContext";
import {
    fetchCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart as clearCartAPI,
} from "@/lib/cartService";

export interface CartItem {
    product: Product;
    quantity: number;
    size: string;
    shape: string;
}

interface CartContextValue {
    items: CartItem[];
    addToCart: (product: Product, size: string, shape: string) => Promise<void>;
    removeFromCart: (productId: number, size?: string, shape?: string) => Promise<void>;
    updateQuantity: (productId: number, quantity: number, size?: string, shape?: string) => Promise<void>;
    clearCart: () => Promise<void>;
    totalItems: number;
    subtotal: number;
    syncing: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const STORAGE_KEY = "gg_guest_cart";

    // Always start empty on the server — localStorage is loaded client-side
    // in a useEffect below to avoid SSR/client hydration mismatch.
    const [items, setItems] = useState<CartItem[]>([]);
    const [syncing, setSyncing] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

    // Hydrate guest cart from localStorage once on the client after mount
    useEffect(() => {
        if (user) return; // logged-in users get their cart from the API
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setItems(JSON.parse(stored) as CartItem[]);
        } catch {
            // corrupted storage — start fresh
        }
        setHydrated(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Persist guest cart to localStorage after hydration (skip the initial empty render)
    useEffect(() => {
        if (!hydrated || user) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // storage quota exceeded or private mode — fail silently
        }
    }, [items, user, hydrated]);

    // Load server cart when user logs in, clear localStorage on logout
    useEffect(() => {
        if (!user) {
            // On logout: restore guest cart from localStorage (safe here — this
            // effect only runs client-side after mount, never on the server).
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                setItems(stored ? (JSON.parse(stored) as CartItem[]) : []);
            } catch {
                setItems([]);
            }
            setHydrated(true);
            return;
        }

        // User just logged in — merge guest cart into server cart, then load
        setSyncing(true);
        const mergeAndLoad = async () => {
            try {
                // Push any guest items to the server first
                const guestItems: CartItem[] = (() => {
                    try {
                        const stored = localStorage.getItem(STORAGE_KEY);
                        return stored ? (JSON.parse(stored) as CartItem[]) : [];
                    } catch {
                        return [];
                    }
                })();

                for (const { product, quantity, size, shape } of guestItems) {
                    await addCartItem(user.uid, product, quantity, size, shape);
                }

                // Clear guest localStorage after merge
                localStorage.removeItem(STORAGE_KEY);

                // Load the final server cart
                const apiItems = await fetchCart(user.uid);
                setItems(
                    apiItems.map((i) => ({
                        product: {
                            id: i.productId,
                            name: i.name,
                            image: i.image,
                            price: i.price,
                            category: "",
                        } as Product,
                        quantity: i.quantity,
                        size: i.size,
                        shape: i.shape,
                    }))
                );
            } catch (err) {
                console.error("Cart merge failed:", err);
            } finally {
                setSyncing(false);
            }
        };

        mergeAndLoad();
    }, [user]);

    const addToCart = useCallback(
        async (product: Product, size: string, shape: string) => {
            // Optimistic update first — same product+size+shape = increment qty
            setItems((prev) => {
                const existing = prev.find(
                    (i) => i.product.id === product.id && i.size === size && i.shape === shape
                );
                if (existing) {
                    return prev.map((i) =>
                        i.product.id === product.id && i.size === size && i.shape === shape
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                    );
                }
                return [...prev, { product, quantity: 1, size, shape }];
            });
            if (user) {
                try {
                    await addCartItem(user.uid, product, 1, size, shape);
                } catch (err) {
                    console.error("Cart sync failed:", err);
                }
            }
        },
        [user]
    );

    const removeFromCart = useCallback(
        async (productId: number, size = "", shape = "") => {
            setItems((prev) =>
                prev.filter(
                    (i) => !(i.product.id === productId && i.size === size && i.shape === shape)
                )
            );
            if (user) {
                try {
                    await removeCartItem(user.uid, productId, size, shape);
                } catch (err) {
                    console.error("Cart sync failed:", err);
                }
            }
        },
        [user]
    );

    const updateQuantity = useCallback(
        async (productId: number, quantity: number, size = "", shape = "") => {
            if (quantity < 1) {
                return removeFromCart(productId, size, shape);
            }
            setItems((prev) =>
                prev.map((i) =>
                    i.product.id === productId && i.size === size && i.shape === shape
                        ? { ...i, quantity }
                        : i
                )
            );
            if (user) {
                try {
                    await updateCartItem(user.uid, productId, quantity, size, shape);
                } catch (err) {
                    console.error("Cart sync failed:", err);
                }
            }
        },
        [user, removeFromCart]
    );

    const clearCart = useCallback(async () => {
        setItems([]);
        if (user) {
            try {
                await clearCartAPI(user.uid);
            } catch (err) {
                console.error("Cart sync failed:", err);
            }
        }
    }, [user]);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                subtotal,
                syncing,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within a CartProvider");
    return ctx;
}