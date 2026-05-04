"use client";

import { useState } from "react";
import { X, ShoppingBag, Check } from "lucide-react";
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


function SimpleSelector({ product, onClose, onAdded }: Props) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    const handleAdd = async () => {
        setAdding(true);
        try {
            await addToCart(product, "", "", quantity);
            onAdded();
            onClose();
        } finally {
            setAdding(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Backdrop */}
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
                        <p className="text-xs uppercase tracking-widest opacity-50 mb-0.5">
                            {product.category}
                        </p>
                        <h3
                            className="font-serif text-lg leading-tight"
                            style={{ color: theme.colors.dark }}
                        >
                            {product.name}
                        </h3>
                        <p className="text-sm font-semibold mt-0.5" style={{ color: theme.colors.primary }}>
                            ${product.price.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Quantity */}
                <div className="mb-8">
                    <p
                        className="text-[10px] font-black uppercase tracking-widest mb-4"
                        style={{ color: theme.colors.dark }}
                    >
                        Quantity
                    </p>
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="w-11 h-11 rounded-full border-2 flex items-center justify-center text-xl font-bold transition-all hover:opacity-70 active:scale-95"
                            style={{
                                borderColor: theme.colors.muted + "60",
                                color: theme.colors.dark,
                            }}
                        >
                            −
                        </button>
                        <span
                            className="text-lg font-bold w-6 text-center"
                            style={{ color: theme.colors.dark }}
                        >
                            {quantity}
                        </span>
                        <button
                            onClick={() => setQuantity((q) => q + 1)}
                            className="w-11 h-11 rounded-full border-2 flex items-center justify-center text-xl font-bold transition-all hover:opacity-70 active:scale-95"
                            style={{
                                borderColor: theme.colors.muted + "60",
                                color: theme.colors.dark,
                            }}
                        >
                            +
                        </button>

                        {/* Subtotal */}
                        <span
                            className="ml-auto text-sm font-semibold"
                            style={{ color: theme.colors.muted }}
                        >
                            Total:{" "}
                            <span style={{ color: theme.colors.dark }}>
                                ${(product.price * quantity).toFixed(2)}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Add button */}
                <button
                    onClick={handleAdd}
                    disabled={adding}
                    className="w-full py-4 rounded-full flex items-center justify-center gap-2 text-white text-sm font-black uppercase tracking-widest transition-all disabled:opacity-60 hover:opacity-90 active:scale-[0.98] shadow-lg"
                    style={{ backgroundColor: theme.colors.primary }}
                >
                    <ShoppingBag size={16} />
                    {adding ? "Adding..." : "Add to Bag"}
                </button>
            </div>
        </div>
    );
}
// ─── Kit selector (for tools & accessories) ───────────────────────────────────
function KitSelector({ product, onClose, onAdded }: Props) {
    const { addToCart } = useCart();
    const [selectedKit, setSelectedKit] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState("");
    const [adding, setAdding] = useState(false);

    const options = product.kitOptions ?? [];

    const handleAdd = async () => {
        if (!selectedKit) { setError("Please select a kit option."); return; }
        setError("");
        setAdding(true);
        try {
            // Pass kit option as "size", shape as empty string — adjust to your cart signature
            await addToCart(product, selectedKit, "", quantity);
            onAdded();
            onClose();
        } finally {
            setAdding(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

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

                {/* Kit options */}
                <div className="mb-6">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: theme.colors.dark }}>
                        Pick your kit
                    </p>
                    <div className="flex flex-col gap-2">
                        {options.map((option) => {
                            const isSelected = selectedKit === option;
                            return (
                                <button
                                    key={option}
                                    onClick={() => { setSelectedKit(option); setError(""); }}
                                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 text-left transition-all duration-200"
                                    style={{
                                        backgroundColor: isSelected ? theme.colors.primary + "12" : "transparent",
                                        borderColor: isSelected ? theme.colors.primary : theme.colors.muted + "60",
                                        color: theme.colors.dark,
                                    }}
                                >
                                    <span className="text-sm font-medium">{option}</span>
                                    {isSelected && (
                                        <span
                                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: theme.colors.primary }}
                                        >
                                            <Check size={11} color="white" strokeWidth={3} />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: theme.colors.dark }}>
                        Quantity
                    </p>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all hover:opacity-70"
                            style={{ borderColor: theme.colors.muted + "60", color: theme.colors.dark }}
                        >
                            −
                        </button>
                        <span className="text-base font-bold w-6 text-center" style={{ color: theme.colors.dark }}>
                            {quantity}
                        </span>
                        <button
                            onClick={() => setQuantity((q) => q + 1)}
                            className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all hover:opacity-70"
                            style={{ borderColor: theme.colors.muted + "60", color: theme.colors.dark }}
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

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

// ─── Standard selector (press-ons: size + shape) ──────────────────────────────
function StandardSelector({ product, onClose, onAdded }: Props) {
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
        <div
            className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

            <div
                className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-8 z-10 shadow-2xl"
                style={{ backgroundColor: theme.colors.light }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 opacity-40 hover:opacity-80 transition-opacity"
                >
                    <X size={20} />
                </button>

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

                {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

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

// ─── Router: pick the right modal based on product type ──────────────────────
export default function SizeShapeSelector(props: Props) {
    if (props.product.isSimple) return <SimpleSelector {...props} />;
    if (props.product.isKit) return <KitSelector {...props} />;
    return <StandardSelector {...props} />;
}