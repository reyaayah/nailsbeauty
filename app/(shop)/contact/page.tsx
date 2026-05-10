// app/contact/page.tsx  ← SERVER component (no "use client")

import ContactUs from "@/components/Contact";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nailsaltd.co.uk/";

export const metadata: Metadata = {
    title: "Contact Us | Nailsa Ltd",
    description:
        "Get in touch with Nailsa Ltd. Questions about your order, shipping, or need a nail consultation? We're available Mon–Fri, 9am–6pm GMT.",
    alternates: {
        canonical: `${BASE_URL}/contact`,
    },
    openGraph: {
        type: "website",
        url: `${BASE_URL}/contact`,
        title: "Contact Us | Nailsa Ltd",
        description:
            "Reach out to the Nailsa team for order inquiries, shipping questions, or personalised nail consultations.",
        siteName: "Nailsa Ltd",
        images: [
            {
                url: `${BASE_URL}/og/contact.jpg`,
                width: 1200,
                height: 630,
                alt: "Contact Nailsa Ltd",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact Us | Nailsa Ltd",
        description:
            "Reach out to the Nailsa team for order inquiries, shipping questions, or personalised nail consultations.",
        images: [`${BASE_URL}/og/contact.jpg`],
        creator: "@nailsaltd",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function ContactPage() {
    return <ContactUs />;
}