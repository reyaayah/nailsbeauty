// lib/verifyAuth.ts
import { NextRequest } from "next/server";
import { adminAuth as auth } from "@/lib/firebase/admin"; // import the initialized instance

export async function verifyUser(request: NextRequest): Promise<string | null> {
    try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) return null;

        const token = authHeader.split("Bearer ")[1];
        if (!token) return null;

        const decoded = await auth.verifyIdToken(token);
        return decoded.uid;
    } catch (err) {
        console.error("[verifyUser] Token verification failed:", err);
        return null;
    }
}