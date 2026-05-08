// components/CollectionsSection.tsx
import { db } from "@/lib/firebaseAdmin";
import { CollectionsCarousel } from "./CollectionCarousel";

export interface CollectionItem {
    id: string;
    name: string;
    slug: string;
    image: string;
    description?: string;
    isActive: boolean;
    sortOrder: number;
    bg: string;
    filter: string;
}

const BG_CYCLE = ["#F2DED3", "#EDD9E9", "#D9E9E0", "#F5EAD0", "#E3E3F4", "#F4EDE3"];

interface Props {
    activeCollection?: string | null;
}

export async function CollectionsSection({ activeCollection }: Props) {
    let collections: CollectionItem[] = [];

    try {
        const snapshot = await db.collection("collections").get();

        collections = snapshot.docs
            .map((doc, i) => {
                const d = doc.data();
                return {
                    id: doc.id,
                    name: d.name,
                    slug: d.slug,
                    image: d.image,
                    description: d.description ?? "",
                    isActive: d.isActive,
                    sortOrder: d.sortOrder,
                    bg: BG_CYCLE[i % BG_CYCLE.length],
                    filter: d.name, // products link via name field
                };
            })
            .filter((c) => c.isActive)
            .sort((a, b) => a.sortOrder - b.sortOrder);
    } catch (err) {
        console.error("Failed to fetch collections:", err);
    }

    return (
        <CollectionsCarousel
            collections={collections}
            activeCollection={activeCollection}
        />
    );
}