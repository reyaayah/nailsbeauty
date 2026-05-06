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
import { getDbInstance } from "@/lib/firebase/FirebaseConfig";
import { CartItem } from "@/context/CartContext";

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
    productId: number;
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
    shipping: number;
    total: number;
    status: OrderStatus;
    paymentMethod: string;
    shippingAddress: ShippingAddress;
    notes?: string;
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
    paymentMethod: string
): Promise<string> {
    const db = getDbInstance();
    const batch = writeBatch(db);

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Prepare order items
    const orderItems: OrderItem[] = items.map(({ product, quantity, size, shape }) => ({
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
        size,
        shape,
    }));

    // Calculate shipping
    const shippingCost = subtotal >= 70 ? 0 : 9.99;

    const orderData = {
        id: orderId,
        userId,
        items: orderItems,
        subtotal,
        shipping: shippingCost,
        total: subtotal + shippingCost,
        status: "pending" as OrderStatus,
        paymentMethod,
        shippingAddress,
        notes: null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    };

    // Create order document in /users/{uid}/orders/{orderId}
    const orderRef = doc(db, "users", userId, "orders", orderId);
    batch.set(orderRef, orderData);

    // Also add to global orders collection for admin queries
    const globalOrderRef = doc(db, "orders", orderId);
    batch.set(globalOrderRef, orderData);

    // Clear cart items
    const cartSnap = await getDocs(collection(db, "users", userId, "cart"));
    cartSnap.docs.forEach((d) => batch.delete(d.ref));

    // Update user's orderHistory array — set+merge so it works even if the
    // user document doesn't exist yet (new users placing their first order)
    const userRef = doc(db, "users", userId);
    batch.set(userRef, { orderHistory: arrayUnion(orderId) }, { merge: true });

    await batch.commit();
    return orderId;
}

/**
 * Fetch all orders for a user
 */
export async function fetchOrders(userId: string): Promise<Order[]> {
    const db = getDbInstance();
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
    const db = getDbInstance();
    const orderRef = doc(db, "users", userId, "orders", orderId);
    const snap = await getDocs(query(collection(db, "users", userId, "orders")));
    const orderDoc = snap.docs.find((d) => d.id === orderId);
    return orderDoc ? (orderDoc.data() as Order) : null;
}

/**
 * Update order status (admin/server only)
 */
export async function updateOrderStatus(
    orderId: string,
    status: OrderStatus
): Promise<void> {
    const db = getDbInstance();
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
    const db = getDbInstance();
    const ordersQuery = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc")
    );
    const snap = await getDocs(ordersQuery);
    return snap.docs.map((d) => d.data() as Order);
}