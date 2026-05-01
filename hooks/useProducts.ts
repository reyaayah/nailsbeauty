import { useState, useEffect } from "react";
import { Product } from "@/types/product";

interface UseProductsOptions {
    shape?: string | null;
    length?: string | null;
    style?: string | null;
}

interface UseProductsResult {
    products: Product[];
    total: number;
    loading: boolean;
    error: string | null;
}

export function useProducts(filters: UseProductsOptions = {}): UseProductsResult {
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.shape) params.set("shape", filters.shape);
        if (filters.length) params.set("length", filters.length);
        if (filters.style) params.set("style", filters.style);

        const url = `/api/products${params.size > 0 ? `?${params}` : ""}`;

        setLoading(true);
        setError(null);

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch products");
                return res.json();
            })
            .then((data) => {
                setProducts(data.products);
                setTotal(data.total);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));

    }, [filters.shape, filters.length, filters.style]);

    return { products, total, loading, error };
}