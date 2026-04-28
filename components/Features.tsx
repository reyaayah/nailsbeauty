"use client";

import { Heart, Recycle, Sparkles, Truck } from "lucide-react";


const features = [
    {
        icon: <Heart size={24} color="black" />,
        text: "Handmade",
        subtext: "Handcrafted with salon-quality gel",

    },
    {
        icon: <Recycle size={24} color="black" />,
        text: "Reusable",
        subtext: "Made for multiple uses ensuring lasting beauty",

    },
    {
        icon: <Sparkles size={24} color="black" />,
        text: "Last 4 weeks",
        subtext: "Stay flawless for up to 4 weeks with solid glue",

    },
    {
        icon: <Truck size={24} color="black" />,
        text: "Free Shipping",
        subtext: "Enjoy free shipping on orders over $79 USD",

    },

];

function Card({ feature }: { feature: typeof features[0] }) {
    return (
        <div className="relative rounded-xl overflow-hidden aspect-video  w-full ">

            <div className="absolute inset-0 " />
            <div className="absolute inset-0 flex flex-col items-center justify-center mb-4 gap-2 px-4">
                <div className="flex items-center gap-1.5">
                    {feature.icon}</div>
                <span className="text-black text-2xl md:text-3xl font-serif">
                    {feature.text}
                </span>
                <div className="text-black text-[11px] px-4 py-3 rounded-md md:text-xs tracking-widest text-center">
                    {feature.subtext}
                </div>


            </div>
        </div>
    );
}

export default function Features() {

    return (
        <section className="px-10 py-8 w-full mx-auto bg-gray-200">


            {/* Desktop: 2 columns */}
            <div className="hidden md:flex gap-4">
                {features.map((feature, i) => (
                    <div key={i} className="flex-1">
                        <Card feature={feature} />
                    </div>
                ))}
            </div>



        </section>
    );
}