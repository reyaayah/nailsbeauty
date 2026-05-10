// app/api/contact/route.ts

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, subject, message } = body;

        // ── Server-side validation ──────────────────────────────────────────────
        if (!firstName || !lastName || !email || !subject || !message) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
        }

        // ── Nodemailer transporter using next.config.ts SMTP vars ───────────────
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,                        // smtp.gmail.com
            port: Number(process.env.SMTP_PORT),                // 587
            secure: process.env.SMTP_SECURE === 'true',         // false for port 587
            auth: {
                user: process.env.SMTP_USER,                      // riyaawal7@gmail.com
                pass: process.env.SMTP_PASS,                      // vlpl brnz njxs ptpp
            },
        });

        // ── Email to your team ──────────────────────────────────────────────────
        await transporter.sendMail({
            from: `"${process.env.NEXT_PUBLIC_BRAND_NAME} Contact Form" <${process.env.SMTP_FROM}>`,
            to: process.env.SMTP_FROM,   // receives at your own address
            replyTo: email,
            subject: `[Contact Form] ${subject} — ${firstName} ${lastName}`,
            html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:auto;padding:32px;background:#FAF7F3;border-radius:12px;">
          <h2 style="color:#422B23;">New Contact Form Submission</h2>
          <p style="color:#999;font-size:13px;margin-bottom:24px;">Received via nailsaltd.co.uk</p>
          <table style="width:100%;font-size:14px;">
            <tr>
              <td style="padding:8px 0;color:#888;width:120px;">Name</td>
              <td style="font-weight:bold;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#888;">Email</td>
              <td><a href="mailto:${email}" style="color:#A0522D;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#888;">Subject</td>
              <td>${subject}</td>
            </tr>
          </table>
          <hr style="border:none;border-top:1px solid #E0D8D0;margin:20px 0;"/>
          <p style="color:#888;font-size:13px;">MESSAGE</p>
          <p style="line-height:1.7;white-space:pre-wrap;">${message}</p>
          <p style="margin-top:32px;font-size:12px;color:#bbb;text-align:center;">
            © 2024 ${process.env.NEXT_PUBLIC_BRAND_NAME} Nails · Handcrafted Excellence
          </p>
        </div>`,
        });

        // ── Auto-reply to sender ────────────────────────────────────────────────
        await transporter.sendMail({
            from: `"${process.env.NEXT_PUBLIC_BRAND_NAME} Nails" <${process.env.SMTP_FROM}>`,
            to: email,
            subject: `We've received your message, ${firstName}! 💅`,
            html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:auto;padding:32px;background:#FAF7F3;border-radius:12px;">
          <h2 style="color:#422B23;">Thank you, ${firstName}!</h2>
          <p style="line-height:1.7;color:#555;">
            We've received your message and our team will get back to you within <strong>24–48 hours</strong>.
          </p>
          <p style="line-height:1.7;color:#555;">
            In the meantime, tag us in your <strong>#NailsaMagic</strong> moments! 💅✨
          </p>
          <hr style="border:none;border-top:1px solid #E0D8D0;margin:24px 0;"/>
          <p style="font-size:13px;color:#aaa;">
            Your message: <em>"${message.slice(0, 120)}${message.length > 120 ? '…' : ''}"</em>
          </p>
          <p style="margin-top:32px;font-size:12px;color:#bbb;text-align:center;">
            © 2024 ${process.env.NEXT_PUBLIC_BRAND_NAME} Nails · Handcrafted Excellence
          </p>
        </div>`,
        });

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error: any) {
        console.error('[Contact API Error]', {
            message: error.message,
            code: error.code,
            response: error.response,
        });
        return NextResponse.json(
            { error: 'Failed to send message. Please try again later.', detail: error.message },
            { status: 500 }
        );
    }
}