"use client";
import Link from 'next/link';
import { ArrowRight, CreditCard, Loader2 } from 'lucide-react';
import theme from '@/theme';
import Image from 'next/image';
import { useState } from 'react';
type NewsletterState = 'idle' | 'loading' | 'success' | 'error';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [newsletterState, setNewsletterState] = useState<NewsletterState>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const validateEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setErrorMessage('Please enter a valid email address.');
            setNewsletterState('error');
            return;
        }

        setNewsletterState('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.status === 409) {
                setErrorMessage('This email is already subscribed.');
                setNewsletterState('error');
                return;
            }

            if (!res.ok) throw new Error('Subscription failed');

            setNewsletterState('success');
            setEmail('');
        } catch {
            setNewsletterState('error');
            setErrorMessage('Something went wrong. Please try again shortly.');
        }
    };
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
                { name: "TOOLS & ACCESSORIES", href: "/collections/toolsandaccessories" }
            ]
        }
    ];

    return (
        <footer style={{ backgroundColor: theme.colors.dark, color: theme.colors.light }} className="py-16 px-6 md:px-12 w-full"><div className="max-w-7xl mx-auto">

            {/* Logo */}
            <div className="flex justify-center md:justify-start mb-12">
                <Link href="/">
                    <Image
                        src="/nailsa-logo.png"
                        alt="Nailsa Logo"
                        width={140}
                        height={50}
                        className="object-contain"
                        priority
                    />
                </Link>
            </div>
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
                    <form
                        className="relative group"
                        onSubmit={handleNewsletterSubmit}
                        noValidate
                    >
                        <input
                            type="email"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (newsletterState === 'error') {
                                    setNewsletterState('idle');
                                    setErrorMessage('');
                                }
                            }}
                            disabled={newsletterState === 'loading'}
                            className="w-full bg-transparent border-b py-2 pr-10 focus:outline-none transition-colors disabled:opacity-50"
                            style={{ borderColor: theme.colors.muted }}
                            aria-label="Email address for newsletter"
                            aria-describedby={
                                newsletterState === 'error' ? 'newsletter-error' : undefined
                            }
                        />

                        <button
                            type="submit"
                            disabled={newsletterState === 'loading'}
                            className="absolute right-0 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Subscribe to newsletter"
                        >
                            {newsletterState === 'loading' ? (
                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                    style={{ color: theme.colors.primary }}
                                />
                            ) : (
                                <ArrowRight
                                    size={18}
                                    style={{ color: theme.colors.primary }}
                                />
                            )}
                        </button>
                    </form>

                    {/* Error message */}
                    {newsletterState === 'error' && errorMessage && (
                        <p
                            id="newsletter-error"
                            role="alert"
                            className="mt-3 text-xs leading-relaxed"
                            style={{ color: '#e07070' }}
                        >
                            {errorMessage}
                        </p>
                    )}
                </div>
            </div>
            {/* Contact Info */}
            <div
                className="py-8 border-t  grid grid-cols-1 md:grid-cols-2 gap-6 text-sm"
                style={{ borderColor: 'rgba(247, 243, 237, 0.1)' }}
            >
                <div>
                    <h4
                        className="text-sm font-bold tracking-widest mb-3"
                        style={{ color: theme.colors.subtitle }}
                    >
                        ADDRESS
                    </h4>
                    <p className="leading-relaxed opacity-80">
                        69a Upper Abbey Road, Belvedere, DA17 5AF,
                        <br />
                        London, UK
                    </p>
                </div>

                <div>
                    <h4
                        className="text-sm font-bold tracking-widest mb-3"
                        style={{ color: theme.colors.subtitle }}
                    >
                        CONTACT
                    </h4>
                    <a
                        href="tel:+447787233999"
                        className="hover:underline opacity-80"
                    >
                        +44 7787 233999
                    </a>
                </div>
            </div>


            {/* Bottom Section */}
            <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-8" style={{ borderColor: 'rgba(247, 243, 237, 0.1)' }}>
                <div className="text-center md:text-left">
                    <p className="text-xs tracking-widest uppercase mb-2">
                        © {new Date().getFullYear()} Nailsa. All rights reserved.
                    </p>
                    <div className="flex space-x-4 text-[10px] uppercase opacity-60">
                        <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
                        <Link href="/terms" className="hover:underline">Terms of Service</Link>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 opacity-90">
                    {[
                        "/payments/paypal.png",
                        "/payments/mastercard.png",
                        "/payments/gpay.png",
                        "/payments/discover.png",
                        "/payments/banccontact.png",
                        "/payments/apple-pay.png",
                        "/payments/amex.png",
                        "/payments/visa.png",
                    ].map((logo, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-md px-3 py-2 flex items-center justify-center shadow-sm"
                        >
                            <img
                                src={logo}
                                alt="payment"
                                className="h-5 object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </footer>
    );
};

export default Footer;