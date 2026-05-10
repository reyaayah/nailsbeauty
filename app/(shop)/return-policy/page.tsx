"use client";
import theme from '@/theme';
import { Heart, Ruler, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';



const ReturnPolicy = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen pt-10 font-sans" style={{ backgroundColor: theme.colors.light, color: theme.colors.dark }}>
            {/* Header Section */}
            <header className="py-16 px-6 text-center" style={{ backgroundColor: theme.colors.subtitle }}>
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Return & Exchange Policy</h1>
                <p className="text-lg max-w-2xl mx-auto opacity-90 italic">
                    "To elevate your beauty, one nail at a time."
                </p>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">

                {/* Our Dedication */}
                <section className="text-center space-y-4">
                    <h2 className="text-2xl font-bold italic" style={{ color: theme.colors.primary }}>Our Dedication</h2>
                    <p className="leading-relaxed max-w-xl mx-auto">
                        At Nailsa Nails, we're committed to ensuring every customer's experience is as radiant and flawless as our nails.
                        Need help? 👋🏼 Reach out to us at <span className="font-bold underline">Info@nailsaltd.co.uk</span>
                    </p>
                </section>

                <hr style={{ borderColor: theme.colors.muted }} className="w-1/4 mx-auto" />

                {/* Returns & Exchanges Hygiene Policy */}
                <section className="bg-white p-8 rounded-2xl shadow-sm border border-dashed" style={{ borderColor: theme.colors.primary }}>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl"><Heart /></span>
                        <h2 className="text-xl font-bold uppercase tracking-widest">Hygiene & Safety First</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        For hygiene reasons, we are unable to process exchanges or issue refunds for situations where you have simply changed your mind or wish to request a different style or size.
                    </p>
                    <p className="text-sm p-4 rounded-lg" style={{ backgroundColor: theme.colors.light }}>
                        <strong>Note:</strong> We kindly advise you to thoroughly review your order and choose your size according to our <span
                            onClick={() => router.push('/size-guide')} className="underline cursor-pointer font-semibold">size guide</span> before completing your purchase.
                    </p>
                </section>

                {/* Faulty Items & Size Correction Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Faulty Items */}
                    <section className="space-y-3">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <span style={{ color: theme.colors.primary }}><Star /></span> Faulty Items
                        </h3>
                        <p className="text-sm leading-relaxed">
                            While rare, if you notice an oversight on our part, please contact us within <strong>7 days</strong> of receiving your order. Our team will handle each case with care and attention, working toward a thoughtful solution to ensure you feel fully supported.
                        </p>
                    </section>

                    {/* Size Correction */}
                    <section className="space-y-3">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <span style={{ color: theme.colors.primary }}><Ruler /></span> Size Correction
                        </h3>
                        <p className="text-sm leading-relaxed">
                            Selecting the perfect fit can be tricky! If your nails don’t match your needs, we offer an <strong>exclusive 10% discount</strong> on a reorder with corrected measurements. Reach out to our support team to claim your code.
                        </p>
                    </section>
                </div>

                {/* Final Contact Box */}
                <section className="rounded-2xl p-8 text-center" style={{ backgroundColor: theme.colors.subtitle }}>
                    <h2 className="text-xl font-bold mb-4">Questions about the process?</h2>
                    <p className="text-sm mb-6 max-w-md mx-auto opacity-80">
                        We are here to help you throughout the entire return and reorder process. Don't hesitate to reach out for guidance.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <a
                            href="mailto:Info@nailsaltd.co.uk"
                            className="w-full md:w-auto px-10 py-3 rounded-full font-bold shadow-md transition-all hover:brightness-105"
                            style={{ backgroundColor: theme.colors.dark, color: theme.colors.light }}
                        >
                            Email Support
                        </a>
                        <button
                            onClick={() => router.push('/size-guide')}
                            className="w-full md:w-auto px-10 py-3 rounded-full font-bold border-2 transition-all hover:bg-white"
                            style={{ borderColor: theme.colors.primary, color: theme.colors.dark }}
                        >
                            View Size Guide
                        </button>
                    </div>
                </section>

            </main>

            {/* Footer Tagline */}
            <footer className="py-10 text-center opacity-60">
                <p className="text-xs tracking-widest uppercase">
                    Nailsa Nails — Elevating beauty, one nail at a time. 💅
                </p>
            </footer>
        </div>
    );
};

export default ReturnPolicy;