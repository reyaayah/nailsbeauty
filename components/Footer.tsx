import React from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    CreditCard
} from 'lucide-react';

const Footer = () => {
    const theme = {
        colors: {
            primary: "#DBA1A2",
            dark: "#422B23",
            light: "#F7F3ED",
            muted: "#C2C6B9",
            subtitle: "#EFD8D6",
        },
    };

    const footerSections = [
        {
            title: "SERVICES",
            links: ["Hair Styling", "Color & Highlights", "Manicure & Pedicure", "Facial Treatments", "Bridal Packages", "Men's Grooming"]
        },
        {
            title: "BOUTIQUE",
            links: ["Hair Care", "Skin Care", "Gift Cards", "Membership", "New Arrivals"]
        },
        {
            title: "INFORMATION",
            links: ["About Us", "Our Stylists", "Contact Us", "Careers", "Privacy Policy", "Terms of Service"]
        }
    ];

    return (
        <footer style={{ backgroundColor: theme.colors.dark, color: theme.colors.light }} className="py-16 px-6 md:px-12 w-full">
            <div className="max-w-7xl mx-auto">
                {/* Top Section: Links and Newsletter */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-sm font-bold tracking-widest mb-6" style={{ color: theme.colors.subtitle }}>
                                {section.title}
                            </h3>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <Link href="#" className="text-sm hover:opacity-70 transition-opacity uppercase tracking-tight">
                                            {link}
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
                            Join the Gloss & Grace family. Subscribe for exclusive offers, beauty tips, and trend updates.
                        </p>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="w-full bg-transparent border-b py-2 pr-10 focus:outline-none transition-colors"
                                style={{ borderColor: theme.colors.muted }}
                            />
                            <button className="absolute right-0 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform">
                                <ArrowRight size={18} style={{ color: theme.colors.primary }} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Socials, Copyright, and Payments */}
                <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-8" style={{ borderColor: 'rgba(247, 243, ED, 0.1)' }}>

                    {/* Social Icons */}
                    <div className="flex space-x-6">
                        {/* <Instagram size={20} className="cursor-pointer hover:opacity-70" />
            <Facebook size={20} className="cursor-pointer hover:opacity-70" />
            <Youtube size={20} className="cursor-pointer hover:opacity-70" /> */}
                    </div>

                    {/* Copyright */}
                    <div className="text-center">
                        <p className="text-xs tracking-widest uppercase mb-2">
                            © {new Date().getFullYear()} Gloss & Grace Salon
                        </p>
                        <div className="flex space-x-4 text-[10px] uppercase opacity-60">
                            <Link href="#">Privacy Policy</Link>
                            <Link href="#">Terms of Service</Link>
                        </div>
                    </div>

                    {/* Payment Icons Placeholder */}
                    <div className="flex space-x-3 opacity-80">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="w-10 h-6 rounded bg-white/10 flex items-center justify-center"
                            >
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