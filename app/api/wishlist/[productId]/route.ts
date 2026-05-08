// app/api/wishlist/[productId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { removeFromWishlist } from "@/lib/wishlistService";
import { verifyUser } from "@/lib/verifyAuth";

// app/api/wishlist/[productId]/route.ts
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ productId: string }> }  // ← Promise type
) {
    try {
        const userId = await verifyUser(request);

        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { productId } = await params;  // ← await it

        if (!productId || productId.trim() === "") {
            return NextResponse.json(
                { success: false, error: "Invalid productId" },
                { status: 400 }
            );
        }

        await removeFromWishlist(userId, productId.trim());

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("[DELETE /api/wishlist/:productId]", error);
        return NextResponse.json(
            { success: false, error: "Failed to remove from wishlist" },
            { status: 500 }
        );
    }
}