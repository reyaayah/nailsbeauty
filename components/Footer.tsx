"use client";
import Link from 'next/link';
import { ArrowRight, CreditCard } from 'lucide-react';
import theme from '@/theme';

const Footer = () => {
    // 1. Updated data structure with navigation paths
    const footerSections = [
        {
            title: "CUSTOMER SERVICES",
            links: [
                { name: "REWARDS", href: "/rewards" },
                { name: "SIZE GUIDE", href: "/size-guide" },
                { name: "HELP CENTER", href: "/help-center" },
                { name: "CUSTOMIZATION SERVICE", href: "/customization-service" },
                { name: "SHIPPING POLICY", href: "/shipping-policy" },
                { name: "RETURN & EXCHANGE POLICY", href: "/return-policy" }
            ]
        },
        {
            title: "BRAND",
            links: [
                { name: "ABOUT US", href: "/aboutus" },
                { name: "CONTACT US", href: "/contact" },
                { name: "BLOGS", href: "/blog" }
            ]
        },
        {
            title: "SHOP",
            links: [
                { name: "BEST SELLERS", href: "/collections/bestseller" },
                { name: "NEW ARRIVALS", href: "/collections/newarrivals" },
                { name: "SALES", href: "/collections/flashsale" },
                { name: "SHOP BY COLLECTIONS", href: "/collections" },
                { name: "SHOP BY SHAPE", href: "/products?shape=Almond" },
                { name: "SHOP BY LENGTH", href: "/products" },
                { name: "TOOLS & ACCESSORIES", href: "/collections/toolsandaccessories" }
            ]
        }
    ];

    return (
        <footer style={{ backgroundColor: theme.colors.dark, color: theme.colors.light }} className="py-16 px-6 md:px-12 w-full">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-sm font-bold tracking-widest mb-6" style={{ color: theme.colors.subtitle }}>
                                {section.title}
                            </h3>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        {/* 2. Updated Link component to use link.href */}
                                        <Link
                                            href={link.href}
                                            className="text-sm hover:opacity-70 transition-opacity uppercase tracking-tight"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter Section */}
                    <div>
                        <h3 className="text-sm font-bold tracking-widest mb-6" style={{ color: theme.colors.subtitle }}>
                            NEWSLETTER
                        </h3>
                        <p className="text-sm mb-6 leading-relaxed">
                            Join the Nailsa family. Subscribe for exclusive offers, beauty tips, and trend updates.
                        </p>
                        <form className="relative group" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Your email"
                                className="w-full bg-transparent border-b py-2 pr-10 focus:outline-none transition-colors"
                                style={{ borderColor: theme.colors.muted }}
                            />
                            <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform">
                                <ArrowRight size={18} style={{ color: theme.colors.primary }} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-8" style={{ borderColor: 'rgba(247, 243, 237, 0.1)' }}>
                    <div className="text-center md:text-left">
                        <p className="text-xs tracking-widest uppercase mb-2">
                            © {new Date().getFullYear()} Nailsa Salon
                        </p>
                        <div className="flex space-x-4 text-[10px] uppercase opacity-60">
                            <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
                            <Link href="/terms" className="hover:underline">Terms of Service</Link>
                        </div>
                    </div>

                    <div className="flex space-x-3 opacity-80">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-10 h-6 rounded bg-white/10 flex items-center justify-center">
                                <CreditCard size={14} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;