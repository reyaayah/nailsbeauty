"use client";

import Image from "next/image";

type Product = {
    id: number;
    title: string;
    price: string;
    image: string;
    reviews: number;
};

const products: Product[] = [
    {
        id: 1,
        title: "ProTouch Kit Max",
        price: "$24.99 USD",
        image: "/product1.png",
        reviews: 84,
    },
    {
        id: 2,
        title: "Ersa Nails ProTouch Kit",
        price: "$19.99 USD",
        image: "/product2.png",
        reviews: 104,
    },
    {
        id: 3,
        title: "ProTouch Kit Mini",
        price: "$17.99 USD",
        image: "/product3.png",
        reviews: 65,
    },
    {
        id: 4,
        title: "Nail Essentials Kit",
        price: "$29.99 USD",
        image: "/product1.png",
        reviews: 120,
    },
    {
        id: 5,
        title: "Nail Essentials Kit",
        price: "$29.99 USD",
        image: "/product1.png",
        reviews: 120,
    },
];

export default function HeroWithProducts() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[90vh] w-full mx-auto px-10 py-8">

            {/* LEFT - HERO */}
            <div className="relative  rounded-2xl overflow-hidden">
                <Image
                    src="/shoot.png"
                    alt="Hero"
                    fill
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-end  px-10 text-white">
                    <h1 className="text-4xl lg:text-5xl font-serif mb-4">
                        Must-Have Nail Essentials
                    </h1>
                    <p className="mb-6 text-lg">
                        Get the essential tools for perfect nails
                    </p>
                    <button className="bg-white text-black px-6 py-3 rounded-lg w-fit hover:bg-gray-200 transition mb-6">
                        SHOP ALL TOOLS
                    </button>
                </div>
            </div>

            {/* RIGHT - SCROLLABLE PRODUCTS */}
            <div className="h-full overflow-y-auto pr-2 scrollbar-hide">
                <div className="grid grid-cols-2 gap-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex flex-col gap-4 p-4 bg-white rounded-xl  transition"
                        >
                            <div className="relative w-full h-80">
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            <div className="flex flex-col justify-between">
                                <h3 className="font-semibold text-lg text-black">
                                    {product.title}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    ⭐ {product.reviews} reviews
                                </p>
                                <p className="font-medium text-lg text-black">
                                    {product.price}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}