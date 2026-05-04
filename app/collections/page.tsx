import { CollectionsCarousel } from "@/components/CollectionCarousel";
import theme from "@/theme";

export default async function ShopCollection({
    searchParams,
}: {
    searchParams: { collection?: string };
}) {
    const { collection } = await searchParams;
    const activeCollection = collection ?? null;

    return (
        <section
            className="min-h-screen py-[72px] px-6"
            style={{ background: theme.colors.light, fontFamily: "'DM Sans', sans-serif" }}
        >
            <div className="max-w-[1160px] mx-auto">

                {/* Header */}
                <div className="text-center mb-[52px]">
                    <p
                        className="text-[11px] font-medium uppercase tracking-[0.22em] mb-3 flex items-center justify-center gap-3"
                        style={{ color: theme.colors.primary }}
                    >
                        <span className="inline-block w-7 h-[1.5px]" style={{ background: theme.colors.primary }} />
                        Handcrafted with love
                        <span className="inline-block w-7 h-[1.5px]" style={{ background: theme.colors.primary }} />
                    </p>

                    <h2
                        className="font-bold leading-[1.1] tracking-tight"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                            color: theme.colors.dark,
                        }}
                    >
                        {activeCollection
                            ? <>Browsing <em style={{ color: theme.colors.primary }}>{activeCollection.replace(/-+/g, " ")}</em></>
                            : <>Shop Our <em style={{ color: theme.colors.primary }}>Collection</em></>
                        }
                    </h2>

                    <p
                        className="mt-3 text-[14px] leading-relaxed max-w-[380px] mx-auto"
                        style={{ color: theme.colors.muted }}
                    >
                        Salon-quality nails at home — gel sets, press-ons & nail art
                        delivered to your door.
                    </p>

                    {activeCollection && (
                        <div className="mt-4 flex items-center justify-center gap-2">
                            <span
                                className="text-[12px] px-3 py-1 rounded-full capitalize"
                                style={{
                                    background: theme.colors.primary + "22",
                                    color: theme.colors.primary,
                                }}
                            >
                                {activeCollection.replace(/-+/g, " ")}
                            </span>

                            <a
                                href="/collections"
                                className="text-[11px] underline opacity-60 hover:opacity-100"
                                style={{ color: theme.colors.dark }}
                            >
                                Clear
                            </a>
                        </div>
                    )}
                </div>

                <CollectionsCarousel activeCollection={activeCollection} />
            </div>
        </section>
    );
}