import theme from '@/theme';
import { Clock, Mail, MapPin } from 'lucide-react';
import React from 'react';

const ContactUs = () => {
    return (
        <div className="min-h-screen font-sans pt-10" style={{ backgroundColor: theme.colors.light, color: theme.colors.dark }}>
            {/* Header Section */}
            <header className="py-16 px-6 text-center" style={{ backgroundColor: theme.colors.subtitle }}>
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-[#422B23]">Contact Us</h1>
                <p className="text-lg max-w-2xl mx-auto opacity-90">
                    Have a question about your order or need help finding your perfect fit? We're here to help!
                </p>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 gap-16 items-start">

                    {/* Left Side: Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.primary }}>Get in Touch</h2>
                            <p className="leading-relaxed mb-6">
                                Whether you have questions about our handcrafted nails, shipping, or need a personalized consultation, our team is ready to assist you.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full" style={{ backgroundColor: theme.colors.subtitle }}>
                                    <span className="text-xl"><Mail /></span>
                                </div>
                                <div>
                                    <h4 className="font-bold">Email Us</h4>
                                    <p className="text-sm opacity-80">hello@gandgnails.com</p>
                                    <p className="text-xs mt-1">We typically respond within 24-48 hours.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full" style={{ backgroundColor: theme.colors.subtitle }}>
                                    <span className="text-xl"><MapPin /></span>
                                </div>
                                <div>
                                    <h4 className="font-bold">Headquarters</h4>
                                    <p className="text-sm opacity-80">G&G Nails Studio</p>
                                    <p className="text-xs mt-1">Handcrafted with love, shipped worldwide.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full" style={{ backgroundColor: theme.colors.subtitle }}>
                                    <span className="text-xl"><Clock /></span>
                                </div>
                                <div>
                                    <h4 className="font-bold">Business Hours</h4>
                                    <p className="text-sm opacity-80">Mon — Fri: 9am - 6pm</p>
                                    <p className="text-sm opacity-80">Sat — Sun: Closed</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Callout */}
                        <div className="p-6 rounded-2xl border border-dashed" style={{ borderColor: theme.colors.primary }}>
                            <p className="text-sm font-medium italic">
                                "Tag us in your #G&GMagic moments for a chance to be featured on our gallery!" 💅✨
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Simple Contact Form */}
                    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-[#422b23]/5 border border-[#F7F3ED]">
                        <form className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold uppercase tracking-wider opacity-70">First Name</label>
                                    <input
                                        type="text"
                                        placeholder="Jane"
                                        className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all border-[#C2C6B9] focus:ring-[#DBA1A2]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold uppercase tracking-wider opacity-70">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Doe"
                                        className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all border-[#C2C6B9] focus:ring-[#DBA1A2]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold uppercase tracking-wider opacity-70">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="jane@example.com"
                                    className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all border-[#C2C6B9] focus:ring-[#DBA1A2]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold uppercase tracking-wider opacity-70">Subject</label>
                                <select
                                    className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all bg-white border-[#C2C6B9] focus:ring-[#DBA1A2]"
                                >
                                    <option>Order Inquiry</option>
                                    <option>Shipping Question</option>
                                    <option>Size Consultation</option>
                                    <option>Faulty Item / Returns</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold uppercase tracking-wider opacity-70">Message</label>
                                <textarea
                                    rows={4}
                                    placeholder="How can we help you today?"
                                    className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all border-[#C2C6B9] focus:ring-[#DBA1A2]"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                style={{ backgroundColor: theme.colors.primary }}
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                </div>
            </main>

            <footer className="py-12 text-center opacity-60 border-t" style={{ borderColor: theme.colors.muted }}>
                <p className="text-xs tracking-widest uppercase">
                    © 2024 G&G Nails. Handcrafted Excellence.
                </p>
            </footer>
        </div>
    );
};

export default ContactUs;