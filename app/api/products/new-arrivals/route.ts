import { NextResponse } from "next/server";
import { Product } from "@/types/product";

// ─── Dummy data ───────────────────────────────────────────────────────────────
// Swap this out for Firestore in the future:
//
//   import { db } from "@/lib/firebase/FirebaseConfig";
//   import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
//
//   const snap = await getDocs(
//     query(collection(db, "products"), where("isNew", "==", true), orderBy("createdAt", "desc"), limit(4))
//   );
//   const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
//
// ─────────────────────────────────────────────────────────────────────────────

const newArrivals: Product[] = [
    {
        id: 1,
        name: "Midnight Silk",
        image: "/product1.png",
        hoverImage: "/backimg1.png",
        price: 64.00,
        discount: "NEW ARRIVAL",
        reviews: 124,
        rating: 5,
        category: "Press-on Nails",
        isNew: true,
        isBestSeller: true,
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
        discount: "NEW ARRIVAL",
        reviews: 89,
        rating: 5,
        category: "Press-on Nails",
        isNew: true,
        shape: "Square",
        length: "Short",
        style: "Metallic",
        collection: "The Love Edit",
    },
    {
        id: 3,
        name: "Obsidian Glaze",
        image: "/product3.png",
        hoverImage: "/backimg3.png",
        price: 58.00,
        originalPrice: 65.00,
        discount: "NEW ARRIVAL",
        reviews: 156,
        rating: 5,
        category: "Press-on Nails",
        isNew: true,
        shape: "Almond",
        length: "Medium",
        style: "Glossy",
        collection: "Summer '24",
    },
    {
        id: 4,
        name: "Frosted Peony",
        image: "/product2.png",
        hoverImage: "/backimg2.png",
        price: 52.00,
        discount: "NEW ARRIVAL",
        reviews: 210,
        rating: 5,
        category: "Press-on Nails",
        isNew: true,
        shape: "Coffin",
        length: "Long",
        style: "Matte",
        collection: "G & G Essence",
    },
];

export async function GET() {
    return NextResponse.json({
        products: newArrivals,
        total: newArrivals.length,
    });
}