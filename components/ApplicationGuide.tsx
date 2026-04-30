import theme from "@/theme";


const applicationSteps: { title: string; desc: string }[] = [
    { title: "Prep", desc: "Push back cuticles and lightly buff the natural nail surface." },
    { title: "Cleanse", desc: "Wipe nails with an alcohol pad to remove oils and dust." },
    { title: "Apply", desc: "Apply a thin layer of glue or adhesive tab to the press-on." },
    { title: "Press", desc: "Align at the cuticle and press firmly for 30 seconds." }
]
export default function ApplicationGuide() {
    return (
        <section className="mt-20 border-t pt-16 pb-20" style={{ borderColor: theme.colors.muted }}>
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-serif mb-4" style={{ color: theme.colors.dark }}>
                    How to Apply
                </h2>
                <p className="opacity-60 italic mb-12">Five minutes to a flawless salon-grade manicure.</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {applicationSteps?.map((step, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black mb-4"
                                style={{ backgroundColor: theme.colors.primary, color: 'white' }}
                            >
                                0{index + 1}
                            </div>
                            <h3 className="font-bold uppercase tracking-widest text-xs mb-2">
                                {step.title}
                            </h3>
                            <p className="text-sm leading-relaxed opacity-70">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Pro Tip Box */}
                <div
                    className="mt-16 p-6 rounded-2xl inline-block border-l-4"
                    style={{ backgroundColor: `${theme.colors.primary}10`, borderColor: theme.colors.primary }}
                >
                    <p className="text-sm font-medium italic">
                        <strong>Pro Tip:</strong> Avoid water for at least 1 hour after application to let the adhesive fully bond for maximum longevity.
                    </p>
                </div>
            </div>
        </section>
    );
}