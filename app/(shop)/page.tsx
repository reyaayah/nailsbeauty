import type { Metadata } from "next";

import AsSeenIn from "@/components/AsSeenIn";
import BestSellers from "@/components/ProductsSection";
import ByStyle from "@/components/ByStyle";
import DealsSection from "@/components/DealsSection";
import Features from "@/components/Features";
import HeroSlider from "@/components/HeroSection";
import HeroWithProducts from "@/components/HeroWithProducts";
import MarqueeBanner from "@/components/MarqueeBanner";
import ReviewCarousel from "@/components/ReviewSection";
import ShopByShape from "@/components/ShopByShape";

export const metadata: Metadata = {
    title: "Nailsa | Luxury Press-On Nails for Every Occasion",
    description:
        "Shop luxury reusable press-on nails with salon-quality finishes. Discover trendy nail collections, shapes, and styles for every occasion.",
    keywords: [
        "press on nails",
        "luxury nails",
        "reusable nails",
        "fake nails",
        "salon quality nails",
        "nail collections",
        "beauty products",
        "glam nails",
    ],
    alternates: {
        canonical: "https://nailsbeauty.vercel.app",
    },
    openGraph: {
        title: "Luxury Press-On Nails | Nailsa Beauty",
        description:
            "Discover premium reusable press-on nails designed for effortless beauty.",
        url: "https://nailsbeauty.vercel.app",
        siteName: "Nailsa Beauty",
        images: [
            {
                url: "/nails1.png",
                width: 1200,
                height: 630,
                alt: "Luxury Press-On Nails",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Luxury Press-On Nails | Nails Beauty",
        description:
            "Luxury reusable press-on nails for every style and occasion.",
        images: ["/nails1.png"],
    },
};

export default function Home() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center min-h-screen">
            <main className="flex flex-1 w-full flex-col items-center justify-between bg-white sm:items-start">

                {/* Hidden SEO Heading */}
                <h1 className="sr-only">
                    Luxury reusable press-on nails for every occasion
                </h1>

                <HeroSlider />
                <MarqueeBanner />
                <DealsSection />
                <BestSellers />
                <ShopByShape />
                <AsSeenIn />
                <ByStyle />
                <Features />
                <HeroWithProducts />
                <ReviewCarousel />
            </main>
        </div>
    );
}