"use client";

import Link from "next/link";
import theme from "@/theme";

const tiers = [
    {
        name: "Pearl",
        points: "0–499 pts",
        perks: ["Early access to sales", "Birthday bonus points", "Member-only newsletters"],
        accent: "#E8D5C4",
    },
    {
        name: "Rose Gold",
        points: "500–1499 pts",
        perks: ["5% off every order", "Free standard shipping", "Priority customer support", "Exclusive Rose Gold sets"],
        accent: "#C9956C",
    },
    {
        name: "Diamond",
        points: "1500+ pts",
        perks: ["10% off every order", "Free express shipping", "Dedicated VIP line", "Invite-only launches", "Complimentary customization"],
        accent: "#A8C5DA",
    },
];

const howItWorks = [
    { step: "01", title: "Create an Account", desc: "Sign up for free and your rewards journey begins immediately." },
    { step: "02", title: "Shop & Earn", desc: "Earn 1 point for every $1 spent on any Gloss & Grace product." },
    { step: "03", title: "Unlock Rewards", desc: "Redeem points for discounts, free products, and exclusive perks." },
    { step: "04", title: "Rise Through Tiers", desc: "The more you shop, the more exclusive your benefits become." },
];

export default function RewardsPage() {
    return (
        <main
            className="min-h-screen pt-10"
            style={{ backgroundColor: theme.colors.light, fontFamily: "'DM Sans', sans-serif", color: theme.colors.dark }}
        >
            {/* Hero */}
            <section
                className="relative py-28 px-6 text-center overflow-hidden"
                style={{ backgroundColor: theme.colors.dark }}
            >
                {/* Add z-[-1] here */}
                <div
                    className="absolute inset-0 opacity-5 z-0"
                    style={{
                        backgroundImage: "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />

                {/* Wrap content in a relative div with higher z-index */}
                <div className="relative z-10">
                    <p className="text-[11px] font-medium uppercase tracking-[0.3em] mb-4" style={{ color: theme.colors.primary }}>
                        Gloss & Grace
                    </p>
                    <h1
                        className="text-5xl md:text-7xl font-bold leading-none mb-6"
                        style={{ fontFamily: "'Playfair Display', serif", color: theme.colors.light }}
                    >
                        The <em className="italic" style={{ color: theme.colors.primary }}>Rewards</em><br />Programme
                    </h1>
                    <p className="max-w-md mx-auto text-sm leading-relaxed opacity-70" style={{ color: theme.colors.light }}>
                        Every purchase brings you closer to luxury. Earn points, unlock tiers, and enjoy benefits crafted for our most devoted clients.
                    </p>
                    <div className="mt-10 flex gap-4 justify-center">
                        <Link
                            href="/auth/register"
                            className="px-8 py-3 text-sm font-medium uppercase tracking-widest transition-opacity hover:opacity-80 cursor-pointer"
                            style={{ backgroundColor: theme.colors.primary, color: theme.colors.dark }}
                        >
                            Join Now — It's Free
                        </Link>
                        <Link
                            href="/auth/login"
                            className="px-8 py-3 text-sm font-medium uppercase tracking-widest border transition-opacity hover:opacity-60 cursor-pointer"
                            style={{ borderColor: theme.colors.light, color: theme.colors.light }}
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 px-6 max-w-5xl mx-auto">
                <h2
                    className="text-3xl md:text-4xl font-bold text-center mb-16"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {howItWorks.map((item) => (
                        <div key={item.step} className="text-center">
                            <div
                                className="text-5xl font-bold mb-4 leading-none"
                                style={{ fontFamily: "'Playfair Display', serif", color: theme.colors.primary, opacity: 0.4 }}
                            >
                                {item.step}
                            </div>
                            <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                            <p className="text-sm leading-relaxed opacity-60">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tiers */}
            <section className="py-24 px-6" style={{ backgroundColor: theme.colors.dark }}>
                <div className="max-w-5xl mx-auto">
                    <h2
                        className="text-3xl md:text-4xl font-bold text-center mb-4"
                        style={{ fontFamily: "'Playfair Display', serif", color: theme.colors.light }}
                    >
                        Membership Tiers
                    </h2>
                    <p className="text-center text-sm opacity-50 mb-16" style={{ color: theme.colors.light }}>
                        Your tier resets annually based on the previous 12 months of spending.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {tiers.map((tier) => (
                            <div
                                key={tier.name}
                                className="p-8 rounded-sm"
                                style={{ border: `1px solid ${tier.accent}33` }}
                            >
                                <div
                                    className="w-10 h-10 rounded-full mb-6"
                                    style={{ backgroundColor: tier.accent }}
                                />
                                <h3
                                    className="text-2xl font-bold mb-1"
                                    style={{ fontFamily: "'Playfair Display', serif", color: tier.accent }}
                                >
                                    {tier.name}
                                </h3>
                                <p className="text-xs uppercase tracking-widest mb-6 opacity-40" style={{ color: theme.colors.light }}>
                                    {tier.points}
                                </p>
                                <ul className="space-y-3">
                                    {tier.perks.map((perk) => (
                                        <li key={perk} className="flex items-start gap-3 text-sm" style={{ color: theme.colors.light }}>
                                            <span style={{ color: tier.accent }}>—</span>
                                            {perk}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 text-center">
                <h2
                    className="text-3xl font-bold mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Ready to Start Earning?
                </h2>
                <p className="text-sm opacity-60 mb-8 max-w-sm mx-auto">
                    Create your free account in under a minute and start collecting points today.
                </p>
                <Link
                    href="/account/register"
                    className="inline-block px-10 py-3 text-sm font-medium uppercase tracking-widest transition-opacity hover:opacity-80"
                    style={{ backgroundColor: theme.colors.dark, color: theme.colors.light }}
                >
                    Get Started
                </Link>
            </section>
        </main>
    );
}