import theme from "@/theme";
import Link from "next/link";

const shapes = [
    { name: "Almond", image: "/shapes/almond.png", href: "/products?shape=Almond", desc: "Elegant & Slender" },
    { name: "Coffin", image: "/shapes/coffin.png", href: "/products?shape=Coffin", desc: "Bold & Modern" },
    { name: "Oval", image: "/shapes/oval.png", href: "/products?shape=Oval", desc: "Classic & Timeless" },
    { name: "Square", image: "/shapes/square.png", href: "/products?shape=Square", desc: "Sharp & Strong" },
    { name: "Squoval", image: "/shapes/squoval.png", href: "/products?shape=Squoval", desc: "The Best of Both" },
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
                    <div className="max-w-xl text-left w-full">
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

                {/* Container: Stacked on Mobile (Auto height), Flex-Row on Desktop (Fixed height) */}
                <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[500px]">
                    {shapes.map((shape, index) => (
                        <Link
                            key={shape.name}
                            href={shape.href}
                            style={{ backgroundColor: theme.colors.primary }}
                            /* 
                               Mobile: Fixed height (300px) so images have room to be "big"
                               Desktop: flex-1 to allow the expansion effect
                            */
                            className="relative group flex-none md:flex-1 h-[350px] md:h-full overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:md:flex-[2] border border-white/5"
                        >
                            {/* Shape Name */}
                            <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
                                <h3 className="text-white text-2xl font-serif tracking-wide group-hover:text-[#DBA1A2] transition-colors">
                                    {shape.name}
                                </h3>
                                <p className="text-white text-xs uppercase tracking-widest mt-2 transition-opacity duration-500">
                                    {shape.desc}
                                </p>
                            </div>

                            {/* Background Numbering */}
                            <span className="absolute bottom-4 right-4 text-7xl md:text-8xl font-serif text-white/5 pointer-events-none uppercase">
                                0{index + 1}
                            </span>

                            {/* 
                                Image Treatment 
                                Reduced padding on mobile (p-4) vs desktop (p-12) to let the image grow
                            */}
                            <div className="absolute inset-0 flex items-center justify-center p-4 md:p-12">
                                <img
                                    src={shape.image}
                                    alt={shape.name}
                                    className="w-full h-full object-contain grayscale-0 md:grayscale md:group-hover:grayscale-0 scale-100 md:scale-90 md:group-hover:scale-110 transition-all duration-700"
                                />
                            </div>

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 md:group-hover:opacity-30 transition-opacity" />

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