// app/products/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
    Plus, Minus, Heart, Ruler, Loader2, ShoppingBag, X,
    Truck,
    RefreshCw,
    TrendingUp
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import theme from "@/theme";
import ApplicationGuide from "@/components/ApplicationGuide";
import VideoReviews from "@/components/VideoReviews";
import Faqs from "@/components/Faqs";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/types/product";
import { useWishlist } from "@/context/WIshlistContext";

// Product data - replace with API call in production
const PRODUCTS: Record<number, Product & { sizes: string[], features: string[] }> = {
    1: {
        id: 1,
        name: "Midnight Muse",
        price: 64.00,
        description: "A deep, high-gloss obsidian finish meeting an almond silhouette. These aren't just nails; they're an evening mood. Engineered with reinforced gel technology for a glass-like shine that withstands the chaos of daily life.",
        image: "/product1.png",
        hoverImage: "/backimg1.png",
        images: ["/product1.png", "/backimg1.png"],
        features: [
            "Salon-grade finish",
            "Reinforcement Gel Layer",
            "Waterproof & Chip-proof",
            "Eco-friendly & Vegan"
        ],
        sizes: ["XS", "S", "M", "L"],
        category: "Press-on Nails",
        isNew: true,
        isBestSeller: true,
        reviews: 124,
        rating: 5,
    },
    // Add more products as needed
};

// Shape options for all products
const SHAPE_OPTIONS = ["Almond", "Square", "Coffin", "Oval"];

function useProduct(id: string) {
    const [product, setProduct] = useState<Product | null>(null);
    const [related, setRelated] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError(null);

        fetch(`/api/products/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Product not found");
                return res.json();
            })
            .then((data) => {
                setProduct(data.product);
                setRelated(data.related ?? []);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    return { product, related, loading, error };
}

export default function ProductDetails() {
    const router = useRouter();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist();
    const params = useParams();
    const productId = parseInt(params.id as string);
    // const product = PRODUCTS[productId];
    const { product } = useProduct(params.id as string);

    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState(product?.sizes?.[2] || "M");
    const [selectedShape, setSelectedShape] = useState(SHAPE_OPTIONS[0]);
    const [addingToCart, setAddingToCart] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    // Initialize wishlist state
    useEffect(() => {
        if (user && product) {
            setWishlisted(isInWishlist(product.id));
        }
    }, [user, product, isInWishlist]);

    if (!product) {
        return (
            <main
                className="w-full min-h-screen flex items-center justify-center"
                style={{ backgroundColor: theme.colors.light }}
            >
                <div className="text-center">
                    <h1 className="text-2xl font-serif mb-2" style={{ color: theme.colors.dark }}>
                        Product Not Found
                    </h1>
                    <button
                        onClick={() => router.push("/products ")}
                        className="px-6 py-2 rounded-full text-sm font-bold"
                        style={{ backgroundColor: theme.colors.primary, color: "white" }}
                    >
                        Browse Products
                    </button>
                </div>
            </main>
        );
    }

    // Handle add to cart
    const handleAddToCart = async () => {
        if (!user) {
            // Store cart state and redirect to login
            sessionStorage.setItem("redirectAfterLogin", "/products/" + productId);
            router.push("/auth/login");
            return;
        }

        if (!selectedSize || !selectedShape) {
            toast.error("Please select a size and shape");
            return;
        }

        setAddingToCart(true);
        try {
            await addToCart(product, selectedSize, selectedShape);
            toast.success(`Added ${quantity} to cart`, {
                icon: <ShoppingBag size={16} />,
            });

            // Reset quantity after adding
            setQuantity(1);
        } catch (error) {
            toast.error("Failed to add to cart. Please try again.");
            console.error("Add to cart error:", error);
        } finally {
            setAddingToCart(false);
        }
    };

    // Handle wishlist toggle
    const handleWishlistToggle = async () => {
        if (!user) {
            router.push("/auth/login");
            return;
        }

        setWishlistLoading(true);
        try {
            if (wishlisted) {
                await removeFromWishlist(product.id);
                setWishlisted(false);
                toast.success("Removed from wishlist");
            } else {
                await addToWishlist(product.id);
                setWishlisted(true);
                toast.success("Added to wishlist", {
                    icon: <Heart size={16} />,
                });
            }
        } catch (error) {
            toast.error("Failed to update wishlist");
            console.error("Wishlist error:", error);
        } finally {
            setWishlistLoading(false);
        }
    };

    return (
        <main
            className="w-full mx-auto px-6 py-10 font-sans"
            style={{ backgroundColor: theme.colors.light, color: theme.colors.dark }}
        >


            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm mb-8 font-medium opacity-70 mt-20">
                <span onClick={() => router.push("/")} className="hover:opacity-100 cursor-pointer">
                    Home
                </span> /
                <span
                    onClick={() => router.push("/collections/all")}
                    className="hover:opacity-100 cursor-pointer"
                >
                    {product.category}
                </span> /
                <span className="font-bold">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Product Images */}
                <div className="lg:col-span-7 flex gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex flex-col gap-3">
                            {product.images?.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className="w-20 h-24 rounded-lg overflow-hidden border-2 transition-all hover:opacity-100"
                                    style={{
                                        borderColor: activeImage === idx ? theme.colors.primary : "transparent",
                                        opacity: activeImage === idx ? 1 : 0.6,
                                    }}
                                >
                                    <Image
                                        src={img}
                                        alt={`${product.name} view ${idx + 1}`}
                                        width={80}
                                        height={96}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative flex-1 rounded-2xl overflow-hidden bg-white shadow-sm">
                        {product.isNew && (
                            <span
                                className="absolute top-4 right-4 text-white text-[10px] font-black px-4 py-1.5 rounded-full z-10 tracking-widest"
                                style={{ backgroundColor: theme.colors.primary }}
                            >
                                NEW
                            </span>
                        )}
                        <Image
                            src={product.images ? product.images[activeImage] : product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Product Details */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div>
                        <h1 className="text-5xl font-serif tracking-tight mb-2" style={{ color: theme.colors.dark }}>
                            {product.name}
                        </h1>
                        {product.rating && (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-yellow-400">★</span>
                                    ))}
                                </div>
                                <span className="text-xs opacity-60">
                                    {product.reviews} reviews
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="text-3xl font-bold flex items-baseline gap-2">
                        <span style={{ color: theme.colors.primary }}>
                            ${product.price.toFixed(2)}
                        </span>
                        <span className="text-xs font-normal italic opacity-50">inc. VAT</span>
                    </div>

                    <div className="space-y-4">
                        <p className="leading-relaxed opacity-80">
                            {product.description}
                        </p>

                        {product.features && (
                            <ul className="space-y-3 pt-2">
                                {product.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 font-semibold text-sm">
                                        <span
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{ backgroundColor: theme.colors.primary }}
                                        />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Size Selection */}
                    <div className="mt-2">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-black uppercase tracking-widest">
                                Select Size
                            </span>
                            <button
                                onClick={() => router.push("/size-guide")}
                                className="flex items-center gap-1 text-[10px] font-bold underline opacity-70 hover:opacity-100 transition-opacity"
                            >
                                <Ruler size={12} /> Size Guide
                            </button>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            {product?.sizes?.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className="w-12 h-12 rounded-full border-2 font-bold text-xs transition-all"
                                    style={{
                                        backgroundColor: selectedSize === size ? theme.colors.primary : "transparent",
                                        borderColor: selectedSize === size ? theme.colors.primary : theme.colors.muted,
                                        color: selectedSize === size ? "white" : theme.colors.dark,
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Shape Selection */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-black uppercase tracking-widest">
                                Select Shape
                            </span>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            {SHAPE_OPTIONS.map((shape) => (
                                <button
                                    key={shape}
                                    onClick={() => setSelectedShape(shape)}
                                    className="px-4 py-2 rounded-full border-2 font-semibold text-xs transition-all"
                                    style={{
                                        backgroundColor: selectedShape === shape ? theme.colors.primary : "transparent",
                                        borderColor: selectedShape === shape ? theme.colors.primary : theme.colors.muted,
                                        color: selectedShape === shape ? "white" : theme.colors.dark,
                                    }}
                                >
                                    {shape}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity and Add to Cart */}
                    <div className="flex items-center gap-4 mt-2">
                        <div
                            className="flex items-center border-2 rounded-lg bg-white overflow-hidden"
                            style={{ borderColor: theme.colors.muted }}
                        >
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={addingToCart}
                                className="px-4 py-3 hover:bg-gray-50 disabled:opacity-50"
                            >
                                <Minus size={16} strokeWidth={2.5} />
                            </button>
                            <span className="w-12 text-center font-bold text-lg">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                disabled={addingToCart}
                                className="px-4 py-3 hover:bg-gray-50 disabled:opacity-50"
                            >
                                <Plus size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                            className="flex-1 text-white font-black text-sm tracking-[0.1em] py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-2"
                            style={{ backgroundColor: theme.colors.primary }}
                        >
                            {addingToCart ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <ShoppingBag size={16} />
                                    ADD TO CART
                                </>
                            )}
                        </button>
                    </div>

                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlistToggle}
                        disabled={wishlistLoading}
                        className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest hover:opacity-70 transition-all py-3 rounded-lg border-2"
                        style={{
                            borderColor: wishlisted ? theme.colors.primary : theme.colors.muted,
                            backgroundColor: wishlisted ? `${theme.colors.primary}10` : "transparent",
                            color: wishlisted ? theme.colors.primary : theme.colors.dark,
                        }}
                    >
                        <Heart
                            size={18}
                            strokeWidth={2}
                            fill={wishlisted ? theme.colors.primary : "none"}
                        />
                        {wishlisted ? "In Wishlist" : "Add to Wishlist"}
                        {wishlistLoading && <Loader2 size={14} className="animate-spin ml-auto" />}
                    </button>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t" style={{ borderColor: `${theme.colors.dark}10` }}>
                        <div className="text-center">
                            <Truck />
                            <p className="text-[10px] font-bold uppercase">Free Shipping</p>
                            <p className="text-[10px] opacity-50">Orders over $70</p>
                        </div>
                        <div className="text-center">
                            <RefreshCw />
                            <p className="text-[10px] font-bold uppercase">Easy Returns</p>
                            <p className="text-[10px] opacity-50">30 days guaranteed</p>
                        </div>
                        <div className="text-center">
                            <TrendingUp />
                            <p className="text-[10px] font-bold uppercase">Cruelty Free</p>
                            <p className="text-[10px] opacity-50">100% Vegan</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Sections */}
            <ApplicationGuide />
            <VideoReviews />
            <Faqs />
        </main>
    );
}
