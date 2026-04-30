"use client";

import { useState } from "react";
import {
    Plus, Minus, Heart, Ruler
} from "lucide-react";
import Image from "next/image";
import theme from "@/theme";
import ApplicationGuide from "@/components/ApplicationGuide";
import VideoReviews from "@/components/VideoReviews";
import Faqs from "@/components/Faqs";
import { useRouter } from "next/navigation";

const products = [
    {
        id: 1,
        name: "Midnight Muse",
        price: 64.00,
        description: "A deep, high-gloss obsidian finish meeting an almond silhouette. These aren't just nails; they're an evening mood. Engineered with reinforced gel technology for a glass-like shine that withstands the chaos of daily life.",
        image: "/product1.png",
        hoverImage: "/backimg1.png",
        images: ["/product1.png", "/backimg1.png"],
        features: [
            "Salon-grade salon finish",
            "Reinforcement Gel Layer",
            "Waterproof & Chip-proof",
            "Eco-friendly & Vegan"
        ],
        sizes: ["XS", "S", "M", "L"],
        category: "Press-on Nails",
    }
];

export default function ProductDetails() {
    const router = useRouter();
    const [product] = useState(products[0]);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState("M");

    return (
        <main
            className="w-full mx-auto px-6 py-10 font-sans "
            style={{ backgroundColor: theme.colors.light, color: theme.colors.dark }}
        >
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm mb-8 font-medium opacity-70 mt-20">
                <span onClick={() => router.push("/")} className="hover:opacity-100 cursor-pointer">Home</span> /
                <span className="hover:opacity-100 cursor-pointer">{product.category}</span> /
                <span className="font-bold"> {product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                <div className="lg:col-span-7 flex gap-4">
                    <div className="flex flex-col items-center gap-2">


                        <div className="flex flex-col gap-3">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-neutral-800' : 'border-transparent opacity-60'
                                        }`}
                                    style={{ borderColor: activeImage === idx ? theme.colors.primary : 'transparent' }}
                                >
                                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>


                    </div>

                    <div className="relative flex-1  rounded-2xl overflow-hidden bg-white shadow-sm">
                        <span
                            className="absolute top-4 right-4 text-white text-[10px] font-black px-4 py-1.5 rounded-full z-10 tracking-widest"
                            style={{ backgroundColor: theme.colors.primary }}
                        >
                            NEW
                        </span>
                        <Image
                            src={product.images[activeImage]}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />

                    </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-6 ">
                    <h1 className="text-5xl font-serif tracking-tight" style={{ color: theme.colors.dark }}>
                        {product.name}
                    </h1>

                    <div className="text-3xl font-bold flex items-baseline gap-2">
                        <span style={{ color: theme.colors.primary }}>Rs {product.price.toFixed(1)}</span>
                        <span className="text-xs font-normal italic opacity-50">inc. VAT</span>
                    </div>

                    <div className="space-y-4">
                        <p className="leading-relaxed italic opacity-80">
                            {product.description}
                        </p>

                        <ul className="space-y-3 pt-2">
                            {product.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 font-semibold text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.colors.dark }} />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Size Selection Section */}
                    <div className="mt-2">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-black uppercase tracking-widest">Select Size</span>
                            <button className="flex items-center gap-1 text-[10px] font-bold underline opacity-70 hover:opacity-100">
                                <Ruler size={12} /> Size Guide
                            </button>
                        </div>
                        <div className="flex gap-3">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-12 h-12 rounded-full border-2 font-bold text-xs transition-all ${selectedSize === size ? 'text-white' : 'hover:border-neutral-400'
                                        }`}
                                    style={{
                                        backgroundColor: selectedSize === size ? theme.colors.primary : 'transparent',
                                        borderColor: selectedSize === size ? theme.colors.primary : theme.colors.muted
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity and Cart row */}
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center border-2 rounded-md bg-white overflow-hidden" style={{ borderColor: theme.colors.muted }}>
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-3 hover:bg-gray-50">
                                <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-3 hover:bg-gray-50">
                                <Plus size={14} strokeWidth={3} />
                            </button>
                        </div>
                        <button
                            className="flex-1 text-white font-black text-sm tracking-[0.1em] py-4 px-8 rounded-full transition-all shadow-lg"
                            style={{ backgroundColor: theme.colors.primary }}
                        >
                            ADD TO CART
                        </button>
                    </div>

                    <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:opacity-70 transition-colors">
                        <Heart size={20} strokeWidth={2} /> Add to wishlist
                    </button>
                </div>
            </div>
            <ApplicationGuide />
            <VideoReviews />
            <Faqs />
        </main>
    );
}