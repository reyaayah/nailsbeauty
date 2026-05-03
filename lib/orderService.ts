/**
 * orderService.ts
 * Creates and fetches orders in Firestore.
 *
 * Collection path: users/{uid}/orders/{orderId}
 * Also mirrored to: orders/{orderId}  (for admin access)
 */

import {
    collection,
    doc,
    setDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import { CartItem } from "@/context/CartContext";
import { getDbInstance, initializeFirebase } from "./firebase/FirebaseConfig";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
    productId: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
    shape: string;
}

export interface ShippingAddress {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export interface Order {
    id: string;
    uid: string;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    status: OrderStatus;
    shippingAddress: ShippingAddress;
    paymentMethod: string; // e.g. "card_ending_4242"
    createdAt: Timestamp | null;
}

function generateOrderId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
}

/** Place a new order and return the order ID */
export async function placeOrder(
    uid: string,
    cartItems: CartItem[],
    subtotal: number,
    shippingAddress: ShippingAddress,
    paymentMethod = "card_ending_4242"
): Promise<string> {
    await initializeFirebase();
    const db = getDbInstance();
    const orderId = generateOrderId();
    const shipping = subtotal >= 70 ? 0 : 9.99;
    const total = subtotal + shipping;

    const orderItems: OrderItem[] = cartItems.map(({ product, quantity, size, shape }) => ({
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
        size,
        shape,
    }));

    const orderData: Omit<Order, "id"> = {
        uid,
        items: orderItems,
        subtotal,
        shipping,
        total,
        status: "confirmed",
        shippingAddress,
        paymentMethod,
        createdAt: serverTimestamp() as Timestamp,
    };

    // Write to user's sub-collection
    await setDoc(doc(db, "users", uid, "orders", orderId), orderData);

    // Mirror to top-level orders collection (for admin/fulfillment)
    await setDoc(doc(db, "orders", orderId), { ...orderData, uid });

    return orderId;
}

/** Fetch all orders for a user, newest first */
export async function fetchOrders(uid: string): Promise<Order[]> {
    await initializeFirebase();
    const db = getDbInstance();
    const q = query(
        collection(db, "users", uid, "orders"),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}