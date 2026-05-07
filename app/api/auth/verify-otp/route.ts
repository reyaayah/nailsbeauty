/**
 * app/api/auth/verify-otp/route.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Validates a submitted OTP against the stored record.
 *
 * POST /api/auth/verify-otp
 * Body: { email: string; otp: string }
 *
 * Returns { success: true } on match, error payload otherwise.
 * Once verified, marks the doc so it cannot be reused.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const COLLECTION = "emailOtps";
const MAX_ATTEMPTS = 5;   // brute-force guard

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const email: string = (body?.email ?? "").trim().toLowerCase();
        const submittedOtp: string = (body?.otp ?? "").trim();

        if (!email || !submittedOtp) {
            return NextResponse.json({ error: "Email and code are required." }, { status: 400 });
        }

        const docId = Buffer.from(email).toString("base64");
        const docRef = adminDb.collection(COLLECTION).doc(docId);
        const snap = await docRef.get();

        /* ── No record found ───────────────────────────────────────────── */
        if (!snap.exists) {
            return NextResponse.json(
                { error: "Verification code not found. Please request a new one." },
                { status: 404 }
            );
        }

        const data = snap.data()!;
        const now = Date.now();
        const attempts = (data.attempts ?? 0) + 1;

        /* ── Already verified ──────────────────────────────────────────── */
        if (data.verified) {
            return NextResponse.json(
                { error: "This code has already been used." },
                { status: 400 }
            );
        }

        /* ── Expired ────────────────────────────────────────────────────── */
        if (now > data.expiresAt) {
            await docRef.update({ attempts, updatedAt: FieldValue.serverTimestamp() });
            return NextResponse.json(
                { error: "Verification code has expired. Please request a new one." },
                { status: 410 }
            );
        }

        /* ── Too many wrong attempts ────────────────────────────────────── */
        if (attempts > MAX_ATTEMPTS) {
            return NextResponse.json(
                { error: "Too many incorrect attempts. Please request a new code." },
                { status: 429 }
            );
        }

        /* ── Wrong OTP ──────────────────────────────────────────────────── */
        if (submittedOtp !== data.otp) {
            await docRef.update({ attempts, updatedAt: FieldValue.serverTimestamp() });
            const remaining = MAX_ATTEMPTS - attempts;
            return NextResponse.json(
                {
                    error: remaining > 0
                        ? `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
                        : "Too many incorrect attempts. Please request a new code.",
                },
                { status: 400 }
            );
        }

        /* ── Success ────────────────────────────────────────────────────── */
        await docRef.update({
            verified: true,
            verifiedAt: FieldValue.serverTimestamp(),
            attempts,
            updatedAt: FieldValue.serverTimestamp(),
        });

        return NextResponse.json({ success: true });

    } catch (err) {
        console.error("[verify-otp] Error:", err);
        return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
    }
}