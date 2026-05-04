import { NextRequest, NextResponse } from "next/server";
import { fetchWishlist, addToWishlist } from "@/lib/wishlistService";

function getUserId(request: NextRequest): string | null {
    return request.headers.get("x-user-id");
}

// GET
export async function GET(request: NextRequest) {
    try {
        const userId = getUserId(request);

        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const wishlist = await fetchWishlist(userId);

        return NextResponse.json(
            { success: true, data: wishlist },
            { status: 200 }
        );
    } catch (error) {
        console.error("[GET /api/wishlist]", error);

        return NextResponse.json(
            { success: false, error: "Failed to fetch wishlist" },
            { status: 500 }
        );
    }
}

// POST
export async function POST(request: NextRequest) {
    try {
        const userId = getUserId(request);

        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const productId = Number(body?.productId);

        if (!productId || isNaN(productId)) {
            return NextResponse.json(
                { success: false, error: "Invalid productId" },
                { status: 400 }
            );
        }

        await addToWishlist(userId, productId);

        return NextResponse.json(
            { success: true },
            { status: 201 }
        );
    } catch (error) {
        console.error("[POST /api/wishlist]", error);

        return NextResponse.json(
            { success: false, error: "Failed to add to wishlist" },
            { status: 500 }
        );
    }
}