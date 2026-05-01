import { NextResponse } from "next/server";
import { Product } from "@/types/product";

// ─── Dummy data ───────────────────────────────────────────────────────────────
// Swap this out for Firestore in the future:
//
//   import { db } from "@/lib/firebase/FirebaseConfig";
//   import { collection, getDocs, query, where } from "firebase/firestore";
//
//   const snap = await getDocs(query(collection(db, "products"), where("isBestSeller", "==", true)));
//   const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
//
// ─────────────────────────────────────────────────────────────────────────────

const bestSellers: Product[] = [
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
        isBestSeller: true,
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
        discount: "BEST SELLER",
        reviews: 45,
        rating: 5,
        category: "Press-on Nails",
        isBestSeller: true,
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
        isBestSeller: true,
        shape: "Almond",
        length: "Medium",
        style: "Glossy",
        collection: "Summer '24",
    },
];

export async function GET() {
    return NextResponse.json({
        products: bestSellers,
        total: bestSellers.length,
    });
}