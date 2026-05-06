// app/(shop)/layout.tsx
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WIshlistContext";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <WishlistProvider>
                <Navbar />
                <main className="flex-1 flex flex-col">
                    {children}
                </main>
                <Footer />
            </WishlistProvider>
        </CartProvider>
    );
}