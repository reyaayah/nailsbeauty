"use client";

import theme from "@/theme";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AboutPage() {
    const router = useRouter();
    return (
        <div className="bg-[#FAF9F6] min-h-screen font-sans text-[#1A1A1A] overflow-x-hidden">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]" style={{ backgroundColor: theme.colors.primary }} />
                </div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <span className="uppercase tracking-[0.3em] text-xs mb-6 block text-primary font-bold">
                        Established 2024
                    </span>

                    {/* Changed text-dark to text-[#111111] for maximum depth */}
                    <h1 style={{ color: theme.colors.primary }} className="text-6xl md:text-8xl font-serif mb-8 leading-[1.1] tracking-tight ">
                        The Art of <br />
                        <span className="text-primary italic font-light">Mindful</span> Beauty.
                    </h1>

                    {/* Increased opacity from 60 to 90 for better readability */}
                    <p className="text-lg md:text-xl text-[#1A1A1A]/90 leading-relaxed max-w-xl mx-auto font-medium">
                        Beyond the polish. We craft professional-grade nail care
                        that honors both your ritual and the planet.
                    </p>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-12 gap-16 items-center">

                        <div className="md:col-span-7 relative group">
                            <div className="absolute -inset-4 border border-primary/30 rounded-2xl translate-x-8 translate-y-8 -z-10 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-500" />
                            <div className="relative aspect-[16/10] md:aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl border border-black/5">
                                <Image
                                    src="/deal1.png"
                                    alt="Craftsmanship"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-full shadow-xl hidden md:block border border-black/5">
                                <p className="text-xs font-black uppercase tracking-tighter leading-none text-[#111111]">
                                    Quality<br /><span className="text-primary">Assured</span>
                                </p>
                            </div>
                        </div>

                        <div className="md:col-span-5 space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-serif leading-tight text-[#111111]">
                                    Our Core <br />Values
                                </h2>
                                <div className="h-1.5 w-20 bg-primary" />
                            </div>

                            <div className="space-y-10">
                                {[
                                    {
                                        title: "Uncompromising Quality",
                                        desc: "Meticulously tested formulas ensuring high-pigment payoff and 21-day chip-free wear."
                                    },
                                    {
                                        title: "Sustainable Soul",
                                        desc: "100% vegan, cruelty-free, and packaged in recycled materials because beauty shouldn't cost the earth."
                                    },
                                    {
                                        title: "Curated Moods",
                                        desc: "From ephemeral pastels to avant-garde bolds, our shades are designed to be your self-expression."
                                    }
                                ].map((item, index) => (
                                    <div key={index} className="group cursor-default">
                                        {/* Darkened primary text and increased weight */}
                                        <h3 className="text-sm uppercase tracking-widest font-black text-primary mb-3 group-hover:translate-x-2 transition-transform">
                                            0{index + 1} — {item.title}
                                        </h3>
                                        {/* Swapped text-dark/70 for text-[#222222] */}
                                        <p className="text-[#222222] font-medium leading-relaxed border-l-2 border-primary/20 pl-6">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-white border-y border-black/10 py-20 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
                    {[
                        { label: "Vegan & Cruelty Free", val: "100%" },
                        { label: "Unique Shades", val: "60+" },
                        { label: "Days of Wear", val: "21" },
                        { label: "Conscious Shipping", val: "Global" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center space-y-2">
                            <span style={{ color: theme.colors.primary }} className="block text-4xl md:text-5xl font-serif">{stat.val}</span>
                            <span className="block text-[10px] uppercase tracking-[0.2em] text-primary font-black">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 relative">
                <div className="max-w-5xl mx-auto relative">
                    {/* Changed bg-dark to a solid, deep black [#0A0A0A] */}
                    <div style={{ backgroundColor: theme.colors.primary }} className=" rounded-[3rem] p-12 md:p-20 text-center text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] -mr-32 -mt-32" />

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
                                Embrace the <span className="italic text-primary">Luxury</span> of Conscious Beauty.
                            </h2>

                            {/* Increased brightness of white text for contrast against the dark background */}
                            <p className="mb-10 text-white/90 font-medium italic text-lg">
                                &quot;Your nails are jewels, not tools. Treat them with the care they deserve.&quot;
                            </p>

                            <button onClick={() => {
                                router.push("/collections")
                            }} style={{ color: theme.colors.primary }} className="group relative bg-white px-12 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all   overflow-hidden shadow-xl">
                                <span className="relative z-10">Shop the Collection</span>
                                <div className="absolute inset-0 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}