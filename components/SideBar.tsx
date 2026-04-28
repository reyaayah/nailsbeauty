"use client";

import { X, Plus, Minus } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const SubItem = ({ label, children }: { label: string; children?: string[] }) => {
    const [open, setOpen] = useState(false);

    if (!children) {
        return <div className="text-black text-md font-light py-2 pl-3">{label}</div>;
    }

    return (
        <div>
            <div
                className="flex justify-between items-center cursor-pointer py-2 pl-3"
                onClick={() => setOpen(!open)}
            >
                <span className="text-black text-md font-light">{label}</span>
                {open ? <Minus size={14} /> : <Plus size={14} />}
            </div>
            <div className={`overflow-hidden transition-all duration-300 border-l-2 border-gray-300 ml-3 ${open ? "max-h-96" : "max-h-0"}`}>
                {children.map((item) => (
                    <div key={item} className="text-gray-600 text-sm font-light py-2 pl-4 hover:text-black cursor-pointer">
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [shopOpen, setShopOpen] = useState(false);

    return (
        <>
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/40 z-40 transition ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
            />
            <div className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-[#f5f5f5] z-100 transform transition-transform duration-300 overflow-y-auto ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex items-center justify-between px-6 py-5">
                    <h1 className="text-2xl font-serif text-black">Ersa Nails</h1>
                    <button onClick={onClose}><X size={24} color="black" /></button>
                </div>

                <div className="px-6 space-y-5 text-lg tracking-wide flex-1">
                    <div>
                        <div className="flex justify-between items-center cursor-pointer" onClick={() => setShopOpen(!shopOpen)}>
                            <span className="text-black text-xl">SHOP</span>
                            {shopOpen ? <Minus size={18} color="black" /> : <Plus size={18} color="black" />}
                        </div>

                        <div className={`overflow-hidden transition-all duration-300 ${shopOpen ? "max-h-300 mt-3" : "max-h-0"}`}>
                            <div className="pl-2 space-y-1 text-base text-gray-700">
                                <SubItem label="SHOP ALL" children={["BEST SELLERS", "NEW ARRIVALS", "SALES"]} />
                                <SubItem label="SHOP BY COLLECTIONS" children={["SUMMER", "SPRING", "MUSIC FESTIVAL", "ERSA ESSENCE", "CLASSY NAILS", "LNY 2026", "LOVE EDIT", "CATHOLIC", "PRESS ON TOENAILS"]} />
                                <SubItem label="SHOP BY SHAPE" children={["SQUARE", "ROUND", "ALMOND", "COFFIN", "STILETTO"]} />
                                <SubItem label="SHOP BY LENGTH" children={["SHORT", "MEDIUM", "LONG", "XL"]} />
                                <SubItem label="TOOLS & ACCESSORIES" />
                                <SubItem label="BUNDLES: SAVE UP TO 40%" />
                            </div>
                        </div>
                    </div>

                    <div className="text-black text-xl">BEST SELLERS</div>
                    <div className="text-black text-xl">NEW</div>
                    <div className="text-black text-xl">VACAY</div>
                    <div className="text-red-500">MOTHER'S DAY</div>
                    <div className="text-black text-xl">ABOUT US</div>
                </div>

                <div className="px-6 pb-10 pt-6 text-sm space-y-3">
                    <div className="text-black text-base">Log in</div>
                    <div className="text-black text-base">Create account</div>
                    <div className="text-black text-base">Search</div>
                </div>
            </div>
        </>
    );
}