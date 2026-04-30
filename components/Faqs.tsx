import theme from "@/theme";
import { useState } from "react";

const faqs = [
    {
        question: "How long do they actually stay on?",
        answer: "With proper prep using our included kit, your nails can last up to 2 weeks. For short-term wear (1-3 days), use our adhesive tabs."
    },
    {
        question: "Are they reusable?",
        answer: "Yes! Because our nails are reinforced with a gel layer, they are durable enough to be worn multiple times. Simply buff away any dried glue from the back of the press-on before re-applying."
    },
    {
        question: "Will they damage my natural nails?",
        answer: "Not at all. Damage usually occurs during improper removal. Follow our removal guide (soaking in warm water and oil) to ensure your natural nails stay healthy."
    },
    {
        question: "Can I shower or swim with them?",
        answer: "Absolutely. Our adhesive is waterproof. We just recommend waiting 1 hour after application before getting them wet to let the bond set."
    }
]
export default function Faqs() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (


        <section className="mt-20 max-w-3xl mx-auto pb-32">
            <h2 className="text-3xl font-serif text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {faqs?.map((faq, index) => (
                    <div
                        key={index}
                        className="border-b transition-all"
                        style={{ borderColor: theme.colors.muted }}
                    >
                        <button
                            className="w-full py-6 flex justify-between items-center text-left group"
                            onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        >
                            <span className="text-sm font-bold uppercase tracking-widest group-hover:opacity-60 transition-opacity">
                                {faq.question}
                            </span>
                            <span className="text-xl transform transition-transform duration-300" style={{ color: theme.colors.primary }}>
                                {openFaq === index ? "−" : "+"}
                            </span>
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? "max-h-40 pb-6" : "max-h-0"
                                }`}
                        >
                            <p className="text-sm leading-relaxed opacity-70 italic">
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>


        </section>
    );
}