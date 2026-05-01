import { useState, useEffect } from "react";
import { Product } from "@/types/product";

interface UseBestSellersResult {
    products: Product[];
    total: number;
    loading: boolean;
    error: string | null;
}

export function useBestSellers(): UseBestSellersResult {
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/products/best-sellers")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch best sellers");
                return res.json();
            })
            .then((data) => {
                setProducts(data.products);
                setTotal(data.total);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { products, total, loading, error };
}
