'use client';

import theme from '@/theme';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import React, { useState } from 'react';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    subject?: string;
    message?: string;
}

const ContactUs = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // ── Validation ──────────────────────────────────────────────────────────────
    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'Please enter your first name.';
        if (!formData.lastName.trim()) newErrors.lastName = 'Please enter your last name.';
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = 'Please enter a valid email address.';
        if (!formData.subject) newErrors.subject = 'Please select a subject.';
        if (!formData.message.trim()) newErrors.message = 'Please enter your message.';
        return newErrors;
    };

    // ── Change handler ───────────────────────────────────────────────────────────
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    // ── Submit handler ───────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Something went wrong.');

            setIsSuccess(true);
        } catch (err: any) {
            alert(err.message || 'Failed to send. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Reset ────────────────────────────────────────────────────────────────────
    const handleReset = () => {
        setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
        setErrors({});
        setIsSuccess(false);
    };

    // ── Dynamic input class ──────────────────────────────────────────────────────
    const inputClass = (field: keyof FormErrors) =>
        `w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all bg-white ${errors[field]
            ? 'border-red-400 focus:ring-red-200'
            : 'border-[#C2C6B9] focus:ring-[#DBA1A2]'
        }`;

    // ── JSX ──────────────────────────────────────────────────────────────────────
    return (
        <div
            className="min-h-screen font-sans pt-10"
            style={{ backgroundColor: theme.colors.light, color: theme.colors.dark }}
        >
            {/* Header */}
            <header className="py-16 px-6 text-center" style={{ backgroundColor: theme.colors.subtitle }}>
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-[#422B23]">
                    Contact Us
                </h1>
                <p className="text-lg max-w-2xl mx-auto opacity-90">
                    Have a question about your order or need help finding your perfect fit? We're here to help!
                </p>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 gap-16 items-start">

                    {/* ── Left: Contact Info ── */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.primary }}>
                                Get in Touch
                            </h2>
                            <p className="leading-relaxed mb-6">
                                Whether you have questions about our handcrafted nails, shipping, or need a
                                personalized consultation, our team is ready to assist you.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full" style={{ backgroundColor: theme.colors.subtitle }}>
                                    <Mail />
                                </div>
                                <div>
                                    <h4 className="font-bold">Email Us</h4>
                                    <p className="text-sm opacity-80">Info@nailsaltd.co.uk</p>
                                    <p className="text-xs mt-1">We typically respond within 24–48 hours.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full" style={{ backgroundColor: theme.colors.subtitle }}>
                                    <Phone />
                                </div>
                                <div>
                                    <h4 className="font-bold">Call Us</h4>
                                    <p className="text-sm opacity-80">+44 7787 233999</p>
                                    <p className="text-xs mt-1">Available 9am – 6pm GMT.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full" style={{ backgroundColor: theme.colors.subtitle }}>
                                    <MapPin />
                                </div>
                                <div>
                                    <h4 className="font-bold">Headquarters</h4>
                                    <p className="text-sm opacity-80">69a Upper Abbey Road, Belvedere, DA17 5AF,
                                        London, UK</p>

                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full" style={{ backgroundColor: theme.colors.subtitle }}>
                                    <Clock />
                                </div>
                                <div>
                                    <h4 className="font-bold">Business Hours</h4>
                                    <p className="text-sm opacity-80">Mon — Fri: 9am – 6pm</p>
                                    <p className="text-sm opacity-80">Sat — Sun: Closed</p>
                                </div>
                            </div>

                        </div>

                        <div
                            className="p-6 rounded-2xl border border-dashed"
                            style={{ borderColor: theme.colors.primary }}
                        >
                            <p className="text-sm font-medium italic">
                                "Tag us in your #NailsaMagic moments for a chance to be featured on our gallery!" 💅✨
                            </p>
                        </div>
                    </div>

                    {/* ── Right: Contact Form ── */}
                    <div className="relative bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-[#422b23]/5 border border-[#F7F3ED]">

                        {/* Success Overlay */}
                        {isSuccess && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 bg-white rounded-3xl z-10 animate-fade-in">
                                <div className="text-5xl mb-4">💌</div>
                                <h3 className="text-2xl font-serif font-bold text-[#422B23] mb-2">
                                    Message Sent!
                                </h3>
                                <p className="text-sm opacity-70 max-w-xs leading-relaxed">
                                    Thanks for reaching out. We'll get back to you within 24–48 hours.
                                </p>
                                <button
                                    onClick={handleReset}
                                    className="mt-6 px-6 py-2.5 rounded-xl border font-semibold text-sm transition-all hover:text-white"
                                    style={{
                                        borderColor: theme.colors.primary,
                                        color: theme.colors.primary,
                                    }}
                                    onMouseEnter={e =>
                                        (e.currentTarget.style.backgroundColor = theme.colors.primary)
                                    }
                                    onMouseLeave={e =>
                                        (e.currentTarget.style.backgroundColor = 'transparent')
                                    }
                                >
                                    Send Another Message
                                </button>
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                            {/* First + Last Name */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold uppercase tracking-wider opacity-70">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="Jane"
                                        className={inputClass('firstName')}
                                    />
                                    {errors.firstName && (
                                        <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold uppercase tracking-wider opacity-70">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Doe"
                                        className={inputClass('lastName')}
                                    />
                                    {errors.lastName && (
                                        <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-sm font-semibold uppercase tracking-wider opacity-70">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="jane@example.com"
                                    className={inputClass('email')}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Subject */}
                            <div className="space-y-1">
                                <label className="text-sm font-semibold uppercase tracking-wider opacity-70">
                                    Subject
                                </label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className={inputClass('subject')}
                                >
                                    <option value="">Select a topic…</option>
                                    <option>Order Inquiry</option>
                                    <option>Shipping Question</option>
                                    <option>Size Consultation</option>
                                    <option>Faulty Item / Returns</option>
                                    <option>Other</option>
                                </select>
                                {errors.subject && (
                                    <p className="text-xs text-red-500 mt-1">{errors.subject}</p>
                                )}
                            </div>

                            {/* Message */}
                            <div className="space-y-1">
                                <label className="text-sm font-semibold uppercase tracking-wider opacity-70">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="How can we help you today?"
                                    className={inputClass('message')}
                                />
                                {errors.message && (
                                    <p className="text-xs text-red-500 mt-1">{errors.message}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                style={{ backgroundColor: theme.colors.primary }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12" cy="12" r="10"
                                                stroke="currentColor" strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8z"
                                            />
                                        </svg>
                                        Sending…
                                    </>
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </form>
                    </div>

                </div>
            </main>


        </div>
    );
};

export default ContactUs;