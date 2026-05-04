import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WIshlistContext";
import { Toaster } from "react-hot-toast";

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
            <WishlistProvider>
              {/* Navbar (Top) */}
              <Navbar />

              {/* Page Content */}
              <main className="flex-1 flex flex-col">
                <Toaster
                  position="bottom-right"
                  reverseOrder={false}
                  gutter={8}
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: "#1a1a1a",
                      color: "#fff",
                      borderRadius: "12px",
                      fontSize: "14px",
                      fontWeight: "500",
                      padding: "16px 20px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    },
                    success: {
                      iconTheme: {
                        primary: "#10b981",
                        secondary: "#fff",
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: "#ef4444",
                        secondary: "#fff",
                      },
                    },
                  }}
                />
                {children}
              </main>

              {/* Footer (Bottom) */}
              <Footer /></WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
