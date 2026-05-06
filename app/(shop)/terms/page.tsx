import React from 'react';

const TermsOfService = () => {
    const brandName = "Grace & Gloss";
    const contactEmail = "support@graceandgloss.com";

    return (
        <div className="bg-white text-gray-800 min-h-screen pt-20">
            {/* Header Section */}
            <header className="bg-gray-50 border-b py-12 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight">
                        Terms of Service
                    </h1>
                    <p className="text-gray-500 uppercase tracking-widest text-sm">
                        Last Updated: May 2026
                    </p>
                </div>
            </header>

            {/* Content Section */}
            <main className="max-w-4xl mx-auto py-12 px-6 leading-relaxed">

                {/* Overview */}
                <section className="mb-10">
                    <h2 className="text-xl font-bold mb-4 uppercase tracking-wide border-b pb-2">Overview</h2>
                    <p className="mb-4">
                        This website is operated by <span className="font-semibold">{brandName}</span>. Throughout the site, the terms “we”, “us” and “our” refer to {brandName}. We offer this website, including all information, tools, and Services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.
                    </p>
                    <p>
                        By visiting our site or purchasing from us, you engage in our “Service” and agree to be bound by the following terms and conditions (“Terms of Service”, “Terms”). These Terms apply to all users of the site, including browsers, vendors, customers, and content contributors.
                    </p>
                </section>

                <div className="space-y-12">

                    {/* Section 1 */}
                    <section>
                        <h3 className="font-bold text-lg mb-3">Section 1 - Online Store Terms</h3>
                        <p>
                            By agreeing to these Terms, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h3 className="font-bold text-lg mb-3">Section 2 - General Conditions</h3>
                        <p>
                            We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (excluding credit card information) may be transferred unencrypted. <strong>Credit card information is always encrypted during transfer over networks.</strong>
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h3 className="font-bold text-lg mb-3">Section 3 - Product Accuracy & Pricing</h3>
                        <p className="mb-4">
                            Prices for our products are subject to change without notice. We shall not be liable to you or to any third-party for any modification, price change, or discontinuance of the Service.
                        </p>
                        <p>
                            We have made every effort to display the colors and images of our products as accurately as possible. However, we cannot guarantee that your monitor's display of any color will be 100% accurate.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h3 className="font-bold text-lg mb-3">Section 4 - Billing and Account</h3>
                        <p>
                            We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.
                        </p>
                    </section>

                    {/* Section 5 */}
                    <section className="bg-gray-50 p-6 rounded-lg border">
                        <h3 className="font-bold text-lg mb-3">Section 5 - Prohibited Uses</h3>
                        <p className="mb-2 text-sm text-gray-600 italic">In addition to other prohibitions, you are prohibited from using the site or its content:</p>
                        <ul className="list-disc ml-6 space-y-2 text-sm">
                            <li>For any unlawful purpose or to solicit others to perform unlawful acts.</li>
                            <li>To infringe upon or violate our intellectual property rights or those of others.</li>
                            <li>To upload or transmit viruses or any other type of malicious code.</li>
                            <li>To collect or track the personal information of others or to scrape data.</li>
                        </ul>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h3 className="font-bold text-lg mb-3">Section 6 - Disclaimer of Warranties</h3>
                        <p className="italic">
                            Our service and all products delivered to you are (except as expressly stated by us) provided 'as is' and 'as available' for your use, without any representation, warranties, or conditions of any kind, either express or implied.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h3 className="font-bold text-lg mb-3">Section 7 - Governing Law</h3>
                        <p>
                            These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the United States.
                        </p>
                    </section>

                </div>

                {/* Contact Footer */}
                <footer className="mt-16 pt-8 border-t text-center">
                    <h2 className="text-xl font-bold mb-4">Questions?</h2>
                    <p className="text-gray-600">
                        Contact our support team at: <br />
                        <a
                            href={`mailto:${contactEmail}`}
                            className="text-black font-semibold underline hover:text-gray-600 transition-colors"
                        >
                            {contactEmail}
                        </a>
                    </p>
                </footer>
            </main>
        </div>
    );
};

export default TermsOfService;