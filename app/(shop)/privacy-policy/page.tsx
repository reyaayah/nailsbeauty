import React from 'react';

const PrivacyPolicy = () => {
    const brandName = "Grace & Gloss";
    const domain = "graceandgloss.com";
    const contactEmail = "support@graceandgloss.com";

    return (
        <div className="bg-white text-gray-800 min-h-screen pt-20">
            {/* Header Section */}
            <header className="bg-gray-50 border-b py-12 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-500 uppercase tracking-widest text-sm">
                        Last Updated: May 2026
                    </p>
                </div>
            </header>

            {/* Content Section */}
            <main className="max-w-4xl mx-auto py-12 px-6 leading-relaxed">
                <section className="mb-10">
                    <p className="mb-4 ">
                        At <span className="font-semibold text-black">{brandName}</span>, we value the trust you place in us. This policy outlines how we handle your personal data across <span className="underline">{domain}</span>—from the moment you browse our collections to the final touches of your purchase—ensuring your privacy is always protected.
                    </p>
                    <p>
                        By using and accessing any of our Services, you agree to the collection, use, and disclosure of your information as described in this policy. If you do not agree to this Privacy Policy, please do not use or access any of the Services.
                    </p>
                </section>

                <div className="space-y-12">
                    {/* Collection of Information */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 uppercase tracking-wide border-b pb-2 text-gray-900">
                            Information We Collect
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                                <h3 className="font-bold mb-2">Directly From You</h3>
                                <ul className="text-sm space-y-2 text-gray-600 list-disc ml-4">
                                    <li>Contact details (Name, address, phone, email)</li>
                                    <li>Order information (Shipping/Billing details)</li>
                                    <li>Account info (Username, password)</li>
                                    <li>Shopping info (Wishlist, cart items)</li>
                                    <li>Customer support communications</li>
                                </ul>
                            </div>
                            <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                                <h3 className="font-bold mb-2">Automated Tech</h3>
                                <ul className="text-sm space-y-2 text-gray-600 list-disc ml-4">
                                    <li>Usage Data (How you use the site)</li>
                                    <li>Device info (IP address, browser type)</li>
                                    <li>Cookies and Pixels</li>
                                    <li>Network connection details</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Use of Information */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 uppercase tracking-wide border-b pb-2 text-gray-900">
                            How We Use Your Information
                        </h2>
                        <div className="space-y-4">
                            <p>
                                <span className="font-bold">Providing Services:</span> We use your info to process payments, fulfill orders, manage your account, and facilitate returns/exchanges.
                            </p>
                            <p>
                                <span className="font-bold">Marketing:</span> To send promotional communications by email or text and tailor advertisements to your preferences.
                            </p>
                            <p>
                                <span className="font-bold">Security:</span> To detect and prevent fraudulent, illegal, or malicious activity.
                            </p>
                        </div>
                    </section>

                    {/* Third Parties */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 uppercase tracking-wide border-b pb-2 text-gray-900">
                            Third-Party Disclosures
                        </h2>
                        <p className="mb-4">
                            We may disclose your personal information to third parties for legitimate purposes, including:
                        </p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>Vendors performing services on our behalf (Payment processing, cloud storage, shipping).</li>
                            <li>Business and marketing partners (Shopify, analytics providers).</li>
                            <li>Compliance with legal obligations or protection of our rights.</li>
                        </ul>
                    </section>

                    {/* Cookies Section */}
                    <section className="bg-black text-white p-8 rounded-2xl">
                        <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">Cookies</h2>
                        <p className="text-gray-300 text-sm mb-4">
                            We use Cookies to power and improve our Site. You can set your browser to remove or reject Cookies, but please note that this may negatively impact your experience and limit access to certain features.
                        </p>
                        <a
                            href="https://www.shopify.com/legal/cookies"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white underline font-medium text-sm hover:text-gray-400"
                        >
                            Learn more about Shopify Cookies &rarr;
                        </a>
                    </section>

                    {/* Your Rights */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 uppercase tracking-wide border-b pb-2 text-gray-900">
                            Your Rights and Choices
                        </h2>
                        <p className="mb-4">Depending on where you live, you may have the following rights:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="border p-4 rounded text-sm">Right to Access / Know</div>
                            <div className="border p-4 rounded text-sm">Right to Delete / Correct</div>
                            <div className="border p-4 rounded text-sm">Right of Portability</div>
                            <div className="border p-4 rounded text-sm">Withdrawal of Consent</div>
                        </div>
                    </section>

                    {/* Contact Footer */}
                    <footer className="mt-16 pt-8 border-t text-center">
                        <h2 className="text-2xl font-serif font-bold mb-4 italic text-gray-900">Get in Touch</h2>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            If you have questions about our privacy practices or would like to exercise your rights, please reach out to us.
                        </p>
                        <a
                            href={`mailto:${contactEmail}`}
                            className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg"
                        >
                            Email Us: {contactEmail}
                        </a>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicy;