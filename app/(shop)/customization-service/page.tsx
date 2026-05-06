"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    Paintbrush,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Maximize,
    Palette,
    Scissors,
    Heart,
    Mail
} from "lucide-react";
import theme from "@/theme";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

const highlights = [
    "Handcrafted by nail techs using gel",
    "Salon quality in under 10 min",
    "Last up to 4 weeks each wear",
    "Zero nail damage & reusable for life"
];

export default function CustomizationPage() {
    return (
        <main
            className="min-h-screen overflow-x-hidden"
            style={{ backgroundColor: theme.colors.light, fontFamily: "'DM Sans', sans-serif", color: theme.colors.dark }}
        >
            {/* Top Value Marquee */}
            <div className="py-3 border-b overflow-hidden bg-white whitespace-nowrap">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="flex gap-12 items-center"
                >
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-12 items-center">
                            {highlights.map((text, idx) => (
                                <span key={idx} className="text-[10px] uppercase tracking-widest flex items-center gap-2">
                                    <Sparkles size={10} style={{ color: theme.colors.primary }} /> {text}
                                </span>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center px-6 overflow-hidden bg-[#1a1a1a]">
                <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.4, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src="/deal1.png"
                        alt="Nail Art Background"
                        fill
                        className="object-cover"
                    />
                </motion.div>

                <div className="relative z-10 text-center max-w-4xl">
                    <motion.p
                        initial={{ opacity: 0, letterSpacing: "0.1em" }}
                        animate={{ opacity: 1, letterSpacing: "0.3em" }}
                        className="text-[11px] font-medium uppercase mb-6"
                        style={{ color: theme.colors.primary }}
                    >
                        Bespoke Press-On Artistry
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-6xl md:text-8xl font-bold leading-tight mb-8"
                        style={{ fontFamily: "'Playfair Display', serif", color: theme.colors.light }}
                    >
                        Your Perfect <br /> <em className="italic font-serif" style={{ color: theme.colors.primary }}>Nails Await</em>
                    </motion.h1>
                    <motion.p
                        className="text-white/60 mb-10 max-w-xl mx-auto text-sm leading-relaxed"
                        {...fadeIn}
                    >
                        Personalize the shape, length, and design of our existing sets, or share your ideas for a fully bespoke creation.
                    </motion.p>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                        <Link
                            href="#options"
                            className="group inline-flex items-center gap-3 px-12 py-4 text-sm font-medium uppercase tracking-widest transition-all hover:gap-5"
                            style={{ backgroundColor: theme.colors.primary, color: theme.colors.dark }}
                        >
                            Explore Options <ArrowRight size={16} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Option 1: Existing Designs */}
            <section id="options" className="py-32 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div {...fadeIn} className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src="/nails1.png"
                            alt="Customizing Existing Designs"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                    </motion.div>

                    <div className="space-y-8">
                        <div className="inline-block px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2" style={{ backgroundColor: `${theme.colors.primary}20`, color: theme.colors.primary }}>
                            Service 01
                        </div>
                        <h2 className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Customize Existing Designs
                        </h2>
                        <p className="opacity-60 text-sm leading-relaxed">
                            Loved one of our sets but want it in a different length or color? We can tailor any current design to your specific preference.
                        </p>

                        <div className="space-y-6 pt-4">
                            {[
                                { icon: <Maximize size={18} />, title: "Size Customization", desc: "Select your ideal nail size (range: 8mm-17mm)." },
                                { icon: <Scissors size={18} />, title: "Shape Customization", desc: "Choose from any of our signature nail shapes." },
                                { icon: <Palette size={18} />, title: "Design Tweaks", desc: "Adjust colors, swap embellishments, or modify layouts." }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start">
                                    <div className="p-2 rounded-lg bg-black text-white" style={{ backgroundColor: theme.colors.dark }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm uppercase tracking-tight">{item.title}</h4>
                                        <p className="text-xs opacity-60 mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 flex flex-wrap gap-4">
                            <Link href="/contact" className="px-8 py-3 text-xs font-bold uppercase tracking-widest border border-black hover:bg-black hover:text-white transition-all">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Option 2: Bespoke Creations */}
            <section className="py-32 px-6 bg-[#FAF9F6]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1 space-y-8">
                        <div className="inline-block px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2" style={{ backgroundColor: `${theme.colors.primary}20`, color: theme.colors.primary }}>
                            Service 02
                        </div>
                        <h2 className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Create Your Own Bespoke Design
                        </h2>
                        <p className="opacity-60 text-sm leading-relaxed">
                            Planning a wedding, vacation, or special event? Let us bring your unique vision to life with a one-of-a-kind handcrafted set.
                        </p>

                        <ul className="space-y-4 pt-4">
                            {[
                                "Send us pictures of the nails you desire",
                                "Share your outfit or occasion inspiration",
                                "Specify details: French tips, 3D flowers, chrome effects, etc.",
                                "Get a custom quote and feasibility check"
                            ].map((text, idx) => (
                                <li key={idx} className="flex gap-3 items-center text-sm">
                                    <CheckCircle2 size={16} style={{ color: theme.colors.primary }} />
                                    <span>{text}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="pt-6">
                            <Link href="mailto:hello@ersanails.com" className="group inline-flex items-center gap-3 px-10 py-4 text-xs font-bold uppercase tracking-widest bg-black text-white hover:opacity-80 transition-all">
                                <Mail size={16} /> Email Your Vision
                            </Link>
                        </div>
                    </div>

                    <motion.div {...fadeIn} className="order-1 lg:order-2 relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src="/nails2.png"
                            alt="Bespoke Design"
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 px-6 text-center">
                <motion.div {...fadeIn} className="max-w-2xl mx-auto space-y-8">
                    <Heart size={40} className="mx-auto" style={{ color: theme.colors.primary }} />
                    <h2 className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Let’s Consult Your Design
                    </h2>
                    <p className="opacity-60">
                        Our nail technicians are ready to confirm feasibility and help you achieve the perfect fit.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
                        <Link href="/contact" className="px-12 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-all">
                            Contact Customer Service
                        </Link>
                        <a href="mailto:hello@graceandgloss.com" className="px-12 py-4 border border-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                            hello@graceandgloss.com
                        </a>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}