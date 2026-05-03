"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Search, Mail, MessageCircle } from "lucide-react";
import theme from "@/theme";

const categories = [
    { label: "Product Info", slug: "product" },
    { label: "Application & Removal", slug: "application" },
    { label: "Customization", slug: "customization" },
    { label: "Shipping & Delivery", slug: "shipping" },
    { label: "Returns & Payments", slug: "returns" },
];

const faqs: Record<string, { q: string; a: string }[]> = {
    product: [
        { q: "How to find my size?", a: "We offer a comprehensive sizing guide using a millimeter ruler or our Sizing Kit. Most nails range from 8mm to 17mm to ensure a perfect fit for every nail bed." },
        { q: "How are the different shapes and lengths looks like?", a: "We offer Coffin, Almond, Stiletto, Square, and Oval shapes in Short, Medium, and Long lengths. Check our 'Shapes Guide' page for visual comparisons." },
        { q: "Are we vegan and cruelty-free?", a: "Yes! Grace & Gloss Nails is committed to ethical beauty. All our gels and materials are 100% vegan and never tested on animals." },
        { q: "Are our press-on nails reusable?", a: "Absolutely. Because they are handcrafted with high-quality gel, they are reusable for life with proper care and gentle removal." },
        { q: "How are Grace & Gloss Nails different from the other press-on nails?", a: "Unlike mass-produced plastic nails, ours are handcrafted by professional nail techs using real gel. They offer salon quality, zero damage, and last up to 4 weeks per wear." },
    ],
    application: [
        { q: "How do I apply Grace & Gloss Press-Ons?", a: "Prep is key! Clean your natural nails, push back cuticles, and use the included adhesive. Application takes under 10 minutes for a salon-quality look." },
        { q: "How do I remove them safely?", a: "Soak your nails in warm water with soap and oil for 10-15 minutes. Gently lift from the sides. This ensures zero damage to your natural nails." },
    ],
    customization: [
        { q: "Do we offer any customization?", a: "Yes! You can personalize the shape, length, and design of existing sets, or email us at hello@Grace & Glossnails.com for a fully bespoke, one-of-a-kind creation." },
        { q: "How do I submit a custom design?", a: "Send us inspiration photos, your outfit ideas, or specific motifs like 3D flowers or chrome effects. Our techs will confirm feasibility within 24 hours." },
    ],
    shipping: [
        { q: "Where do you ship to?", a: "We ship worldwide! Whether you're local or international, Grace & Gloss Nails can reach your doorstep." },
        { q: "How much and how long does it cost?", a: "Shipping costs and times vary by location. Typically, domestic orders arrive in 3-5 business days, while international can take 7-14 days." },
        { q: "Is there free shipping?", a: "We often offer free shipping on orders over a certain value. Check our header banner for the most current promotion." },
        { q: "Why is my tracking not updating?", a: "Tracking can take 24-48 hours to update once the courier scans the package. If it hasn't moved in 5 days, please contact us." },
    ],
    returns: [
        { q: "Do we offer refunds or exchanges?", a: "Due to the hygienic nature of our handcrafted products, we generally do not accept returns. However, your satisfaction is our priority—contact us if you have issues with your order." },
        { q: "I've received a damaged item, how can I get assistance?", a: "Please email hello@Grace & Glossnails.com with your order number and a photo of the damage within 48 hours of delivery. We will make it right." },
        { q: "What forms of payment do you accept?", a: "We accept all major credit cards, PayPal, and modern digital wallets to ensure your checkout is safe and seamless." },
    ],
};

function Accordion({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            className="border-b cursor-pointer transition-all duration-300"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
            onClick={() => setOpen((o) => !o)}
        >
            <div className="flex items-center justify-between py-6 gap-4">
                <p className="text-sm md:text-base font-medium leading-snug">{q}</p>
                <ChevronDown
                    size={18}
                    className="shrink-0 transition-transform duration-300"
                    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", color: theme.colors.primary }}
                />
            </div>
            {open && (
                <div className="pb-6 animate-in fade-in slide-in-from-top-1 duration-300">
                    <p className="text-sm leading-relaxed opacity-60 max-w-2xl">{a}</p>
                </div>
            )}
        </div>
    );
}

export default function HelpCenterPage() {
    const [active, setActive] = useState("product");
    const [search, setSearch] = useState("");

    const allFaqs = Object.values(faqs).flat();
    const filtered = search.trim()
        ? allFaqs.filter((f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
        : faqs[active];

    return (
        <main
            className="min-h-screen"
            style={{ backgroundColor: theme.colors.light, fontFamily: "'DM Sans', sans-serif", color: theme.colors.dark }}
        >
            {/* Minimalist Hero */}
            <section className="pt-32 pb-20 px-6 text-center bg-white">
                <h1
                    className="text-5xl md:text-7xl font-bold leading-none mb-6"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Grace & Gloss <em className="italic" style={{ color: theme.colors.primary }}>Help Center</em>
                </h1>
                <p className="text-sm opacity-50 mb-12 uppercase tracking-widest">How can we assist your journey?</p>


            </section>

            {/* Main Content Area */}
            <section className="pb-32 px-6 max-w-6xl mx-auto flex flex-col lg:flex-row gap-16">

                {/* Sidebar Navigation */}
                {!search && (
                    <aside className="lg:w-64 shrink-0">
                        <div className="sticky top-32 flex flex-col gap-2">
                            {categories.map((c) => (
                                <button
                                    key={c.slug}
                                    onClick={() => setActive(c.slug)}
                                    className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all rounded-lg"
                                    style={{
                                        backgroundColor: active === c.slug ? `${theme.colors.primary}15` : "transparent",
                                        color: active === c.slug ? theme.colors.primary : "rgba(0,0,0,0.4)",
                                    }}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </aside>
                )}

                {/* FAQ List */}
                <div className="flex-grow max-w-3xl">
                    {search && (
                        <div className="mb-10 pb-4 border-b">
                            <p className="text-xl font-serif italic">
                                Found {filtered.length} results for "{search}"
                            </p>
                        </div>
                    )}

                    <div className="divide-y divide-black/5">
                        {filtered.map((faq) => (
                            <Accordion key={faq.q} q={faq.q} a={faq.a} />
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl">
                            <p className="text-sm opacity-50 mb-4">No answers found for your search.</p>
                            <button onClick={() => setSearch("")} className="text-xs font-bold uppercase underline tracking-widest">Clear Search</button>
                        </div>
                    )}
                </div>
            </section>

            {/* Support Footer */}
            <section className="py-24 px-6 border-t bg-[#FAF9F6]">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="p-10 bg-white rounded-3xl shadow-sm border border-black/5">
                        <MessageCircle className="mb-6" style={{ color: theme.colors.primary }} />
                        <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Contact Us</h3>
                        <p className="text-sm opacity-60 mb-6 leading-relaxed">Have a specific question about your order or a design? Our team is here to help.</p>
                        <Link href="/contact" className="text-xs font-bold uppercase tracking-widest border-b-2 pb-1" style={{ borderBottomColor: theme.colors.primary }}>
                            Open Support Ticket
                        </Link>
                    </div>

                    <div className="p-10 bg-white rounded-3xl shadow-sm border border-black/5">
                        <Mail className="mb-6" style={{ color: theme.colors.primary }} />
                        <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Email Support</h3>
                        <p className="text-sm opacity-60 mb-6 leading-relaxed">Prefer the traditional way? Send us an email and we'll get back to you within 24 hours.</p>
                        <a href="mailto:hello@Grace & Glossnails.com" className="text-xs font-bold uppercase tracking-widest border-b-2 pb-1" style={{ borderBottomColor: theme.colors.primary }}>
                            hello@Grace & Glossnails.com
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}