// app/api/admin/password-reset/route.ts
import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin";
import nodemailer from "nodemailer";
import crypto from "crypto";

// ── Firebase Admin init (safe to call multiple times) ──────────────────────────
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
}

const db = admin.firestore();

// ── Nodemailer transporter ─────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Gmail App Password
    },
});

// ── OTP helpers ────────────────────────────────────────────────────────────────
function generateOtp() {
    return crypto.randomInt(100000, 999999).toString();
}

function otpDocRef(email: string) {
    return db.collection("adminOtps").doc(Buffer.from(email).toString("base64"));
}

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/admin/password-reset
// body: { action: "send" | "verify" | "reset", email, otp?, newPassword? }
// ══════════════════════════════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
    try {
        const { action, email, otp, newPassword } = await req.json();

        if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

        // ── 1. Verify this email belongs to an admin ───────────────────────────────
        let userRecord: admin.auth.UserRecord;
        try {
            userRecord = await admin.auth().getUserByEmail(email);
        } catch {
            // Return generic message to avoid email enumeration
            return NextResponse.json({ ok: true });
        }

        const adminSnap = await db.collection("admins").doc(userRecord.uid).get();
        if (!adminSnap.exists) {
            return NextResponse.json({ ok: true }); // silent — don't reveal
        }

        // ── SEND ──────────────────────────────────────────────────────────────────
        if (action === "send") {
            const code = generateOtp();
            const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

            await otpDocRef(email).set({ code, expiresAt, attempts: 0 });

            await transporter.sendMail({
                from: `"Nailsa Admin" <${process.env.SMTP_USER}>`,
                to: email,
                subject: "Your Nailsa Admin Verification Code",
                html: `
          <div style="font-family:Georgia,serif;max-width:480px;margin:auto;padding:40px 32px;background:#F7F3ED;border-radius:16px;">
            <div style="margin-bottom:32px;">
              <span style="font-size:11px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:#DBA1A2;">Nailsa · Admin Portal</span>
            </div>
            <h2 style="font-size:28px;color:#422B23;margin:0 0 8px;">Verification Code</h2>
            <p style="color:#888;font-size:13px;margin:0 0 32px;">Use the code below to reset your admin password. It expires in <strong>10 minutes</strong>.</p>
            <div style="background:#422B23;border-radius:12px;padding:24px;text-align:center;letter-spacing:0.5em;font-size:36px;font-weight:700;color:#DBA1A2;margin-bottom:32px;">
              ${code}
            </div>
            <p style="color:#aaa;font-size:11px;">If you didn't request this, ignore this email. Your account remains secure.</p>
          </div>
        `,
            });

            return NextResponse.json({ ok: true });
        }

        // ── VERIFY ────────────────────────────────────────────────────────────────
        if (action === "verify") {
            if (!otp) return NextResponse.json({ error: "OTP required" }, { status: 400 });

            const snap = await otpDocRef(email).get();
            if (!snap.exists) return NextResponse.json({ error: "No OTP found. Please request a new one." }, { status: 400 });

            const data = snap.data()!;

            if (Date.now() > data.expiresAt) {
                await otpDocRef(email).delete();
                return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
            }

            if (data.attempts >= 5) {
                await otpDocRef(email).delete();
                return NextResponse.json({ error: "Too many attempts. Please request a new code." }, { status: 429 });
            }

            if (data.code !== otp) {
                await otpDocRef(email).update({ attempts: admin.firestore.FieldValue.increment(1) });
                return NextResponse.json({ error: "Incorrect code. Please try again." }, { status: 400 });
            }

            // Mark as verified
            await otpDocRef(email).update({ verified: true });
            return NextResponse.json({ ok: true });
        }

        // ── RESET ─────────────────────────────────────────────────────────────────
        if (action === "reset") {
            if (!newPassword) return NextResponse.json({ error: "New password required" }, { status: 400 });

            const snap = await otpDocRef(email).get();
            if (!snap.exists || !snap.data()?.verified) {
                return NextResponse.json({ error: "OTP not verified. Please complete verification first." }, { status: 403 });
            }

            await admin.auth().updateUser(userRecord.uid, { password: newPassword });
            await otpDocRef(email).delete(); // clean up

            return NextResponse.json({ ok: true });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (err: any) {
        console.error("[password-reset]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}