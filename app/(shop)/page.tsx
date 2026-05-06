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


export default function Home() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center min-h-screen">
            <main className="flex flex-1 w-full flex-col items-center justify-between bg-white sm:items-start">
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
