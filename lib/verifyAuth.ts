
import { NextRequest } from "next/server";

export async function verifyUser(request: NextRequest): Promise<string | null> {
    try {
        const token = request.headers.get("authorization")?.split("Bearer ")[1];
        if (!token) return null;
        const { getAuth } = await import("firebase-admin/auth");
        const decoded = await getAuth().verifyIdToken(token);
        return decoded.uid;
    } catch (err) {
        console.error("Token verification failed:", err); // ← tells you exactly why
        return null;
    }
}