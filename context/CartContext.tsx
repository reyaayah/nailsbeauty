// context/CartContext.tsx
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

export interface AppliedDiscount {
    code: string;
    type: "percentage" | "fixed";
    value: number; // percentage (0–100) or fixed $ amount
    label: string; // e.g. "10% off" or "$5 off"
}

interface CartContextValue {
    items: CartItem[];
    addToCart: (product: Product, size: string, shape: string, quantity?: number) => Promise<void>;
    removeFromCart: (productId: string, size?: string, shape?: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number, size?: string, shape?: string) => Promise<void>;
    clearCart: () => Promise<void>;
    totalItems: number;
    subtotal: number;
    discount: AppliedDiscount | null;
    discountAmount: number;
    discountedSubtotal: number;
    applyDiscount: (code: string) => Promise<{ success: boolean; message: string }>;
    removeDiscount: () => void;
    orderNote: string;
    setOrderNote: (note: string) => void;
    isGift: boolean;
    setIsGift: (v: boolean) => void;
    giftNote: string;
    setGiftNote: (note: string) => void;
    syncing: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const STORAGE_KEY = "gg_guest_cart";
    const DISCOUNT_KEY = "gg_discount";
    const NOTE_KEY = "gg_order_note";
    const GIFT_KEY = "gg_gift";

    const [items, setItems] = useState<CartItem[]>([]);
    const [syncing, setSyncing] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    // Discount
    const [discount, setDiscount] = useState<AppliedDiscount | null>(null);

    // Order notes
    const [orderNote, setOrderNoteState] = useState("");
    const [isGift, setIsGiftState] = useState(false);
    const [giftNote, setGiftNoteState] = useState("");

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

    const discountAmount = discount
        ? discount.type === "percentage"
            ? parseFloat(((subtotal * discount.value) / 100).toFixed(2))
            : Math.min(discount.value, subtotal)
        : 0;

    const discountedSubtotal = Math.max(0, subtotal - discountAmount);

    // Hydrate guest cart + persisted discount/notes from localStorage
    useEffect(() => {
        if (user) return;
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setItems(JSON.parse(stored) as CartItem[]);

            const storedDiscount = localStorage.getItem(DISCOUNT_KEY);
            if (storedDiscount) setDiscount(JSON.parse(storedDiscount));

            const storedNote = localStorage.getItem(NOTE_KEY);
            if (storedNote) {
                const { orderNote, isGift, giftNote } = JSON.parse(storedNote);
                setOrderNoteState(orderNote ?? "");
                setIsGiftState(isGift ?? false);
                setGiftNoteState(giftNote ?? "");
            }
        } catch {
            // corrupted storage
        }
        setHydrated(true);
    }, []);

    // Persist guest cart to localStorage
    useEffect(() => {
        if (!hydrated || user) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // storage quota exceeded
        }
    }, [items, user, hydrated]);

    // Persist discount
    useEffect(() => {
        if (!hydrated) return;
        try {
            if (discount) {
                localStorage.setItem(DISCOUNT_KEY, JSON.stringify(discount));
            } else {
                localStorage.removeItem(DISCOUNT_KEY);
            }
        } catch { }
    }, [discount, hydrated]);

    // Persist notes
    useEffect(() => {
        if (!hydrated) return;
        try {
            localStorage.setItem(NOTE_KEY, JSON.stringify({ orderNote, isGift, giftNote }));
        } catch { }
    }, [orderNote, isGift, giftNote, hydrated]);

    // Load server cart when user logs in
    useEffect(() => {
        if (!user) {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                setItems(stored ? (JSON.parse(stored) as CartItem[]) : []);
            } catch {
                setItems([]);
            }
            setHydrated(true);
            return;
        }

        setSyncing(true);
        const mergeAndLoad = async () => {
            try {
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

                localStorage.removeItem(STORAGE_KEY);

                const apiItems = await fetchCart(user.uid);
                setItems(
                    apiItems.map((i) => ({
                        product: {
                            id: i.productId,
                            name: i.name,
                            image: i.image,
                            price: i.price,
                            category: "",
                        } as unknown as Product,
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
        async (product: Product, size: string, shape: string, quantity: number = 1) => {
            setItems((prev) => {
                const existing = prev.find(
                    (i) => i.product.id === product.id && i.size === size && i.shape === shape
                );
                if (existing) {
                    return prev.map((i) =>
                        i.product.id === product.id && i.size === size && i.shape === shape
                            ? { ...i, quantity: i.quantity + quantity }
                            : i
                    );
                }
                return [...prev, { product, quantity, size, shape }];
            });

            if (user) {
                try {
                    await addCartItem(user.uid, product, quantity, size, shape);
                } catch (err) {
                    console.error("Cart sync failed:", err);
                }
            }
        },
        [user]
    );

    const removeFromCart = useCallback(
        async (productId: string, size = "", shape = "") => {
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
        async (productId: string, quantity: number, size = "", shape = "") => {
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
        setDiscount(null);
        setOrderNoteState("");
        setIsGiftState(false);
        setGiftNoteState("");
        if (user) {
            try {
                await clearCartAPI(user.uid);
            } catch (err) {
                console.error("Cart sync failed:", err);
            }
        }
    }, [user]);

    /**
     * Apply a discount code via API.
     * Expects POST /api/discounts/validate → { valid, type, value, label, message }
     */
    const applyDiscount = useCallback(
        async (code: string): Promise<{ success: boolean; message: string }> => {
            try {
                const res = await fetch("/api/discounts/validate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code: code.trim().toUpperCase(), subtotal }),
                });
                const data = await res.json();
                if (!res.ok || !data.valid) {
                    return { success: false, message: data.message ?? "Invalid discount code." };
                }
                setDiscount({
                    code: code.trim().toUpperCase(),
                    type: data.type,
                    value: data.value,
                    label: data.label,
                });
                return { success: true, message: data.message ?? "Discount applied!" };
            } catch {
                return { success: false, message: "Failed to validate code. Please try again." };
            }
        },
        [subtotal]
    );

    const removeDiscount = useCallback(() => {
        setDiscount(null);
    }, []);

    const setOrderNote = useCallback((note: string) => setOrderNoteState(note), []);
    const setIsGift = useCallback((v: boolean) => setIsGiftState(v), []);
    const setGiftNote = useCallback((note: string) => setGiftNoteState(note), []);

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
                discount,
                discountAmount,
                discountedSubtotal,
                applyDiscount,
                removeDiscount,
                orderNote,
                setOrderNote,
                isGift,
                setIsGift,
                giftNote,
                setGiftNote,
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