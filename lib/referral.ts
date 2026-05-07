/**
 * referral.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Referral code generation & validation helpers.
 * Works fully client-side (browser) and server-side (Next.js API routes).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
    doc, getDoc, setDoc, updateDoc, collection,
    query, where, getDocs, serverTimestamp, increment, runTransaction,
} from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";

// ── Constants ──────────────────────────────────────────────────────────────────

export const POINTS_CONFIG = {
    /** Points earned on account creation */
    SIGNUP_BONUS: 100,
    /** Points given to the referrer when their invite is redeemed */
    REFERRER_REWARD: 200,
    /** Points given to the new user who redeemed a referral */
    REFEREE_REWARD: 150,
    /** Points earned per dollar spent (applied at checkout) */
    POINTS_PER_DOLLAR: 10,
    /** Threshold where a free reward coupon is unlocked */
    REWARD_THRESHOLD: 600,
    /** Dollar value of the free reward coupon */
    REWARD_VALUE: 5,
} as const;

export const LEVEL_CONFIG = [
    { level: 1, label: "Bronze", min: 0,    max: 499  },
    { level: 2, label: "Silver", min: 500,  max: 999  },
    { level: 3, label: "Gold",   min: 1000, max: Infinity },
] as const;

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ReferralRecord {
    referralCode: string;
    referrerUid: string;
    refereeUid: string;
    redeemedAt: ReturnType<typeof serverTimestamp>;
    referrerPointsAwarded: number;
    refereePointsAwarded: number;
}

export interface PointsTransaction {
    uid: string;
    type: "signup_bonus" | "referral_reward" | "purchase" | "manual";
    points: number;
    description: string;
    createdAt: ReturnType<typeof serverTimestamp>;
    orderId?: string;
}

// ── Code generation ────────────────────────────────────────────────────────────

/**
 * Generates a deterministic, URL-safe 8-character referral code from a uid.
 * Uses a simple djb2 hash so the same uid always yields the same code.
 */
export function generateReferralCode(uid: string): string {
    const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusable chars
    let hash = 5381;
    for (let i = 0; i < uid.length; i++) {
        hash = ((hash << 5) + hash) ^ uid.charCodeAt(i);
        hash = hash >>> 0; // keep as unsigned 32-bit
    }
    let code = "";
    for (let i = 0; i < 8; i++) {
        code += CHARS[hash % CHARS.length];
        hash = Math.floor(hash / CHARS.length) + uid.charCodeAt(i % uid.length);
        hash = hash >>> 0;
    }
    return code;
}

/**
 * Generates the full shareable referral link from a code.
 */
export function buildReferralLink(code: string, baseUrl = ""): string {
    const base = baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
    return `${base}/auth/register?ref=${code}`;
}

// ── Firestore: setup referral data for a new user ─────────────────────────────

/**
 * Call this right after creating a new user document.
 * Writes referralCode + referralLink fields and awards the signup bonus.
 */
export async function initReferralForUser(uid: string): Promise<void> {
    const db = getClientDb();
    const code = generateReferralCode(uid);
    const link = buildReferralLink(code);

    await updateDoc(doc(db, "users", uid), {
        referralCode: code,
        referralLink: link,
        loyaltyPoints: POINTS_CONFIG.SIGNUP_BONUS,
        updatedAt: serverTimestamp(),
    });

    await addPointsTransaction(uid, {
        type: "signup_bonus",
        points: POINTS_CONFIG.SIGNUP_BONUS,
        description: "Welcome bonus for creating an account",
    });
}

// ── Firestore: redeem a referral code ─────────────────────────────────────────

export type RedeemResult =
    | { success: true }
    | { success: false; error: string };

/**
 * Redeems a referral code for a newly registered user.
 * Uses a Firestore transaction to guarantee atomicity.
 *
 * @param refereeUid  UID of the newly registered user
 * @param code        Referral code entered / passed via URL
 */
export async function redeemReferralCode(
    refereeUid: string,
    code: string
): Promise<RedeemResult> {
    const db = getClientDb();

    // 1. Find the referrer by code
    const q = query(collection(db, "users"), where("referralCode", "==", code.toUpperCase().trim()));
    const snap = await getDocs(q);

    if (snap.empty) return { success: false, error: "Invalid referral code." };

    const referrerDoc = snap.docs[0];
    const referrerUid = referrerDoc.id;

    if (referrerUid === refereeUid) {
        return { success: false, error: "You cannot use your own referral code." };
    }

    // 2. Check code hasn't been used by this referee already
    const existingQ = query(
        collection(db, "referrals"),
        where("refereeUid", "==", refereeUid)
    );
    const existingSnap = await getDocs(existingQ);
    if (!existingSnap.empty) {
        return { success: false, error: "You have already used a referral code." };
    }

    // 3. Atomically award both parties and record the referral
    await runTransaction(db, async (tx) => {
        // Award referrer
        tx.update(doc(db, "users", referrerUid), {
            loyaltyPoints: increment(POINTS_CONFIG.REFERRER_REWARD),
            updatedAt: serverTimestamp(),
        });
        // Award referee
        tx.update(doc(db, "users", refereeUid), {
            loyaltyPoints: increment(POINTS_CONFIG.REFEREE_REWARD),
            updatedAt: serverTimestamp(),
        });
        // Record referral document
        const refRef = doc(collection(db, "referrals"));
        tx.set(refRef, {
            referralCode: code.toUpperCase().trim(),
            referrerUid,
            refereeUid,
            redeemedAt: serverTimestamp(),
            referrerPointsAwarded: POINTS_CONFIG.REFERRER_REWARD,
            refereePointsAwarded: POINTS_CONFIG.REFEREE_REWARD,
        } satisfies ReferralRecord);
    });

    // 4. Log transactions (outside the main tx — non-critical)
    await Promise.allSettled([
        addPointsTransaction(referrerUid, {
            type: "referral_reward",
            points: POINTS_CONFIG.REFERRER_REWARD,
            description: `Friend redeemed your referral code`,
        }),
        addPointsTransaction(refereeUid, {
            type: "referral_reward",
            points: POINTS_CONFIG.REFEREE_REWARD,
            description: `Referral bonus for joining via a friend`,
        }),
    ]);

    return { success: true };
}

// ── Firestore: award purchase points ─────────────────────────────────────────

/**
 * Called from your order completion webhook / checkout handler.
 * Awards POINTS_PER_DOLLAR × orderTotal points.
 */
export async function awardPurchasePoints(
    uid: string,
    orderTotal: number,
    orderId: string
): Promise<number> {
    const db = getClientDb();
    const points = Math.floor(orderTotal * POINTS_CONFIG.POINTS_PER_DOLLAR);
    if (points <= 0) return 0;

    await updateDoc(doc(db, "users", uid), {
        loyaltyPoints: increment(points),
        updatedAt: serverTimestamp(),
    });

    await addPointsTransaction(uid, {
        type: "purchase",
        points,
        description: `Points for order #${orderId}`,
        orderId,
    });

    return points;
}

// ── Firestore: points transaction log ─────────────────────────────────────────

export async function addPointsTransaction(
    uid: string,
    data: Omit<PointsTransaction, "uid" | "createdAt">
): Promise<void> {
    const db = getClientDb();
    await setDoc(doc(collection(db, "users", uid, "pointsHistory")), {
        uid,
        ...data,
        createdAt: serverTimestamp(),
    });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getLevelInfo(points: number) {
    return (
        LEVEL_CONFIG.find((l) => points >= l.min && points <= l.max) ?? LEVEL_CONFIG[0]
    );
}

export function getProgressToNextReward(points: number) {
    const earned = points % POINTS_CONFIG.REWARD_THRESHOLD;
    const progress = (earned / POINTS_CONFIG.REWARD_THRESHOLD) * 100;
    const remaining = POINTS_CONFIG.REWARD_THRESHOLD - earned;
    const couponsEarned = Math.floor(points / POINTS_CONFIG.REWARD_THRESHOLD);
    return { earned, progress, remaining, couponsEarned };
}
