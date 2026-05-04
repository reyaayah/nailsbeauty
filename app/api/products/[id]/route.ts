import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/types/product";

// ─── Dummy data (shared source of truth) ─────────────────────────────────────
// Swap this out for Firestore in the future:
//
//   import { db } from "@/lib/firebase/FirebaseConfig";
//   import { doc, getDoc } from "firebase/firestore";
//
//   const snap = await getDoc(doc(db, "products", id));
//   if (!snap.exists()) return NextResponse.json({ error: "Not found" }, { status: 404 });
//   const product = { id: snap.id, ...snap.data() } as Product;
//
// ─────────────────────────────────────────────────────────────────────────────

const products: Product[] = [
    {
        id: 1,
        name: "Midnight Silk",
        image: "/product1.png",
        hoverImage: "/backimg1.png",
        images: ["/product1.png", "/backimg1.png", "/product2.png", "/product3.png"],
        price: 64.00,
        discount: "BEST SELLER",
        reviews: 124,
        rating: 5,
        category: "Press-on Nails",
        description:
            "Draped in deep obsidian with a liquid-silk finish, Midnight Silk is our most-coveted set. Each nail is cast in a high-gloss lacquer that mimics the sheen of poured ink — light catches it at every angle. Hand-finished in our signature almond silhouette, this medium-length set is the one our customers re-order most. Wear it to a dinner, a meeting, or nowhere at all.",
        features: [
            "28 nails across 14 sizes for a perfect fit",
            "Triple-coat glossy finish — chip-resistant formula",
            "Includes salon-grade nail glue + 2 sets of adhesive tabs",
            "Lasts up to 3 weeks with glue application",
            "Removable in minutes with warm water — fully reusable",
            "Vegan, cruelty-free & non-toxic formula",
            "Handcrafted — minor variations are part of the beauty",
        ],
        sizes: ["XXS", "XS", "S", "M", "L", "XL"],
        isNew: true,
        isBestSeller: true,
        onSale: true,
        shape: "Almond",
        length: "Medium",
        style: "Glossy",
        collection: "LNY Limited",
    },
    {
        id: 2,
        name: "Vintage Rose Gold",
        image: "/product2.png",
        hoverImage: "/backimg2.png",
        images: ["/product2.png", "/backimg2.png", "/product3.png", "/product1.png"],
        price: 48.00,
        originalPrice: 55.00,
        discount: "LIMITED RUN",
        reviews: 89,
        rating: 5,
        category: "Press-on Nails",
        description:
            "Warm metallic blush meets art-deco precision in Vintage Rose Gold. The square silhouette is clean and deliberate — a short length that keeps things modern rather than maximalist. Each nail is finished with a micro-foil layer that shifts from dusty pink to burnished gold in direct light. Part of our Love Edit collection, this set was designed for the romantic who doesn't do clichés.",
        features: [
            "24 nails across 12 sizes",
            "Micro-foil metallic finish — shifts tone in different lighting",
            "Includes nail glue & single-use adhesive tabs",
            "Lasts up to 2 weeks with adhesive tabs, 3 weeks with glue",
            "Square edge pre-filed — ready to apply straight from the box",
            "Vegan & cruelty-free",
            "Limited run — once sold out, retired from production",
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        isNew: true,
        isBestSeller: true,
        shape: "Square",
        length: "Short",
        style: "Metallic",
        collection: "The Love Edit",
    },
    {
        id: 3,
        name: "Frosted Peony",
        image: "/product3.png",
        hoverImage: "/backimg3.png",
        images: ["/product3.png", "/backimg3.png", "/product1.png", "/product2.png"],
        price: 52.00,
        reviews: 210,
        rating: 5,
        category: "Press-on Nails",
        description:
            "Frosted Peony is the set people reach for when they want something beautiful but unbothered. A soft peony blush at the base melts into a near-white frost at the tip — the effect is barely-there and completely arresting at the same time. The coffin silhouette is long and dramatic, but the matte finish keeps it from ever feeling loud. Our top-rated set for over eight months running.",
        features: [
            "28 nails across 14 sizes — extended fit range",
            "Dual-tone matte finish — blush-to-frost gradient, hand-applied",
            "Includes professional nail glue + 2 sets of adhesive tabs",
            "Matte top coat re-application recommended at week 2 to refresh look",
            "Lasts up to 3 weeks with glue; reusable up to 3 times",
            "Coffin tips pre-shaped — no filing required",
            "Vegan, cruelty-free & dermatologist tested",
        ],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        isNew: false,
        onSale: true,
        shape: "Coffin",
        length: "Long",
        style: "Matte",
        collection: "G & G Essence",
    },
    {
        id: 4,
        name: "Champagne Toast",
        image: "/product1.png",
        hoverImage: "/backimg1.png",
        images: ["/product1.png", "/backimg1.png", "/product3.png", "/product2.png"],
        price: 49.00,
        discount: "NEW ARRIVAL",
        reviews: 45,
        rating: 5,
        category: "Press-on Nails",
        description:
            "Designed for golden-hour moments and everything in between. Champagne Toast opens with a sheer champagne base and builds into a dense, multidimensional glitter at the tip — the kind that catches every camera flash and candle flicker. Set in an oval silhouette that works on every hand shape, this medium-length set is our newest arrival and already making its way into everyone's rotation.",
        features: [
            "24 nails across 12 sizes",
            "4-layer glitter gradient — sheer base, dense tip",
            "Includes nail glue & adhesive tabs",
            "Oval shape naturally flatters all finger lengths",
            "Lasts up to 2 weeks; glitter finish stays vibrant throughout",
            "Easy soak-off removal — no damage to natural nails",
            "Vegan & cruelty-free",
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        isNew: true,
        shape: "Oval",
        length: "Medium",
        style: "Glitter",
        collection: "Summer '24",
    },
    {
        id: 5,
        name: "Obsidian Glaze",
        image: "/product2.png",
        hoverImage: "/backimg2.png",
        images: ["/product2.png", "/backimg2.png", "/product1.png", "/product3.png"],
        price: 58.00,
        originalPrice: 65.00,
        reviews: 156,
        rating: 5,
        category: "Press-on Nails",
        description:
            "Obsidian Glaze plays tricks with colour. In shade, they read as pure black. Step into sunlight and a deep, iridescent violet bleeds through the gloss — unexpected every single time. The almond shape is polished and elongating at medium length. This is the set for people who find all-black too expected and all-colour too much. A quiet statement, loudly made.",
        features: [
            "28 nails across 14 sizes",
            "Photochromic gloss finish — colour shifts black to violet in UV light",
            "Includes premium nail glue + 2 sets of adhesive tabs",
            "Lasts up to 3 weeks — gloss finish self-sealing",
            "Reusable up to 4 times with gentle removal",
            "Almond tips pre-buffed for instant adhesion",
            "Vegan, cruelty-free & 10-free formula",
        ],
        sizes: ["XXS", "XS", "S", "M", "L", "XL"],
        isNew: true,
        shape: "Almond",
        length: "Medium",
        style: "Glossy",
        collection: "Summer '24",
    },
];

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = products.find((p) => p.id === id);

    if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Related products: same shape or same collection, excluding self
    const related = products
        .filter(
            (p) =>
                p.id !== id &&
                (p.shape === product.shape || p.collection === product.collection)
        )
        .slice(0, 4);

    return NextResponse.json({ product, related });
}