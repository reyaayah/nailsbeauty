import Image from "next/image";
import { Heart, ArrowRight } from "lucide-react";
import theme from "@/theme";

interface ProductCardProps {
    id: string | number;
    name: string;
    price: number;
    image: string;
    isNew?: boolean;
    discount?: string;
    shape?: string;
    length?: string;
    style?: string;
}

export default function ProductCard({
    name,
    price,
    image,
    isNew,
    discount,
}: ProductCardProps) {
    return (
        <div className="group relative">
            {/* Image Wrapper */}
            <div
                className="relative aspect-[4/5] overflow-hidden shadow-sm transition-all duration-500 group-hover:shadow-xl"
                style={{ backgroundColor: theme.colors.subtitle }}
            >
                {isNew && (
                    <span
                        className="absolute top-4 left-4 z-10 text-white text-[10px] font-bold px-3 py-1 tracking-widest"
                        style={{ backgroundColor: theme.colors.primary }}
                    >
                        NEW
                    </span>
                )}

                <button
                    className="absolute top-4 right-4 z-10 hover:scale-110 transition-transform"
                    style={{ color: theme.colors.dark }}
                >
                    <Heart size={20} strokeWidth={1.5} />
                </button>

                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover  transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                    <button
                        className="w-full text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2"
                        style={{ backgroundColor: theme.colors.dark }}
                    >
                        Add To Bag <ArrowRight size={14} />
                    </button>
                </div>
            </div>

            {/* Text Info */}
            <div className="mt-5 text-center lg:text-left">
                <h3
                    className="text-[16px] font-medium tracking-tight mb-1"
                    style={{ color: theme.colors.dark }}
                >
                    {name}
                </h3>
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-1">
                    <p
                        className="text-[14px] font-bold"
                        style={{ color: theme.colors.primary }}
                    >
                        ${price.toFixed(2)} USD
                    </p>
                    {discount && (
                        <span
                            className="text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded"
                            style={{
                                backgroundColor: theme.colors.subtitle,
                                color: theme.colors.dark,
                            }}
                        >
                            {discount} OFF
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}