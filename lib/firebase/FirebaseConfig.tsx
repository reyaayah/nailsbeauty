const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

let app: any;
let auth: any;
let db: any;
let googleProvider: any;

export async function initializeFirebase() {
    if (typeof window === "undefined") return;

    if (app) return;

    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const { getAuth, GoogleAuthProvider } = await import("firebase/auth");
    const { getFirestore } = await import("firebase/firestore");

    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });
}

export function getAuthInstance() {
    if (!auth) throw new Error("Call initializeFirebase() first");
    return auth;
}

export function getDbInstance() {
    if (!db) throw new Error("Call initializeFirebase() first");
    return db;
}

export function getGoogleProvider() {
    if (!googleProvider) throw new Error("Call initializeFirebase() first");
    return googleProvider;
}