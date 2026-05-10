import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// ── Firebase Admin (singleton) ────────────────────────────────────────────────
if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

const db = getFirestore();

// ── Nodemailer (Gmail SMTP) ───────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        // 1. Validate
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // 2. Check Firestore for duplicate
        const docRef = db.collection('newsletter_subscribers').doc(normalizedEmail);
        const existing = await docRef.get();

        if (existing.exists) {
            return NextResponse.json(
                { error: 'This email is already subscribed.' },
                { status: 409 } // 409 Conflict
            );
        }

        // 3. Save to Firestore
        await docRef.set({
            email: normalizedEmail,
            subscribedAt: new Date().toISOString(),
        });

        // 4. Welcome email → subscriber
        await transporter.sendMail({
            from: `"Nailsa" <${process.env.SMTP_FROM}>`,
            to: normalizedEmail,
            subject: 'Welcome to the Nailsa Family 💅',
            html: `
                <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; color: #1a1a1a;">
                    <h1 style="font-size: 22px; font-weight: normal; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px;">
                        Welcome to the Family
                    </h1>
                    <p style="font-size: 15px; line-height: 1.8; color: #444; margin-bottom: 24px;">
                        Thank you for subscribing. You're now part of the Nailsa family — 
                        expect exclusive offers, beauty tips, and the latest trend updates 
                        delivered straight to your inbox.
                    </p>
                    <a href="https://nailsa.co.uk/collections"
                       style="display: inline-block; padding: 12px 28px; background-color: #1a1a1a; color: #fff;
                              text-decoration: none; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">
                        Shop Now
                    </a>
                    <p style="font-size: 11px; color: #aaa; margin-top: 48px; line-height: 1.6;">
                        You're receiving this because you subscribed at nailsa.co.uk.<br />
                        69a Upper Abbey Road, Belvedere, DA17 5AF, London, UK.
                    </p>
                </div>
            `,
        });

        // 5. Notification email → you
        await transporter.sendMail({
            from: `"Nailsa" <${process.env.SMTP_FROM}>`,
            to: process.env.SMTP_FROM,
            subject: `New subscriber: ${normalizedEmail}`,
            html: `<p>New newsletter subscriber: <strong>${normalizedEmail}</strong></p>`,
        });

        return NextResponse.json({ ok: true });

    } catch (error) {
        console.error('Newsletter error:', error);
        return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
    }
}