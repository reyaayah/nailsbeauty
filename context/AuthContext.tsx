"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import {
    User,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    AuthError,
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc,
    query,
    collection,
    where,
    getDocs,
    serverTimestamp,
} from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase/FirebaseConfig";
import { UserProfile } from "@/types/user";

/* ─── Shape ──────────────────────────────────────────────── */
interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    register: (email: string, password: string, displayName: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    authError: string | null;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ─── Error messages ─────────────────────────────────────── */
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
        "auth/account-exists-with-different-credential": "An account already exists with this email using a different sign-in method.",
    };
    return map[error.code] ?? "Something went wrong. Please try again.";
}

/* ─── Retry helper ───────────────────────────────────────── */
async function withRetry<T>(
    fn: () => Promise<T>,
    retries = 4,
    delayMs = 300
): Promise<T> {
    try {
        return await fn();
    } catch (err: any) {
        const isOffline =
            err?.code === "unavailable" ||
            err?.message?.toLowerCase().includes("client is offline");
        if (retries > 0 && isOffline) {
            await new Promise((res) => setTimeout(res, delayMs));
            return withRetry(fn, retries - 1, delayMs * 2);
        }
        throw err;
    }
}

/* ─── Firestore helpers ──────────────────────────────────── */
async function createUserDocument(user: User, provider: "email" | "google") {
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
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })
        );
    }
}

async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
    const snap = await withRetry(() => getDoc(doc(db, "users", uid)));
    return snap.exists() ? (snap.data() as UserProfile) : null;
}

// Look up which provider an email is registered with via our Firestore users collection.
// This avoids the deprecated fetchSignInMethodsForEmail Firebase SDK method.
async function getProviderForEmail(email: string): Promise<"email" | "google" | null> {
    try {
        const q = query(collection(db, "users"), where("email", "==", email));
        const snap = await getDocs(q);
        if (snap.empty) return null;
        return (snap.docs[0].data() as UserProfile).provider ?? null;
    } catch {
        return null;
    }
}

/* ─── Provider ───────────────────────────────────────────── */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    const clearError = () => setAuthError(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                const profile = await fetchUserProfile(firebaseUser.uid);
                setUserProfile(profile);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });
        return unsub;
    }, []);

    /* Register */
    const register = async (email: string, password: string, displayName: string) => {
        try {
            clearError();
            const existingProvider = await getProviderForEmail(email);
            if (existingProvider === "google") {
                setAuthError("This email is already registered via Google. Please sign in with Google instead.");
                throw new Error("provider-conflict");
            }
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(cred.user, { displayName });
            await createUserDocument(cred.user, "email");
            const profile = await fetchUserProfile(cred.user.uid);
            setUserProfile(profile);
        } catch (err) {
            if ((err as Error).message !== "provider-conflict") {
                setAuthError(parseFirebaseError(err as AuthError));
            }
            throw err;
        }
    };

    /* Login with email + password */
    const login = async (email: string, password: string) => {
        try {
            clearError();
            const cred = await signInWithEmailAndPassword(auth, email, password);
            const profile = await fetchUserProfile(cred.user.uid);
            setUserProfile(profile);
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

    /* Login with Google */
    const loginWithGoogle = async () => {
        try {
            clearError();
            const cred = await signInWithPopup(auth, googleProvider);
            const existingProvider = await getProviderForEmail(cred.user.email ?? "");
            if (existingProvider === "email") {
                await signOut(auth);
                setAuthError("This email is already registered with a password. Please sign in with your email and password instead.");
                throw new Error("provider-conflict");
            }
            await createUserDocument(cred.user, "google");
            const profile = await fetchUserProfile(cred.user.uid);
            setUserProfile(profile);
        } catch (err) {
            if ((err as Error).message !== "provider-conflict") {
                setAuthError(parseFirebaseError(err as AuthError));
            }
            throw err;
        }
    };

    /* Logout */
    const logout = async () => {
        await signOut(auth);
        setUserProfile(null);
    };

    /* Forgot password */
    const forgotPassword = async (email: string) => {
        try {
            clearError();
            const existingProvider = await getProviderForEmail(email);

            // No account found at all
            if (existingProvider === null) {
                setAuthError("No account found with this email address.");
                throw new Error("provider-conflict");
            }

            // Account exists but uses Google — no password to reset
            if (existingProvider === "google") {
                setAuthError("This email uses Google sign-in and doesn't have a password to reset.");
                throw new Error("provider-conflict");
            }

            await sendPasswordResetEmail(auth, email);
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
                user,
                userProfile,
                loading,
                register,
                login,
                loginWithGoogle,
                logout,
                forgotPassword,
                authError,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

/* ─── Hook ───────────────────────────────────────────────── */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}