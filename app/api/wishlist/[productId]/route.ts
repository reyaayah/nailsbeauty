import { NextRequest, NextResponse } from "next/server";
import { removeFromWishlist } from "@/lib/wishlistService";

function getUserId(request: NextRequest): string | null {
    return request.headers.get("x-user-id");
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ productId: string }> }
) {
    try {
        const userId = getUserId(request);

        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { productId } = await context.params;

        const id = Number(productId);

        if (isNaN(id)) {
            return NextResponse.json(
                { success: false, error: "Invalid productId" },
                { status: 400 }
            );
        }

        await removeFromWishlist(userId, id);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("[DELETE /api/wishlist]", error);

        return NextResponse.json(
            { success: false, error: "Failed to remove item" },
            { status: 500 }
        );
    }
}