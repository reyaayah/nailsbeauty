import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isNextResponse } from "@/lib/requireAdmin";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

function getR2Client() {
    const endpoint = process.env.NEXT_PUBLIC_R2_ENDPOINT;
    const accessKeyId = process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY;

    if (!endpoint || !accessKeyId || !secretAccessKey) {
        throw new Error("R2 credentials missing");
    }

    return new S3Client({
        region: "auto",
        endpoint,
        credentials: { accessKeyId, secretAccessKey },
    });
}

const ALLOWED_VIDEO_TYPES: Record<string, string> = {
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
    "video/x-msvideo": "avi",
};

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
};

const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200 MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;  // 10 MB

export async function POST(req: NextRequest) {
    const auth = await requireAdmin(req);
    if (isNextResponse(auth)) return auth;

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const type = (formData.get("type") as string) || "video"; // "video" | "poster"

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bucket = process.env.NEXT_PUBLIC_R2_BUCKET_NAME;
        const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "");

        if (!bucket || !publicUrl) {
            throw new Error("R2 bucket config missing");
        }

        let ext: string | undefined;
        let folder: string;
        let maxSize: number;

        if (type === "video") {
            ext = ALLOWED_VIDEO_TYPES[file.type];
            folder = "video-reviews/videos";
            maxSize = MAX_VIDEO_SIZE;
        } else {
            ext = ALLOWED_IMAGE_TYPES[file.type];
            folder = "video-reviews/posters";
            maxSize = MAX_IMAGE_SIZE;
        }

        if (!ext) {
            return NextResponse.json(
                { error: `Invalid file type for ${type}.` },
                { status: 400 }
            );
        }

        if (file.size > maxSize) {
            return NextResponse.json(
                { error: `File too large. Maximum: ${maxSize / 1024 / 1024} MB` },
                { status: 400 }
            );
        }

        const date = new Date();
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const key = `${folder}/${year}/${month}/${uuidv4()}.${ext}`;

        const buffer = Buffer.from(await file.arrayBuffer());

        const r2 = getR2Client();
        await r2.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: buffer,
                ContentType: file.type,
                ContentLength: file.size,
            })
        );

        const url = `${publicUrl}/${key}`;
        return NextResponse.json({ url, key }, { status: 201 });
    } catch (err: any) {
        console.error("POST /api/admin/upload-video:", err);
        return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
    }
}

// DELETE — clean up an R2 object by key
export async function DELETE(req: NextRequest) {
    const auth = await requireAdmin(req);
    if (isNextResponse(auth)) return auth;

    try {
        const { key } = await req.json();
        if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

        const bucket = process.env.NEXT_PUBLIC_R2_BUCKET_NAME;
        if (!bucket) throw new Error("R2 bucket config missing");

        const r2 = getR2Client();
        await r2.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("DELETE /api/admin/upload-video:", err);
        return NextResponse.json({ error: err.message || "Delete failed" }, { status: 500 });
    }
}