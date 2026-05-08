// lib/orderService.ts
import {
    doc,
    setDoc,
    getDocs,
    collection,
    query,
    orderBy,
    Timestamp,
    writeBatch,
    arrayUnion,
} from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";
import { CartItem } from "@/context/CartContext";
import { AppliedDiscount } from "@/context/CartContext";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface ShippingAddress {
    fullName: string;
    line1?: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export interface OrderItem {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
    shape: string;
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    subtotal: number;
    discountCode?: string | null;
    discountType?: "percentage" | "fixed" | null;
    discountValue?: number | null;
    discountLabel?: string | null;
    discountAmount?: number;
    shipping: number;
    total: number;
    status: OrderStatus;
    paymentMethod: string;
    shippingAddress: ShippingAddress;
    orderNote?: string | null;
    isGift?: boolean;
    giftNote?: string | null;
    /** Admin-only internal notes */
    notes?: string | null;
    trackingNumber?: string | null;
    createdAt: { seconds: number; nanoseconds: number };
    updatedAt: { seconds: number; nanoseconds: number };
}

/**
 * Place an order and clear the user's cart
 */
export async function placeOrder(
    userId: string,
    items: CartItem[],
    subtotal: number,
    shippingAddress: ShippingAddress,
    paymentMethod: string,
    options?: {
        discount?: AppliedDiscount | null;
        discountAmount?: number;
        orderNote?: string;
        isGift?: boolean;
        giftNote?: string;
    }
): Promise<string> {
    const db = getClientDb();
    const batch = writeBatch(db);

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const orderItems: OrderItem[] = items.map(({ product, quantity, size, shape }) => ({
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
        size,
        shape,
    }));

    const discountAmount = options?.discountAmount ?? 0;
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const shippingCost = discountedSubtotal >= 70 ? 0 : 9.99;

    const orderData: Omit<Order, "createdAt" | "updatedAt"> & {
        createdAt: ReturnType<typeof Timestamp.now>;
        updatedAt: ReturnType<typeof Timestamp.now>;
    } = {
        id: orderId,
        userId,
        items: orderItems,
        subtotal,
        discountCode: options?.discount?.code ?? null,
        discountType: options?.discount?.type ?? null,
        discountValue: options?.discount?.value ?? null,
        discountLabel: options?.discount?.label ?? null,
        discountAmount,
        shipping: shippingCost,
        total: discountedSubtotal + shippingCost,
        status: "pending" as OrderStatus,
        paymentMethod,
        shippingAddress,
        orderNote: options?.orderNote || null,
        isGift: options?.isGift ?? false,
        giftNote: options?.giftNote || null,
        notes: null,
        trackingNumber: null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    };

    const orderRef = doc(db, "users", userId, "orders", orderId);
    batch.set(orderRef, orderData);

    const globalOrderRef = doc(db, "orders", orderId);
    batch.set(globalOrderRef, orderData);

    const cartSnap = await getDocs(collection(db, "users", userId, "cart"));
    cartSnap.docs.forEach((d) => batch.delete(d.ref));

    const userRef = doc(db, "users", userId);
    batch.set(userRef, { orderHistory: arrayUnion(orderId) }, { merge: true });

    await batch.commit();
    return orderId;
}

/**
 * Fetch all orders for a user
 */
export async function fetchOrders(userId: string): Promise<Order[]> {
    const db = getClientDb();
    const ordersQuery = query(
        collection(db, "users", userId, "orders"),
        orderBy("createdAt", "desc")
    );
    const snap = await getDocs(ordersQuery);
    return snap.docs.map((d) => d.data() as Order);
}

/**
 * Fetch a single order by ID
 */
export async function fetchOrder(userId: string, orderId: string): Promise<Order | null> {
    const db = getClientDb();
    const snap = await getDocs(query(collection(db, "users", userId, "orders")));
    const orderDoc = snap.docs.find((d) => d.id === orderId);
    return orderDoc ? (orderDoc.data() as Order) : null;
}

/**
 * Update order status (admin/server only)
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const db = getClientDb();
    const globalOrderRef = doc(db, "orders", orderId);

    await getDocs(query(collection(db, "orders"))).then((snap) => {
        const orderDoc = snap.docs.find((d) => d.id === orderId);
        if (orderDoc) {
            const batch = writeBatch(db);
            const userRef = doc(db, "users", orderDoc.data().userId, "orders", orderId);
            batch.update(globalOrderRef, { status, updatedAt: Timestamp.now() });
            batch.update(userRef, { status, updatedAt: Timestamp.now() });
            return batch.commit();
        }
    });
}

/**
 * Fetch all orders (admin only)
 */
export async function fetchAllOrders(): Promise<Order[]> {
    const db = getClientDb();
    const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snap = await getDocs(ordersQuery);
    return snap.docs.map((d) => d.data() as Order);
}