// app/api/discounts/validate/route.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * Discount codes definition.
 * In production you'd query these from Firestore / your DB.
 *
 * type: "percentage" → value is % off (0-100)
 * type: "fixed"      → value is $ amount off
 * minOrder           → optional minimum subtotal required
 * maxUses            → optional usage cap (tracked in DB in production)
 */
const DISCOUNT_CODES: Record<
    string,
    {
        type: "percentage" | "fixed";
        value: number;
        label: string;
        minOrder?: number;
        active: boolean;
    }
> = {
    WELCOME10: { type: "percentage", value: 10, label: "10% off", active: true },
    SAVE5: { type: "fixed", value: 5, label: "$5 off", active: true, minOrder: 30 },
    FREESHIP: { type: "fixed", value: 9.99, label: "$9.99 off shipping", active: true, minOrder: 0 },
    // Add more codes here or fetch from Firestore
};

export async function POST(req: NextRequest) {
    try {
        const { code, subtotal = 0 } = await req.json();

        if (!code || typeof code !== "string") {
            return NextResponse.json(
                { valid: false, message: "Please enter a discount code." },
                { status: 400 }
            );
        }

        const normalised = code.trim().toUpperCase();
        const coupon = DISCOUNT_CODES[normalised];

        if (!coupon || !coupon.active) {
            return NextResponse.json(
                { valid: false, message: "This code is invalid or has expired." },
                { status: 200 }
            );
        }

        if (coupon.minOrder && subtotal < coupon.minOrder) {
            return NextResponse.json(
                {
                    valid: false,
                    message: `This code requires a minimum order of $${coupon.minOrder.toFixed(2)}.`,
                },
                { status: 200 }
            );
        }

        return NextResponse.json({
            valid: true,
            type: coupon.type,
            value: coupon.value,
            label: coupon.label,
            message: `Code applied — ${coupon.label}!`,
        });
    } catch {
        return NextResponse.json(
            { valid: false, message: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}