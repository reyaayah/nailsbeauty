export interface Product {
    id: number;
    name: string;
    image: string;
    hoverImage?: string;
    images?: string[];
    price: number;
    originalPrice?: number;
    discount?: string;
    reviews?: number;
    rating?: number;
    category: string;
    description?: string;
    features?: string[];
    sizes?: string[];
    isNew?: boolean;
}