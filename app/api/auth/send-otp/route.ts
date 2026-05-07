/**
 * app/api/auth/send-otp/route.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Generates a 6-digit OTP, stores it in Firestore (`emailOtps` collection)
 * with a 10-minute TTL, and sends it to the requested email.
 *
 * POST /api/auth/send-otp
 * Body: { email: string }
 *
 * Rate-limited: max 3 requests per email per 10 minutes.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import nodemailer from "nodemailer";
import { FieldValue } from "firebase-admin/firestore";

/* ─── Config ──────────────────────────────────────────────────────────────── */
const OTP_TTL_MS = 10 * 60 * 1000;   // 10 minutes
const MAX_SENDS = 3;                  // max resends per window
const COLLECTION = "emailOtps";

/* ─── Mailer (configure via env vars) ───────────────────────────────────────
 *  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 *  For development, set SMTP_HOST=smtp.ethereal.email and use Ethereal creds.
 * ─────────────────────────────────────────────────────────────────────────── */
function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST!,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER!,
            pass: process.env.SMTP_PASS!,
        },
    });
}

function generateOtp(): string {
    return Math.floor(100_000 + Math.random() * 900_000).toString();
}

/* ─── Handler ─────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const email: string = (body?.email ?? "").trim().toLowerCase();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
        }

        const docId = Buffer.from(email).toString("base64");
        const docRef = adminDb.collection(COLLECTION).doc(docId);
        const snap = await docRef.get();
        const now = Date.now();

        /* ── Rate-limit check ───────────────────────────────────────────── */
        if (snap.exists) {
            const data = snap.data()!;
            const windowStart: number = data.windowStart ?? 0;
            const sendCount: number = data.sendCount ?? 0;

            if (now - windowStart < OTP_TTL_MS && sendCount >= MAX_SENDS) {
                return NextResponse.json(
                    { error: "Too many requests. Please wait a few minutes before trying again." },
                    { status: 429 }
                );
            }
        }

        /* ── Generate & persist OTP ─────────────────────────────────────── */
        const otp = generateOtp();
        const expiresAt = now + OTP_TTL_MS;

        const existingData = snap.exists ? snap.data()! : {};
        const windowStart = snap.exists && (now - (existingData.windowStart ?? 0)) < OTP_TTL_MS
            ? existingData.windowStart
            : now;
        const newSendCount = snap.exists && windowStart === existingData.windowStart
            ? (existingData.sendCount ?? 0) + 1
            : 1;

        await docRef.set({
            email,
            otp,                   // NOTE: hash in production with bcrypt if you want extra security
            expiresAt,
            verified: false,
            sendCount: newSendCount,
            windowStart,
            updatedAt: FieldValue.serverTimestamp(),
        });

        /* ── Send email ─────────────────────────────────────────────────── */
        const transporter = createTransporter();
        const brandName = process.env.NEXT_PUBLIC_BRAND_NAME ?? "Nailsa";
        const fromAddress = process.env.SMTP_FROM ?? `"${brandName}" <no-reply@Nailsa.com>`;

        await transporter.sendMail({
            from: fromAddress,
            to: email,
            subject: `${otp} is your ${brandName} verification code`,
            text: `Your verification code is: ${otp}\n\nThis code expires in 10 minutes. Do not share it with anyone.`,
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>
<body style="margin:0;padding:0;background:#f8f5f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f5f0;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:16px;overflow:hidden;
                      box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a1a;padding:32px 40px;text-align:center;">
              <span style="color:#ffffff;font-size:22px;font-weight:700;
                           letter-spacing:0.05em;font-family:Georgia,serif;">
                ${brandName}
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;font-size:14px;color:#6b7280;font-weight:500;
                         text-transform:uppercase;letter-spacing:0.1em;">
                Email Verification
              </p>
              <h1 style="margin:0 0 24px;font-size:26px;font-weight:700;color:#1a1a1a;
                          line-height:1.2;">
                Verify your email address
              </h1>
              <p style="margin:0 0 32px;font-size:15px;color:#4b5563;line-height:1.6;">
                Use the code below to complete your account registration.
                It expires in <strong>10 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <div style="background:#f8f5f0;border-radius:12px;padding:28px;
                           text-align:center;margin-bottom:32px;
                           border:2px dashed #e5e0d8;">
                <span style="font-size:42px;font-weight:800;letter-spacing:0.3em;
                              color:#1a1a1a;font-family:'Courier New',monospace;">
                  ${otp}
                </span>
              </div>

              <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.5;">
                If you did not request this code, you can safely ignore this email.
                Never share this code with anyone.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8f5f0;padding:20px 40px;text-align:center;
                        border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                © ${new Date().getFullYear()} ${brandName}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
        });

        return NextResponse.json({ success: true, expiresIn: OTP_TTL_MS / 1000 });

    } catch (err) {
        console.error("[send-otp] Error:", err);
        return NextResponse.json({ error: "Failed to send verification email. Please try again." }, { status: 500 });
    }
}