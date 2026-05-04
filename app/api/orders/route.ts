// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchAllOrders, Order } from "@/lib/orderService";

export async function GET(req: NextRequest) {
    try {
        const orders = await fetchAllOrders();
        return NextResponse.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}
