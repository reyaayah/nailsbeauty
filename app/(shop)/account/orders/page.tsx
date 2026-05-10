"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Package, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import theme from "@/theme";
import { useAuth } from "@/context/AuthContext";
import { fetchOrders, Order, OrderStatus } from "@/lib/orderService";

const STATUS_STYLES: Record<OrderStatus, { bg: string; text: string; label: string }> = {
    pending: { bg: "#FEF3C7", text: "#92400E", label: "Pending" },
    confirmed: { bg: "#D1FAE5", text: "#065F46", label: "Confirmed" },
    shipped: { bg: "#DBEAFE", text: "#1E40AF", label: "Shipped" },
    delivered: { bg: "#F3F4F6", text: "#374151", label: "Delivered" },
    cancelled: { bg: "#FEE2E2", text: "#991B1B", label: "Cancelled" },
};

export default function OrdersPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            router.push("/login?redirect=/account/orders");
            return;
        }
        fetchOrders(user.uid)
            .then(setOrders)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.light }}>
                <Loader2 size={28} className="animate-spin" style={{ color: theme.colors.primary }} />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-10" style={{ backgroundColor: theme.colors.light }}>
            <div className="h-1.5 w-full" style={{ backgroundColor: theme.colors.primary }} />

            <div className="max-w-3xl mx-auto px-6 py-12">
                <div className="mb-10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mb-2"
                        style={{ color: theme.colors.dark }}>
                        Your Account
                    </p>
                    <h1 className="text-3xl font-serif italic" style={{ color: theme.colors.dark }}>
                        Order History
                    </h1>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-24 space-y-4">
                        <Package size={48} strokeWidth={1} style={{ color: theme.colors.muted }} className="mx-auto" />
                        <p className="text-lg font-serif italic" style={{ color: theme.colors.dark }}>
                            No orders yet
                        </p>
                        <p className="text-sm opacity-50" style={{ color: theme.colors.dark }}>
                            When you place an order, it will appear here.
                        </p>
                        <button
                            onClick={() => router.push("/products")}
                            className="px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase mt-2"
                            style={{ backgroundColor: theme.colors.dark, color: theme.colors.light }}
                        >
                            Shop Now
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const status = STATUS_STYLES[order.status];
                            const isOpen = expanded === order.id;
                            const date = order.createdAt
                                ? new Date(order.createdAt.seconds * 1000).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })
                                : "—";

                            return (
                                <div
                                    key={order.id}
                                    className="border rounded-2xl overflow-hidden transition-all"
                                    style={{ borderColor: `${theme.colors.dark}10` }}
                                >
                                    {/* Order header */}
                                    <button
                                        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-black/[0.02] transition-colors"
                                        onClick={() => setExpanded(isOpen ? null : order.id)}
                                    >
                                        <div className="flex flex-col gap-1">
                                            <span
                                                className="text-[10px] font-bold uppercase tracking-widest opacity-40"
                                                style={{ color: theme.colors.dark }}
                                            >
                                                {date}
                                            </span>
                                            <span className="text-sm font-bold font-mono" style={{ color: theme.colors.dark }}>
                                                {order.id}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span
                                                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                                                style={{ backgroundColor: status.bg, color: status.text }}
                                            >
                                                {status.label}
                                            </span>
                                            <span className="text-sm font-serif italic" style={{ color: theme.colors.dark }}>
                                                ${order.total.toFixed(2)}
                                            </span>
                                            {isOpen
                                                ? <ChevronUp size={14} style={{ color: theme.colors.muted }} />
                                                : <ChevronDown size={14} style={{ color: theme.colors.muted }} />}
                                        </div>
                                    </button>

                                    {/* Expanded order details */}
                                    {isOpen && (
                                        <div className="border-t px-6 py-5 space-y-5"
                                            style={{ borderColor: `${theme.colors.dark}08` }}>

                                            {/* Items */}
                                            <div className="space-y-3">
                                                {order.items.map((item) => (
                                                    <div
                                                        key={`${item.productId}-${item.size}-${item.shape}`}
                                                        className="flex gap-3 items-center"
                                                    >
                                                        <div className="relative w-12 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[#F2ECE4]">
                                                            <Image
                                                                src={item.image}
                                                                alt={item.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-serif truncate" style={{ color: theme.colors.dark }}>
                                                                {item.name}
                                                            </p>
                                                            <p className="text-[10px] opacity-40 mt-0.5" style={{ color: theme.colors.dark }}>
                                                                {[
                                                                    item.size && `Size: ${item.size}`,
                                                                    item.shape && `Shape: ${item.shape}`,
                                                                    `Qty: ${item.quantity}`,
                                                                ]
                                                                    .filter(Boolean)
                                                                    .join(" · ")}
                                                            </p>
                                                        </div>
                                                        <span className="text-sm font-semibold flex-shrink-0" style={{ color: theme.colors.dark }}>
                                                            £{(item.price * item.quantity).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Shipping + Totals grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t"
                                                style={{ borderColor: `${theme.colors.dark}08` }}>

                                                {/* Shipping address */}
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2"
                                                        style={{ color: theme.colors.dark }}>
                                                        Shipped To
                                                    </p>
                                                    <p className="text-sm" style={{ color: theme.colors.dark }}>
                                                        {order.shippingAddress.fullName}
                                                    </p>
                                                    <p className="text-sm opacity-50" style={{ color: theme.colors.dark }}>
                                                        {order.shippingAddress.line1}
                                                        {order.shippingAddress.line2
                                                            ? `, ${order.shippingAddress.line2}`
                                                            : ""}
                                                    </p>
                                                    <p className="text-sm opacity-50" style={{ color: theme.colors.dark }}>
                                                        {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                                                        {order.shippingAddress.zip}
                                                    </p>
                                                </div>

                                                {/* Cost breakdown */}
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2"
                                                        style={{ color: theme.colors.dark }}>
                                                        Summary
                                                    </p>
                                                    <div className="flex justify-between text-xs opacity-50"
                                                        style={{ color: theme.colors.dark }}>
                                                        <span>Subtotal</span>
                                                        <span>${order.subtotal.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs opacity-50"
                                                        style={{ color: theme.colors.dark }}>
                                                        <span>Shipping</span>
                                                        <span>
                                                            {order.shipping === 0 ? "Free" : `£${order.shipping.toFixed(2)}`}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm font-bold pt-1 border-t"
                                                        style={{ color: theme.colors.dark, borderColor: `${theme.colors.dark}10` }}>
                                                        <span>Total</span>
                                                        <span>${order.total.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}