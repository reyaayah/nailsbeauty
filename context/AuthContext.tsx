"use client";

/**
 * AuthContext.tsx  (updated)
 * ──────────────────────────────────────────────────────────────────────────
 * Changes from original:
 *  • register() now accepts an optional referralCode param
 *  • After creating a user doc, calls initReferralForUser() to assign code
 *  • If a referralCode is present, calls redeemReferralCode() automatically
 * ──────────────────────────────────────────────────────────────────────────
 */

import {
    createContext, useContext, useEffect, useState, ReactNode,
} from "react";
import {
    User, onAuthStateChanged, createUserWithEmailAndPassword,
    signInWithEmailAndPassword, signInWithPopup, signOut,
    sendPasswordResetEmail, updateProfile, GoogleAuthProvider, AuthError,
} from "firebase/auth";
import {
    doc, setDoc, getDoc, query, collection, where, getDocs, serverTimestamp,
} from "firebase/firestore";
import { getClientAuth, getClientDb } from "@/lib/firebase/client";
import { UserProfile } from "@/types/user";
import {
    initReferralForUser, redeemReferralCode,
} from "@/lib/referral";          // ← new import

/* ─── Shape ──────────────────────────────────────────────────────────────── */
interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    /** Pass referralCode if present in the URL (?ref=XXXXXXXX) */
    register: (email: string, password: string, displayName: string, referralCode?: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: (referralCode?: string) => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    authError: string | null;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

/* ─── Error messages ─────────────────────────────────────────────────────── */
function parseFirebaseError(error: AuthError): string {
    const map: Record<string, string> = {
        "auth/email-already-in-use": "An account with this email already exists.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/invalid-credential": "Invalid email or password.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/popup-closed-by-user": "Sign-in popup was closed before completing.",
        "auth/network-request-failed": "Network error. Check your connection.",
        "auth/account-exists-with-different-credential":
            "An account already exists with this email using a different sign-in method.",
    };
    return map[error.code] ?? "Something went wrong. Please try again.";
}

/* ─── Retry helper ───────────────────────────────────────────────────────── */
async function withRetry<T>(fn: () => Promise<T>, retries = 4, delayMs = 300): Promise<T> {
    try { return await fn(); }
    catch (err: any) {
        const isOffline =
            err?.code === "unavailable" ||
            err?.message?.toLowerCase().includes("client is offline");
        if (retries > 0 && isOffline) {
            await new Promise((r) => setTimeout(r, delayMs));
            return withRetry(fn, retries - 1, delayMs * 2);
        }
        throw err;
    }
}

/* ─── Firestore helpers ──────────────────────────────────────────────────── */
async function createUserDocument(user: User, provider: "email" | "google") {
    const db = getClientDb();
    const ref = doc(db, "users", user.uid);
    const snap = await withRetry(() => getDoc(ref));
    if (!snap.exists()) {
        await withRetry(() =>
            setDoc(ref, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                phoneNumber: user.phoneNumber ?? null,
                provider,
                wishlist: [],
                addresses: [],
                orderHistory: [],
                loyaltyPoints: 0,         // will be set by initReferralForUser
                referralCode: "",         // will be set by initReferralForUser
                referralLink: "",         // will be set by initReferralForUser
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })
        );
    }
}

async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
    const db = getClientDb();
    const snap = await withRetry(() => getDoc(doc(db, "users", uid)));
    return snap.exists() ? (snap.data() as UserProfile) : null;
}

async function getProviderForEmail(email: string): Promise<"email" | "google" | null> {
    try {
        const db = getClientDb();
        const q = query(collection(db, "users"), where("email", "==", email));
        const snap = await getDocs(q);
        if (snap.empty) return null;
        return (snap.docs[0].data() as UserProfile).provider ?? null;
    } catch { return null; }
}

/* ─── Provider ───────────────────────────────────────────────────────────── */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);
    const clearError = () => setAuthError(null);

    useEffect(() => {
        const auth = getClientAuth();
        return onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                const profile = await fetchUserProfile(firebaseUser.uid);
                setUserProfile(profile);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });
    }, []);

    /* ── Register ──────────────────────────────────────────────────────── */
    const register = async (
        email: string,
        password: string,
        displayName: string,
        referralCode?: string
    ) => {
        try {
            clearError();
            const existingProvider = await getProviderForEmail(email);
            if (existingProvider === "google") {
                setAuthError("This email is already registered via Google. Please sign in with Google instead.");
                throw new Error("provider-conflict");
            }

            const auth = getClientAuth();
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(cred.user, { displayName });
            await createUserDocument(cred.user, "email");

            // ── NEW: init referral code + signup bonus ──────────────────
            await initReferralForUser(cred.user.uid);

            // ── NEW: redeem referral if code was passed ─────────────────
            if (referralCode?.trim()) {
                const result = await redeemReferralCode(cred.user.uid, referralCode);
                if (!result.success) {
                    // non-critical — just silently log; don't block the sign-up
                    console.warn("[referral]", result.error);
                }
            }

            const profile = await fetchUserProfile(cred.user.uid);
            setUserProfile(profile);
        } catch (err) {
            if ((err as Error).message !== "provider-conflict") {
                setAuthError(parseFirebaseError(err as AuthError));
            }
            throw err;
        }
    };

    /* ── Login with email + password ───────────────────────────────────── */
    const login = async (email: string, password: string) => {
        try {
            clearError();
            const auth = getClientAuth();
            const cred = await signInWithEmailAndPassword(auth, email, password);
            setUserProfile(await fetchUserProfile(cred.user.uid));
        } catch (err) {
            const error = err as AuthError;
            if (
                error.code === "auth/invalid-credential" ||
                error.code === "auth/wrong-password" ||
                error.code === "auth/user-not-found"
            ) {
                const existingProvider = await getProviderForEmail(email);
                if (existingProvider === "google") {
                    setAuthError("This email is registered via Google. Please sign in with Google instead.");
                    throw err;
                }
            }
            setAuthError(parseFirebaseError(error));
            throw err;
        }
    };

    /* ── Login with Google ─────────────────────────────────────────────── */
    const loginWithGoogle = async (referralCode?: string) => {
        try {
            clearError();
            const auth = getClientAuth();
            const cred = await signInWithPopup(auth, googleProvider);
            const existingProvider = await getProviderForEmail(cred.user.email ?? "");
            if (existingProvider === "email") {
                await signOut(auth);
                setAuthError("This email is already registered with a password. Please sign in with email instead.");
                throw new Error("provider-conflict");
            }

            // isNewUser flag: only do onboarding steps for first-time sign-in
            const isNewUser = !existingProvider;
            await createUserDocument(cred.user, "google");

            if (isNewUser) {
                await initReferralForUser(cred.user.uid);
                if (referralCode?.trim()) {
                    const result = await redeemReferralCode(cred.user.uid, referralCode);
                    if (!result.success) console.warn("[referral]", result.error);
                }
            }

            setUserProfile(await fetchUserProfile(cred.user.uid));
        } catch (err) {
            if ((err as Error).message !== "provider-conflict") {
                setAuthError(parseFirebaseError(err as AuthError));
            }
            throw err;
        }
    };

    /* ── Logout ────────────────────────────────────────────────────────── */
    const logout = async () => {
        await signOut(getClientAuth());
        setUserProfile(null);
    };

    /* ── Forgot password ───────────────────────────────────────────────── */
    const forgotPassword = async (email: string) => {
        try {
            clearError();
            const existingProvider = await getProviderForEmail(email);
            if (existingProvider === null) {
                setAuthError("No account found with this email address.");
                throw new Error("provider-conflict");
            }
            if (existingProvider === "google") {
                setAuthError("This email uses Google sign-in and doesn't have a password to reset.");
                throw new Error("provider-conflict");
            }
            await sendPasswordResetEmail(getClientAuth(), email);
        } catch (err) {
            if ((err as Error).message !== "provider-conflict") {
                setAuthError(parseFirebaseError(err as AuthError));
            }
            throw err;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user, userProfile, loading,
                register, login, loginWithGoogle,
                logout, forgotPassword, authError, clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
