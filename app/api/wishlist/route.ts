import { NextRequest, NextResponse } from "next/server";
import { fetchWishlist, addToWishlist } from "@/lib/wishlistService";
import { verifyUser } from "@/lib/verifyAuth";

// GET
export async function GET(request: NextRequest) {
    try {
        const userId = await verifyUser(request);

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
        const userId = await verifyUser(request);

        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { success: false, error: "Invalid JSON body" },
                { status: 400 }
            );
        }

        // Firestore IDs are strings — accept any non-empty string
        const productId = body?.productId;

        if (!productId || typeof productId !== "string" || productId.trim() === "") {
            return NextResponse.json(
                { success: false, error: "Invalid productId" },
                { status: 400 }
            );
        }

        await addToWishlist(userId, productId.trim());

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