import theme from '@/theme';
import { Box, GlobeIcon, HeartXIcon, Pin, Rocket, Star, Truck } from 'lucide-react';
import React from 'react';



const ShippingPolicy = () => {
    return (
        <div className="min-h-screen font-sans pt-10" style={{ backgroundColor: theme.colors.light, color: theme.colors.dark }}>
            {/* Header Section */}
            <header className="py-16 px-6 text-center" style={{ backgroundColor: theme.colors.subtitle }}>
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Shipping Policy</h1>
                <p className="text-lg max-w-2xl mx-auto opacity-90">
                    Everything you need to know about how we deliver your handcrafted Nailsa magic to your doorstep.
                </p>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">

                {/* Worldwide Shipping */}
                <section className="bg-white p-8 rounded-2xl shadow-sm border" style={{ borderColor: theme.colors.muted }}>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl"><GlobeIcon /></span>
                        <h2 className="text-2xl font-bold uppercase tracking-wide">Worldwide Shipping</h2>
                    </div>
                    <p className="leading-relaxed">
                        At Nailsa, we're passionate about delivering our handcrafted masterpieces to nail enthusiasts all around the world.
                        Shipping specifics, including charges and estimated delivery times, will be clearly laid out for you during checkout.
                        We're thrilled to offer <span className="font-bold" style={{ color: theme.colors.primary }}>complimentary shipping on all orders exceeding $79 USD.</span>
                    </p>
                </section>

                {/* Crafting & Timeline Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    <section>
                        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                            <span style={{ color: theme.colors.primary }}><Star /></span> Crafting Your Magic
                        </h3>
                        <p className="text-sm leading-relaxed">
                            Every Nailsa nail set is uniquely tailored just for you. Our made-to-order approach guarantees personalized craftsmanship and champions sustainability by reducing waste.
                            <strong> Kindly allow 2-5 business days</strong> for our artists to craft your perfect set.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                            <span style={{ color: theme.colors.primary }}><Truck /></span> Shipping Timeline
                        </h3>
                        <p className="text-sm leading-relaxed">
                            Orders are dispatched immediately after handcrafting. You'll receive a tracking number via email once the journey begins. If tracking hasn't updated for over a week, contact us and we'll investigate immediately.
                        </p>
                    </section>
                </div>

                <hr style={{ borderColor: theme.colors.muted }} />

                {/* Express Shipping Notice */}
                <section className="bg-opacity-50 p-6 rounded-xl border-l-4" style={{ backgroundColor: theme.colors.subtitle, borderLeftColor: theme.colors.primary }}>
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                        <Rocket /> Express Shipping Notice
                    </h3>
                    <p className="text-sm mb-4">
                        Orders containing liquids or battery items (e.g., UV Lamps, Cuticle Oils, Glues) may face customs delays. Delivery within 2–5 business days is <strong>not guaranteed</strong> for these items.
                    </p>
                    <div className="text-xs grid grid-cols-2 md:grid-cols-3 gap-2 opacity-80">
                        <span>• Solid Nail Glue</span>
                        <span>• Nailsa Magic Glue</span>
                        <span>• Cuticle Oil Pen</span>
                        <span>• Handheld UV Lamp</span>
                        <span>• Removal Pen</span>
                        <span>• Nail Stamp</span>
                    </div>
                </section>

                {/* Support & Returns */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="font-bold mb-2"><Pin /> Address & Cancels</h4>
                        <p className="text-xs">
                            Contact <span className="underline">Info@nailsaltd.co.uk</span> within <strong>12 hours</strong>. After this, orders cannot be intercepted.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2"><Box /> Lost Items</h4>
                        <p className="text-xs">
                            While beyond our control, we collaborate with carriers to resolve issues and ensure your satisfaction.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2"><HeartXIcon /> Damage Notice</h4>
                        <p className="text-xs">
                            Report shipping damage within <strong>7 days</strong> with photo/video proof to our support team.
                        </p>
                    </div>
                </div>

            </main>

            {/* Footer Contact CTA */}
            <footer className="py-12 text-center border-t" style={{ borderColor: theme.colors.muted }}>
                <p className="mb-4">Need further assistance?</p>
                <a
                    href="mailto:Info@nailsaltd.co.uk"
                    className="inline-block px-8 py-3 rounded-full transition-transform hover:scale-105 font-bold"
                    style={{ backgroundColor: theme.colors.primary, color: 'white' }}
                >
                    Contact Customer Service
                </a>
            </footer>
        </div>
    );
};

export default ShippingPolicy;