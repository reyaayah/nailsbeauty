import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    coverImage: string;
    readTime: number;
    tags: string[];
    isPublished: boolean;
    createdAt: string | null;
    updatedAt: string | null;
}

function serializePost(d: FirebaseFirestore.QueryDocumentSnapshot): BlogPost {
    const data = d.data();
    return {
        id: d.id,
        slug: data.slug ?? "",
        title: data.title ?? "",
        excerpt: data.excerpt ?? "",
        content: data.content ?? "",
        author: data.author ?? "",
        coverImage: data.coverImage ?? "",
        readTime: data.readTime ?? 0,
        tags: data.tags ?? [],
        isPublished: data.isPublished ?? false,
        createdAt: data.createdAt?.toDate?.().toISOString() ?? null,
        updatedAt: data.updatedAt?.toDate?.().toISOString() ?? null,
    };
}

const col = () => adminDb.collection("blog");

// ─── GET /api/blog ─────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const tag = searchParams.get("tag");

    // ── Single post by slug ──────────────────────────────────────────────
    if (slug) {
        const snap = await col().where("slug", "==", slug).limit(1).get();

        if (snap.empty || !snap.docs[0].data().isPublished) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const post = serializePost(snap.docs[0]);

        let related: BlogPost[] = [];
        if (post.tags.length > 0) {
            const relSnap = await col()
                .where("tags", "array-contains-any", post.tags)
                .limit(10)
                .get();

            const seen = new Set([post.id]);
            for (const doc of relSnap.docs) {
                const p = serializePost(doc);
                if (p.isPublished && !seen.has(p.id)) {
                    seen.add(p.id);
                    related.push(p);
                    if (related.length === 3) break;
                }
            }
        }

        return NextResponse.json({ post, related });
    }

    // ── Post list ────────────────────────────────────────────────────────
    const snap = await col().orderBy("createdAt", "desc").get();

    let posts = snap.docs.map(serializePost).filter((p) => p.isPublished);

    if (tag) {
        posts = posts.filter((p) => p.tags.includes(tag));
    }

    const allTags = [...new Set(posts.flatMap((p) => p.tags))];

    return NextResponse.json({ posts, total: posts.length, tags: allTags });
}