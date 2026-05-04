import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/orderService";

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await context.params;
        const { status } = await req.json();

        if (!["pending", "confirmed", "shipped", "delivered", "cancelled"].includes(status)) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
            );
        }

        await updateOrderStatus(orderId, status);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update order" },
            { status: 500 }
        );
    }
}