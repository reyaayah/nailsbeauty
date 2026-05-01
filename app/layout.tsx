import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Gloss & Grace — Aesthetics Studio",
  description: "Premium press-on nails, crafted for your lifestyle.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>
            {/* Navbar (Top) */}
            <Navbar />

            {/* Page Content */}
            <main className="flex-1 flex flex-col">
              {children}
            </main>

            {/* Footer (Bottom) */}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
