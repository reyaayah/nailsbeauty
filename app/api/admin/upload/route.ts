import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isNextResponse } from "@/lib/requireAdmin";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// Reads credentials injected via next.config.ts → env → cloudflareR2 block
function getR2Client() {
  const endpoint = process.env.NEXT_PUBLIC_R2_ENDPOINT;
  const accessKeyId = process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials missing in next.config.ts (NEXT_PUBLIC_R2_ENDPOINT / ACCESS_KEY_ID / SECRET_ACCESS_KEY)");
  }

  return new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
}

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (isNextResponse(auth)) return auth;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WEBP, GIF, AVIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10 MB." },
        { status: 400 }
      );
    }

    const bucket = process.env.NEXT_PUBLIC_R2_BUCKET_NAME;
    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "");

    if (!bucket || !publicUrl) {
      throw new Error("R2 bucket config missing in next.config.ts (NEXT_PUBLIC_R2_R2_BUCKET_NAME / NEXT_PUBLIC_R2_PUBLIC_URL)");
    }

    // Organize uploads by year/month
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const key = `uploads/${year}/${month}/${uuidv4()}.${ext}`;

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
    console.error("POST /api/admin/upload:", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}