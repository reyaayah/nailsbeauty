"use client";

import { useState } from "react";
import { X, ShoppingBag } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import theme from "@/theme";

const SIZES = ["XS", "S", "M", "L", "XL"];
const SHAPES = ["Almond", "Coffin", "Oval", "Round", "Square", "Stiletto"];

interface Props {
    product: Product;
    onClose: () => void;
    onAdded: () => void;
}

export default function SizeShapeSelector({ product, onClose, onAdded }: Props) {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedShape, setSelectedShape] = useState(product.shape ?? "");
    const [error, setError] = useState("");
    const [adding, setAdding] = useState(false);

    const handleAdd = async () => {
        if (!selectedSize) { setError("Please select a size."); return; }
        if (!selectedShape) { setError("Please select a shape."); return; }
        setError("");
        setAdding(true);
        try {
            await addToCart(product, selectedSize, selectedShape);
            onAdded();
            onClose();
        } finally {
            setAdding(false);
        }
    };

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

            {/* Sheet */}
            <div
                className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-8 z-10 shadow-2xl"
                style={{ backgroundColor: theme.colors.light }}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 opacity-40 hover:opacity-80 transition-opacity"
                >
                    <X size={20} />
                </button>

                {/* Product mini header */}
                <div className="flex items-center gap-4 mb-8">
                    <div
                        className="w-14 h-16 rounded-xl overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: theme.colors.subtitle + "50" }}
                    >
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-widest opacity-50 mb-0.5">{product.category}</p>
                        <h3 className="font-serif text-lg leading-tight" style={{ color: theme.colors.dark }}>
                            {product.name}
                        </h3>
                        <p className="text-sm font-semibold mt-0.5" style={{ color: theme.colors.primary }}>
                            ${product.price.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Size */}
                <div className="mb-6">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: theme.colors.dark }}>
                        Size
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        {SIZES.map((s) => (
                            <button
                                key={s}
                                onClick={() => { setSelectedSize(s); setError(""); }}
                                className="w-12 h-12 rounded-full text-xs font-bold border-2 transition-all"
                                style={{
                                    backgroundColor: selectedSize === s ? theme.colors.primary : "transparent",
                                    borderColor: selectedSize === s ? theme.colors.primary : theme.colors.muted,
                                    color: selectedSize === s ? "white" : theme.colors.dark,
                                }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Shape */}
                <div className="mb-6">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: theme.colors.dark }}>
                        Shape
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        {SHAPES.map((sh) => (
                            <button
                                key={sh}
                                onClick={() => { setSelectedShape(sh); setError(""); }}
                                className="px-4 h-9 rounded-full text-xs font-bold border-2 transition-all"
                                style={{
                                    backgroundColor: selectedShape === sh ? theme.colors.primary : "transparent",
                                    borderColor: selectedShape === sh ? theme.colors.primary : theme.colors.muted,
                                    color: selectedShape === sh ? "white" : theme.colors.dark,
                                }}
                            >
                                {sh}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <p className="text-xs text-red-500 mb-4">{error}</p>
                )}

                {/* Add button */}
                <button
                    onClick={handleAdd}
                    disabled={adding}
                    className="w-full py-4 rounded-full flex items-center justify-center gap-2 text-white text-sm font-black uppercase tracking-widest transition-all disabled:opacity-60 hover:opacity-90 shadow-lg"
                    style={{ backgroundColor: theme.colors.primary }}
                >
                    <ShoppingBag size={16} />
                    {adding ? "Adding..." : "Add to Bag"}
                </button>
            </div>
        </div>
    );
}
