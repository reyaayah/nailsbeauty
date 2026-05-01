export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    phoneNumber?: string | null;
    createdAt: string;
    updatedAt: string;
    provider: "email" | "google";
    wishlist?: number[];
    addresses?: Address[];
    orderHistory?: string[];
}

export interface Address {
    id: string;
    label: string; // e.g. "Home", "Work"
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}
