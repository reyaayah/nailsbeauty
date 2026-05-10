import { CollectionsCarousel } from "@/components/CollectionCarousel";
import { CollectionsSection } from "@/components/CollectionSection";
import theme from "@/theme";
import type { Metadata } from "next";

// ─── SEO ────────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nailsaltd.co.uk/collections";

export async function generateMetadata({
    searchParams,
}: {
    searchParams: { collection?: string };
}): Promise<Metadata> {
    const { collection } = await searchParams;
    const collectionLabel = collection
        ? collection.replace(/-+/g, " ")
        : null;

    const title = collectionLabel
        ? `${collectionLabel.replace(/\b\w/g, (c) => c.toUpperCase())} | Shop Nail Collections`
        : "Shop Our Nail Collection | Gel Sets, Press-Ons & Nail Art";

    const description = collectionLabel
        ? `Browse our ${collectionLabel} nail collection — salon-quality gel sets, press-ons, and nail art delivered to your door.`
        : "Shop salon-quality nails at home. Discover our full range of gel sets, press-on nails, and nail art kits — handcrafted with love and delivered to your door.";

    const canonicalPath = collection
        ? `/collections?collection=${collection}`
        : "/collections";

    return {
        title,
        description,
        keywords: [
            "nail collection",
            "gel nails",
            "press on nails",
            "nail art",
            "salon quality nails",
            "nail kits",
            collectionLabel ?? "",
        ].filter(Boolean),

        alternates: {
            canonical: `${BASE_URL}${canonicalPath}`,
        },

        openGraph: {
            type: "website",
            url: `${BASE_URL}${canonicalPath}`,
            title,
            description,
            siteName: "Your Brand Name",
            images: [
                {
                    url: `${BASE_URL}/og/collections${collection ? `-${collection}` : ""}.jpg`,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [`${BASE_URL}/og/collections${collection ? `-${collection}` : ""}.jpg`],
            creator: "@yourbrandhandle",
        },

        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-snippet": -1,
                "max-image-preview": "large",
                "max-video-preview": -1,
            },
        },
    };
}

// ─── JSON-LD structured data ─────────────────────────────────────────────────

function CollectionJsonLd({
    activeCollection,
}: {
    activeCollection: string | null;
}) {
    const collectionLabel = activeCollection?.replace(/-+/g, " ") ?? null;
    const canonicalUrl = `${BASE_URL}/collections${activeCollection ? `?collection=${activeCollection}` : ""}`;

    const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: collectionLabel
            ? `${collectionLabel.replace(/\b\w/g, (c) => c.toUpperCase())} Nail Collection`
            : "Nail Collection",
        description:
            "Salon-quality nails at home — gel sets, press-ons & nail art delivered to your door.",
        url: canonicalUrl,
        breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: BASE_URL,
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: "Collections",
                    item: `${BASE_URL}/collections`,
                },
                ...(collectionLabel
                    ? [
                        {
                            "@type": "ListItem",
                            position: 3,
                            name: collectionLabel.replace(/\b\w/g, (c) =>
                                c.toUpperCase()
                            ),
                            item: canonicalUrl,
                        },
                    ]
                    : []),
            ],
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ShopCollection({
    searchParams,
}: {
    searchParams: { collection?: string };
}) {
    const { collection } = await searchParams;
    const activeCollection = collection ?? null;

    return (
        <>
            <CollectionJsonLd activeCollection={activeCollection} />

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

                        <h1
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
                        </h1>

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

                    <CollectionsSection activeCollection={activeCollection} />
                </div>
            </section>
        </>
    );
}