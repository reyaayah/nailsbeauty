import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin, isNextResponse } from "@/lib/requireAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

function getR2Client() {
    return new S3Client({
        region: "auto",
        endpoint: process.env.NEXT_PUBLIC_R2_ENDPOINT!,
        credentials: {
            accessKeyId: process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID!,
            secretAccessKey: process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY!,
        },
    });
}

function extractKey(url: string): string | null {
    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "");
    if (!publicUrl || !url.startsWith(publicUrl)) return null;
    return url.replace(publicUrl + "/", "");
}

// GET — fetch video reviews for a product
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin(req);
    if (isNextResponse(auth)) return auth;

    const { id } = await params;
    try {
        const snap = await adminDb.collection("products").doc(id).get();
        if (!snap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

        const data = snap.data()!;
        return NextResponse.json({ videoReviews: data.videoReviews ?? [] });
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// PUT — replace all video reviews for a product
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin(req);
    if (isNextResponse(auth)) return auth;

    const { id } = await params;
    try {
        const { videoReviews, deletedKeys } = await req.json();

        // Validate shape
        if (!Array.isArray(videoReviews)) {
            return NextResponse.json({ error: "videoReviews must be an array" }, { status: 400 });
        }

        const sanitized = videoReviews.map((r: any) => ({
            id: r.id,
            user: r.user?.trim() ?? "",
            videoUrl: r.videoUrl,
            poster: r.poster ?? "",
        }));

        // Persist to Firestore
        await adminDb.collection("products").doc(id).update({
            videoReviews: sanitized,
            updatedAt: FieldValue.serverTimestamp(),
        });

        // Delete stale R2 objects (removed reviews or replaced files)
        if (Array.isArray(deletedKeys) && deletedKeys.length > 0) {
            const bucket = process.env.NEXT_PUBLIC_R2_BUCKET_NAME!;
            const r2 = getR2Client();
            await Promise.allSettled(
                deletedKeys.map((key: string) =>
                    r2.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
                )
            );
        }

        return NextResponse.json({ success: true, count: sanitized.length });
    } catch (err: any) {
        console.error("PUT /api/admin/products/[id]/video-reviews:", err);
        return NextResponse.json({ error: "Failed to save video reviews" }, { status: 500 });
    }
}

// DELETE — remove one video review by reviewId
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin(req);
    if (isNextResponse(auth)) return auth;

    const { id } = await params;
    try {
        const { reviewId } = await req.json();

        const snap = await adminDb.collection("products").doc(id).get();
        if (!snap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

        const data = snap.data()!;
        const existing: any[] = data.videoReviews ?? [];
        const target = existing.find((r) => r.id === reviewId);
        const updated = existing.filter((r) => r.id !== reviewId);

        await adminDb.collection("products").doc(id).update({
            videoReviews: updated,
            updatedAt: FieldValue.serverTimestamp(),
        });

        // Clean up R2 files for the deleted review
        if (target) {
            const bucket = process.env.NEXT_PUBLIC_R2_BUCKET_NAME!;
            const r2 = getR2Client();
            const keysToDelete = [
                extractKey(target.videoUrl),
                extractKey(target.poster),
            ].filter(Boolean) as string[];

            await Promise.allSettled(
                keysToDelete.map((key) =>
                    r2.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
                )
            );
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("DELETE /api/admin/products/[id]/video-reviews:", err);
        return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
    }
}