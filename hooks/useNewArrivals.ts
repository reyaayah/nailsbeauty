import { useState, useEffect } from "react";
import { Product } from "@/types/product";

interface UseNewArrivalsResult {
    products: Product[];
    featured: Product | null;
    rest: Product[];
    loading: boolean;
    error: string | null;
}

export function useNewArrivals(): UseNewArrivalsResult {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/products/new-arrivals")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch new arrivals");
                return res.json();
            })
            .then((data) => setProducts(data.products))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // First product goes in the hero feature block, rest go in the card strip
    const featured = products[0] ?? null;
    const rest = products.slice(1);

    return { products, featured, rest, loading, error };
}
