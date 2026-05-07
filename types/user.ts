/**
 * types/user.ts  (updated — adds loyalty & referral fields)
 */

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

    // ── Loyalty ─────────────────────────────────────────────────────────────
    /** Running total of all points ever earned (never decremented for display) */
    loyaltyPoints?: number;

    // ── Referral ─────────────────────────────────────────────────────────────
    /** 8-char unique code generated from uid — e.g. "AB3K7PQ2" */
    referralCode?: string;
    /** Full shareable URL — e.g. "https://yourdomain.com/auth/register?ref=AB3K7PQ2" */
    referralLink?: string;

    // ── Marketing ────────────────────────────────────────────────────────────
    marketingEmail?: boolean;
    marketingSms?: boolean;
}

export interface Address {
    id: string;
    label: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

/**
 * A single entry in users/{uid}/pointsHistory
 */
export interface PointsTransaction {
    id: string;
    uid: string;
    type: "signup_bonus" | "referral_reward" | "purchase" | "manual";
    points: number;
    description: string;
    createdAt: { seconds: number; nanoseconds: number } | string;
    orderId?: string;
}

/**
 * A document in the top-level `referrals` collection
 */
export interface ReferralRecord {
    id: string;
    referralCode: string;
    referrerUid: string;
    refereeUid: string;
    redeemedAt: { seconds: number; nanoseconds: number } | string;
    referrerPointsAwarded: number;
    refereePointsAwarded: number;
}
