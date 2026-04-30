"use client";

import theme from "@/theme";
import { X, ChevronRight, Search, User, ShoppingBag } from "lucide-react";
import { useState } from "react";



interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}


const NavItem = ({ label, children, isNew }: { label: string; children?: string[]; isNew?: boolean }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="group">
            <button
                onClick={() => children && setOpen(!open)}
                className="w-full flex justify-between items-center py-3 text-left group transition-all"
                style={{ color: theme.colors.dark }}
            >
                <span className="flex items-center gap-3 font-medium tracking-tight text-[16px]">
                    {label}
                    {isNew && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DBA1A2] text-white uppercase tracking-widest font-bold">
                            New
                        </span>
                    )}
                </span>
                {children && (
                    <ChevronRight
                        size={18}
                        className={`transition-transform duration-300 ${open ? "rotate-90" : "opacity-40"}`}
                    />
                )}
            </button>

            {children && (
                <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${open ? "max-h-[500px] opacity-100 mb-4" : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="pl-2 border-l-2 ml-1" style={{ borderColor: theme.colors.muted }}>
                        {children.map((item) => (
                            <div
                                key={item}
                                className="py-2 pl-4 text-[14px] hover:translate-x-1 transition-transform cursor-pointer"
                                style={{ color: "#6B7280" }} // Gray-500
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

/* ---------------- SIDEBAR ---------------- */

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    return (
        <>
            {/* Glassmorphism Overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-[90] backdrop-blur-sm transition-opacity duration-500 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                style={{ backgroundColor: "rgba(66, 43, 35, 0.2)" }}
            />

            {/* Sidebar Container */}
            <div
                className={`fixed top-0 left-0 h-full w-full max-w-[360px] z-[100] transform transition-transform duration-500 ease-out shadow-2xl flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                style={{ backgroundColor: theme.colors.light }}
            >
                {/* Elegant Header */}
                <div className="flex items-center justify-between px-8 pt-10 pb-6">
                    <div>
                        <h1
                            className="text-2xl font-serif font-bold italic"
                            style={{ color: theme.colors.dark }}
                        >
                            Gloss & Grace
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mt-1" style={{ color: theme.colors.primary }}>Premium Press-Ons</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-full transition-colors hover:bg-white"
                    >
                        <X size={20} strokeWidth={1.5} color={theme.colors.dark} />
                    </button>
                </div>

                {/* Navigation Content */}
                <div className="flex-1 overflow-y-auto px-8 custom-scrollbar">
                    <div className="mt-4 space-y-1">
                        <NavItem label="Shop All" children={["Best Sellers", "New Arrivals", "Flash Sale"]} />
                        <NavItem label="Collections" children={["Summer '24", "G & G Essence", "The Love Edit", "LNY Limited"]} />
                        <NavItem label="Shop by Shape" children={["Square", "Almond", "Coffin", "Stiletto"]} />
                        <NavItem label="Length" children={["Short", "Medium", "Long", "Extra Long"]} />
                        <NavItem label="Tools & Care" />
                    </div>

                    <div className="mt-10 pt-8 border-t border-gray-100">
                        <div className="space-y-5">
                            <div className="flex items-center justify-between text-[14px] cursor-pointer group">
                                <span className={`font-semibold tracking-wide `} style={{ color: theme.colors.dark }}>
                                    VACAY SELECTION
                                </span>
                                <span className="h-1 w-1 rounded-full bg-primary" />
                            </div>
                            <div className="text-[14px] font-semibold tracking-wide cursor-pointer text-[#DBA1A2]">
                                MOTHER'S DAY BUNDLES
                            </div>
                            <div className="text-[14px] font-semibold cursor-pointer" style={{ color: theme.colors.dark }}>About Gloss & Grace</div>
                            <div className="text-[14px] font-semibold cursor-pointer" style={{ color: theme.colors.dark }}>Shipping & FAQ</div>
                        </div>
                    </div>
                </div>

                {/* Bottom Utility Bar */}
                <div className="p-8 bg-white border-t border-gray-50">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <button className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition" style={{ color: theme.colors.dark }}>
                            <Search size={18} />
                            <span className="text-[10px] uppercase">Search</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition" style={{ color: theme.colors.dark }}>
                            <User size={18} />
                            <span className="text-[10px] uppercase">Account</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition" style={{ color: theme.colors.dark }}>
                            <ShoppingBag size={18} />
                            <span className="text-[10px] uppercase">Cart</span>
                        </button>
                    </div>

                    <button
                        className="w-full py-4 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-transform active:scale-95"
                        style={{ backgroundColor: theme.colors.dark }}
                    >
                        Shop New Arrivals
                    </button>
                </div>
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
      `}</style>
        </>
    );
}