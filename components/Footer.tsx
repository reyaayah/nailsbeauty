import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Mail } from 'lucide-react';
import theme from '@/theme';

const Footer = () => {
    const footerSections = [
        {
            title: "Services",
            links: ["Hair Styling", "Color & Highlights", "Manicure", "Facial Treatments"]
        },
        {
            title: "Information",
            links: ["Our Story", "Stylists", "Careers", "Support"]
        }
    ];

    return (
        <footer style={{ backgroundColor: theme.colors.light }} className="pt-24 pb-12 px-6 border-t border-black/5">
            <div className="max-w-7xl mx-auto">

                {/* Main Content Area */}
                <div className="flex flex-col lg:flex-row justify-between gap-16 mb-24">

                    {/* Brand Statement Section */}
                    <div className="lg:max-w-md">
                        <h2 className="text-6xl md:text-8xl font-serif tracking-tighter mb-8" style={{ color: theme.colors.dark }}>
                            Gloss<span className="italic text-primary" style={{ color: theme.colors.primary }}>&</span>Grace
                        </h2>
                        <p className="text-lg leading-relaxed mb-8 opacity-80" style={{ color: theme.colors.dark }}>
                            Elevating the standard of beauty through intentional styling and artisan care. Your sanctuary for self-expression.
                        </p>
                        {/* <div className="flex gap-4">
                            {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                <Link key={i} href="#" className="p-3 rounded-full border border-black/10 hover:bg-white transition-all">
                                    <Icon size={18} style={{ color: theme.colors.dark }} />
                                </Link>
                            ))}
                        </div> */}
                    </div>

                    {/* Navigation Grid */}
                    <div className="grid grid-cols-2 gap-x-12 md:gap-x-24 gap-y-12">
                        {footerSections.map((section) => (
                            <div key={section.title}>
                                <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8 opacity-40">
                                    {section.title}
                                </p>
                                <ul className="space-y-4">
                                    {section.links.map((link) => (
                                        <li key={link}>
                                            <Link href="#" className="group flex items-center text-md font-medium hover:opacity-100 transition-all">
                                                <span style={{ color: theme.colors.dark }}>{link}</span>
                                                <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" style={{ color: theme.colors.primary }} />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Newsletter Box (Visual Break) */}
                <div className="bg-white p-8 md:p-12 mb-24 flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl">
                    <div>
                        <h3 className="text-2xl font-serif italic mb-2">Join the list</h3>
                        <p className="text-sm opacity-60 uppercase tracking-widest">Receive updates on new collections and events.</p>
                    </div>
                    <div className="w-full md:w-auto flex border-b-2 border-black/5 pb-2">
                        <input
                            type="email"
                            placeholder="Email address"
                            className="bg-transparent outline-none pr-4 w-full md:w-64 font-medium"
                        />
                        <button className="font-bold text-sm uppercase tracking-widest hover:translate-x-1 transition-transform">
                            Subscribe
                        </button>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-semibold opacity-40">
                    <p>© {new Date().getFullYear()} Gloss & Grace. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:opacity-100">Privacy</Link>
                        <Link href="#" className="hover:opacity-100">Terms</Link>
                        <Link href="#" className="hover:opacity-100">Cookies</Link>
                    </div>
                    <p className="hidden md:block">Handcrafted for Beauty</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;