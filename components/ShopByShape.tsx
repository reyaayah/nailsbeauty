import theme from "@/theme";
import Link from "next/link";

const shapes = [
    { name: "Almond", image: "/shapes/almond.png", href: "/collections/almond", desc: "Elegant & Slender" },
    { name: "Coffin", image: "/shapes/coffin.png", href: "/collections/coffin", desc: "Bold & Modern" },
    { name: "Oval", image: "/shapes/oval.png", href: "/collections/oval", desc: "Classic & Timeless" },
    { name: "Square", image: "/shapes/square.png", href: "/collections/square", desc: "Sharp & Strong" },
    { name: "Squoval", image: "/shapes/squoval.png", href: "/collections/squoval", desc: "The Best of Both" },

];

export default function ShopByShape() {
    return (
        <section
            style={{ backgroundColor: theme.colors.dark }}
            className="py-24 px-4 w-full overflow-hidden"
        >
            <div className="max-w-7xl mx-auto">
                {/* Side-Aligned Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl">
                        <span style={{ color: theme.colors.primary }} className="text-xs uppercase tracking-[0.4em] font-bold mb-4 block">
                            Curation
                        </span>
                        <h2 className="text-5xl md:text-7xl font-serif text-white leading-tight">
                            Define Your <span className="italic">Silhouette.</span>
                        </h2>
                    </div>
                    <p style={{ color: theme.colors.muted }} className="text-lg max-w-xs md:text-right font-light">
                        Explore our signature shapes designed to complement every hand.
                    </p>
                </div>

                {/* Horizontal Scroll / Flex Container */}
                <div className="flex flex-col md:flex-row gap-4 h-[600px] md:h-[500px]">
                    {shapes.map((shape, index) => (
                        <Link
                            key={shape.name}
                            href={shape.href}
                            style={{ backgroundColor: theme.colors.primary }}
                            className="relative group flex-1 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:flex-[2]  border border-white/5"
                        >
                            {/* Shape Name - Vertical on Desktop */}
                            <div className="absolute top-8 left-8 z-20">
                                <h3 className="text-white text-2xl font-serif tracking-wide group-hover:text-[#DBA1A2] transition-colors">
                                    {shape.name}
                                </h3>
                                <p className="text-white text-xs uppercase tracking-widest mt-2  group-hover:opacity-100 transition-opacity duration-500">
                                    {shape.desc}
                                </p>
                            </div>

                            {/* Background Numbering */}
                            <span className="absolute bottom-4 right-4 text-8xl font-serif text-white/5 pointer-events-none uppercase">
                                0{index + 1}
                            </span>

                            {/* Image Treatment */}
                            <div className="absolute inset-0 flex items-center justify-center p-12">
                                <img
                                    src={shape.image}
                                    alt={shape.name}
                                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 scale-90 group-hover:scale-110 transition-all duration-700"
                                />
                            </div>

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                            {/* Interaction Line */}
                            <div
                                style={{ backgroundColor: theme.colors.primary }}
                                className="absolute bottom-0 left-0 h-1 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}