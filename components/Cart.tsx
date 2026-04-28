"use client";

import { X } from "lucide-react";

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const categories = [
    {
        title: "New Arrival",
        image: "/newarrivals.png",
        href: "/collections/new",
        label: "NEW NAIL ARRIVALS",
        showLabel: true,
    },
    {
        title: "Tools & Accessories",
        image: "/tools.png",
        href: "/collections/tools",
        showLabel: false,
    },
];

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-60 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-100 bg-white z-50 flex flex-col transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-2xl font-serif text-black">Cart</h2>
                        <span className="text-sm text-gray-500">(0 items)</span>
                    </div>
                    <button onClick={onClose} className="text-black hover:opacity-60 transition">
                        <X size={22} />
                    </button>
                </div>

                {/* Body — scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-8">
                    {/* Empty state */}
                    <p className="text-center text-sm text-gray-500 mb-2">
                        Your cart is currently empty.
                    </p>
                    <p className="text-center text-lg font-serif text-black mb-8 leading-snug">
                        Elevate your nail games with Ersa's top picks 💅
                    </p>

                    {/* Category cards */}
                    <div className="grid grid-cols-2 gap-4">
                        {categories.map((cat) => (
                            <a key={cat.title} href={cat.href} className="flex flex-col gap-2 group">
                                <div className="relative rounded-lg overflow-hidden aspect-3/4 bg-[#f5f0ee]">
                                    <img
                                        src={cat.image}
                                        alt={cat.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {cat.showLabel && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-[#fce8e8] px-3 py-4">
                                            <p className="text-black text-sm font-black tracking-wide leading-tight">
                                                NEW NAIL<br />ARRIVALS
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm text-black font-light">{cat.title}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 pt-4 border-t border-gray-100">
                    <a
                        href="/collections/all"
                        className="block w-full bg-black text-white text-sm font-semibold tracking-widest text-center py-4 hover:bg-gray-800 transition-colors"
                    >
                        SHOP ALL
                    </a>
                    <p className="text-center text-xs text-gray-500 mt-3 tracking-wide">
                        FREE SHIPPING ON ORDERS OVER $70.
                    </p>
                </div>
            </div>
        </>
    );
}