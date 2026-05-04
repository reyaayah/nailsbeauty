import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/types/product";

// ─── Dummy data ───────────────────────────────────────────────────────────────
// Swap this out for Firestore in the future:
//
//   import { db } from "@/lib/firebase/FirebaseConfig";
//   import { collection, getDocs, query, where } from "firebase/firestore";
//
//   const snap = await getDocs(collection(db, "products"));
//   const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
//
// ─────────────────────────────────────────────────────────────────────────────

const products: Product[] = [
    {
        id: 1,
        name: "Midnight Silk",
        image: "/product1.png",
        hoverImage: "/backimg1.png",
        price: 64.00,
        discount: "BEST SELLER",
        reviews: 124,
        rating: 5,
        category: "Press-on Nails",
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
        price: 48.00,
        originalPrice: 55.00,
        discount: "LIMITED RUN",
        reviews: 89,
        rating: 5,
        category: "Press-on Nails",
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
        price: 52.00,
        reviews: 210,
        rating: 5,
        category: "Press-on Nails",
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
        price: 49.00,
        discount: "NEW ARRIVAL",
        reviews: 45,
        rating: 5,
        category: "Press-on Nails",
        isNew: false,
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
        price: 58.00,
        originalPrice: 65.00,
        reviews: 156,
        rating: 5,
        category: "Press-on Nails",
        isNew: true,
        shape: "Almond",
        length: "Medium",
        style: "Glossy",
        collection: "Summer '24",
    },
];

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const shape = searchParams.get("shape");
    const length = searchParams.get("length");
    const style = searchParams.get("style");

    const filtered = products.filter((p) => {
        if (!shape && !length && !style) return true;
        return (
            (!shape || p.shape?.toLowerCase() === shape.toLowerCase()) &&
            (!length || p.length?.toLowerCase() === length.toLowerCase()) &&
            (!style || p.style?.toLowerCase() === style.toLowerCase())
        );
    });

    return NextResponse.json({
        products: filtered,
        total: filtered.length,
    });
}
