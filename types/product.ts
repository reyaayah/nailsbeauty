export interface Product {
    id: number;
    name: string;
    image: string;
    hoverImage?: string;
    price: number;
    originalPrice?: number;
    discount?: string;
    reviews?: number;
    rating?: number;
    category?: string;
}