"use client";

import { X, ShoppingBag, MoveRight } from "lucide-react";

const theme = {
    colors: {
        primary: "#DBA1A2",
        dark: "#422B23",
        light: "#F7F3ED",
        muted: "#C2C6B9",
        subtitle: "#EFD8D6",
    },
};

const categories = [
    {
        title: "New Arrival",
        image: "/newarrivals.png",
        href: "/collections/new",
        label: "THE LATEST",
    },
    {
        title: "Tools & Accessories",
        image: "/tools.png",
        href: "/collections/tools",
        label: "ESSENTIALS",
    },
];

export default function CartSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-[60] bg-[#422B23]/40 backdrop-blur-[2px] transition-opacity duration-500 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
            />

            {/* Sidebar */}
            <div
                style={{ backgroundColor: theme.colors.light }}
                className={`fixed top-0 right-0 h-full w-full max-w-[480px] z-[70] flex flex-col shadow-[-10px_0_30px_rgba(66,43,35,0.1)] transform transition-transform duration-500 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Top Accent Bar */}
                <div style={{ backgroundColor: theme.colors.primary }} className="h-1.5 w-full" />

                {/* Header */}
                <div className="flex items-center justify-between px-10 py-8">
                    <div className="space-y-1">
                        <h2 style={{ color: theme.colors.dark }} className="text-3xl font-serif italic leading-none">
                            Your Selection
                        </h2>
                        <p style={{ color: theme.colors.muted }} className="text-[10px] uppercase tracking-[0.2em] font-bold">
                            Items in Bag — 0
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ color: theme.colors.dark }}
                        className="group flex items-center gap-2 text-sm font-medium hover:opacity-60 transition-all"
                    >
                        <span className="hidden group-hover:block transition-all">Close</span>
                        <X size={24} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto px-10">
                    <div className="h-px w-full bg-black/5 mb-10" />

                    {/* Empty State Layout */}
                    <div className="flex flex-col h-full">
                        <div className="mb-12">
                            <h3 style={{ color: theme.colors.dark }} className="text-xl font-medium mb-4">
                                It looks a bit lonely here.
                            </h3>
                            <p className="text-neutral-500 text-sm leading-relaxed max-w-[280px]">
                                Your curated collection is waiting to be built. Start with our favorite picks below.
                            </p>
                        </div>

                        {/* Category Stack */}
                        <div className="grid gap-6">
                            {categories.map((cat) => (
                                <a
                                    key={cat.title}
                                    href={cat.href}
                                    className="relative group block overflow-hidden rounded-2xl"
                                >
                                    <div className="aspect-[16/7] overflow-hidden">
                                        <img
                                            src={cat.image}
                                            alt={cat.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#422B23]/60 to-transparent flex flex-col justify-center px-8">
                                        <span style={{ color: theme.colors.subtitle }} className="text-[10px] font-bold tracking-widest uppercase mb-1">
                                            {cat.label}
                                        </span>
                                        <h4 className="text-white text-lg font-serif italic">
                                            {cat.title}
                                        </h4>
                                    </div>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                                        <div style={{ backgroundColor: theme.colors.light }} className="p-2 rounded-full shadow-lg">
                                            <MoveRight size={18} style={{ color: theme.colors.dark }} />
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-10">
                    <div style={{ backgroundColor: theme.colors.dark }} className="rounded-xl p-1 shadow-xl">
                        <a
                            href="/collections/all"
                            className="flex items-center justify-between w-full px-8 py-5 text-white group"
                        >
                            <span className="text-xs font-bold tracking-[0.2em] uppercase">Continue Shopping</span>
                            <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
                        </a>
                    </div>

                    <div className="mt-6 flex justify-center items-center gap-3">
                        <span style={{ backgroundColor: theme.colors.muted }} className="h-[1px] flex-1" />
                        <p style={{ color: theme.colors.primary }} className="text-[10px] font-bold tracking-tighter uppercase italic">
                            Free Shipping over $70
                        </p>
                        <span style={{ backgroundColor: theme.colors.muted }} className="h-[1px] flex-1" />
                    </div>
                </div>
            </div>
        </>
    );
}