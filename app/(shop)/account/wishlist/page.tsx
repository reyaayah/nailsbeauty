// app/wishlist/page.tsx
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Heart, Loader2, ShoppingBag } from "lucide-react";
import theme from "@/theme";
import { useWishlist } from "@/context/WIshlistContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import { products } from "@/data/product";
import MainProductCard from "@/components/cards/MainProductCard";

export default function WishlistPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { wishlist, loading, removeItem } = useWishlist();
    const { addToCart } = useCart();

    // ── Map wishlist IDs → full Product objects ───────────────────────────────
    const wishlistProducts = useMemo(
        () => products.filter((p) => wishlist.includes(p.id)),
        [wishlist]
    );

    // ── Move all to cart ──────────────────────────────────────────────────────
    const handleMoveAllToCart = async () => {
        if (!user) {
            router.push("/auth/login");
            return;
        }
        try {
            await Promise.all(
                wishlistProducts.map(async (product) => {
                    const defaultSize = product.sizes?.[0] ?? "M";
                    const defaultShape = product.shape ?? "Almond";
                    await addToCart(product, defaultSize, defaultShape);
                    await removeItem(product.id);
                })
            );
            toast.success("All items moved to bag!");
        } catch {
            toast.error("Something went wrong, please try again.");
        }
    };

    // ── Not logged in ─────────────────────────────────────────────────────────
    if (!user) {
        return (
            <div
                className="min-h-screen flex flex-col items-center justify-center gap-6 font-sans px-6 pt-10"
                style={{ backgroundColor: theme.colors.light, color: theme.colors.dark }}
            >
                <Heart size={48} strokeWidth={1} style={{ color: theme.colors.primary }} />
                <h2 className="text-3xl font-serif italic">Your Wishlist Awaits</h2>
                <p className="text-sm opacity-60 text-center max-w-sm">
                    Sign in to save your favourite pieces and access them anytime.
                </p>
                <button
                    onClick={() => router.push("/auth/login")}
                    className="px-10 py-4 rounded-full font-bold text-white uppercase tracking-widest text-xs transition-all hover:brightness-105"
                    style={{ backgroundColor: theme.colors.primary }}
                >
                    Sign In
                </button>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen font-sans pt-10"
            style={{ backgroundColor: theme.colors.light, color: theme.colors.dark }}
        >
            {/* ── Romantic Header ──────────────────────────────────────────── */}
            <header
                className="py-20 px-6 text-center bg-white/40 backdrop-blur-sm border-b"
                style={{ borderColor: theme.colors.muted }}
            >
                <span className="text-xs uppercase tracking-[0.3em] opacity-60 mb-2 block">
                    Your Personal Collection
                </span>
                <h1 className="text-4xl md:text-6xl font-serif italic font-medium mb-4">
                    The Wishlist
                </h1>
                <div
                    className="w-12 h-[1px] mx-auto mb-6"
                    style={{ backgroundColor: theme.colors.primary }}
                />
                <p className="text-sm md:text-base max-w-lg mx-auto opacity-70">
                    A curated space for your favourite handcrafted sets. Ready to bring them home?
                </p>

                {/* Item count + Move All CTA */}
                {!loading && wishlistProducts.length > 0 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <span
                            className="text-xs uppercase tracking-widest opacity-50"
                        >
                            {wishlistProducts.length}{" "}
                            {wishlistProducts.length === 1 ? "item" : "items"}
                        </span>
                        <button
                            onClick={handleMoveAllToCart}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-white transition-all hover:brightness-105 shadow-md"
                            style={{ backgroundColor: theme.colors.primary }}
                        >
                            <ShoppingBag size={13} />
                            Move All to Bag
                        </button>
                    </div>
                )}
            </header>

            <main className="max-w-7xl mx-auto px-6 py-16">

                {/* ── Loading state ──────────────────────────────────────── */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2
                            size={32}
                            className="animate-spin"
                            style={{ color: theme.colors.primary }}
                        />
                        <p className="text-sm opacity-50 tracking-widest uppercase">
                            Loading your collection...
                        </p>
                    </div>
                )}

                {/* ── Wishlist grid ──────────────────────────────────────── */}
                {!loading && wishlistProducts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {wishlistProducts.map((product) => (
                            <MainProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {/* ── Empty state ────────────────────────────────────────── */}
                {!loading && wishlistProducts.length === 0 && (
                    <div className="text-center py-32 flex flex-col items-center gap-6">
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${theme.colors.primary}15` }}
                        >
                            <Heart
                                size={32}
                                strokeWidth={1.5}
                                style={{ color: theme.colors.primary }}
                            />
                        </div>
                        <div>
                            <p className="text-xl font-serif italic mb-2">
                                Your wishlist is empty
                            </p>
                            <p className="text-sm opacity-50">
                                Save pieces you love and come back to them anytime.
                            </p>
                        </div>
                        <Link
                            href="/collections"
                            className="mt-2 px-10 py-4 rounded-full font-bold text-white uppercase tracking-widest text-xs transition-all hover:brightness-105"
                            style={{ backgroundColor: theme.colors.primary }}
                        >
                            Explore Collection
                        </Link>
                    </div>
                )}
            </main>

            {/* ── Footer detail ──────────────────────────────────────────── */}
            <section
                className="py-20 px-6 border-t"
                style={{ borderColor: theme.colors.muted }}
            >
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <h4 className="font-serif text-2xl italic">Need a custom fit?</h4>
                    <p className="text-sm opacity-70">
                        If your favourite sets aren't in your size, we offer handcrafted
                        custom sizing for that perfect, radiant look.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a
                            href="/size-guide"
                            className="text-xs font-bold uppercase border-b-2 transition-colors hover:opacity-50"
                            style={{ borderBottomColor: theme.colors.primary }}
                        >
                            Size Guide
                        </a>
                        <a
                            href="/customization-service"
                            className="text-xs font-bold uppercase border-b-2 transition-colors hover:opacity-50"
                            style={{ borderBottomColor: theme.colors.primary }}
                        >
                            Custom Inquiry
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}