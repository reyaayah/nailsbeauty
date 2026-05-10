// app/products/page.tsx  ← SERVER component (no "use client")

import AllProductsPage from "@/components/AllProductsPage";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nailsaltd.co.uk/";
export const metadata: Metadata = {
    title: "The Collection | Salon-Quality Nails at Home",
    description:
        "Browse our full nail collection — gel sets, press-ons, and nail art kits. Filter by shape, length, and style to find your perfect set.",
    keywords: [
        "nail collection",
        "gel nails",
        "press on nails",
        "nail art",
        "nail shapes",
        "nail lengths",
        "salon nails at home",
    ],
    alternates: {
        canonical: `${BASE_URL}/products`,
    },
    openGraph: {
        type: "website",
        url: `${BASE_URL}/products`,
        title: "The Collection | Salon-Quality Nails at Home",
        description:
            "Browse our full nail collection — gel sets, press-ons, and nail art kits. Filter by shape, length, and style to find your perfect set.",
        siteName: "Your Brand Name",
        images: [
            {
                url: `${BASE_URL}/og/products.jpg`,
                width: 1200,
                height: 630,
                alt: "The Nail Collection",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "The Collection | Salon-Quality Nails at Home",
        description:
            "Browse our full nail collection — gel sets, press-ons, and nail art kits.",
        images: [`${BASE_URL}/og/products.jpg`],
        creator: "@yourbrandhandle",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
        },
    },
};

export default function ProductsPage() {
    return <AllProductsPage />;
}