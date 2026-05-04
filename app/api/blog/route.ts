import { NextRequest, NextResponse } from "next/server";

export interface BlogPost {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    excerpt: string;
    content: string; // HTML string
    author: string;
    authorRole: string;
    date: string;         // ISO date string
    readTime: number;     // minutes
    category: string;
    tags: string[];
    coverImage: string;
    featured: boolean;
}

const posts: BlogPost[] = [
    {
        id: 1,
        slug: "art-of-the-press-on",
        title: "The Art of the Press-On",
        subtitle: "Why salon-quality nails at home are no longer a compromise",
        excerpt:
            "For years, press-on nails carried the stigma of a quick fix. We set out to change that — and here's what we learned along the way.",
        content: `
      <p>There is a particular kind of confidence that comes from looking at your hands and feeling something. Not just satisfaction — something closer to pride. For most of nail history, that feeling was reserved for the salon: the warm lamp, the careful brush strokes, the quiet ritual of being tended to.</p>

      <p>Press-on nails were never supposed to compete with that. They were the emergency option. The bridesmaid's backup plan. The thing you bought at a drugstore the night before and hoped for the best.</p>

      <h2>The Shift Nobody Saw Coming</h2>

      <p>Around 2019, something quietly changed. A handful of independent makers — working from kitchens, small studios, Etsy shops — started treating press-ons as an art form rather than a convenience product. They experimented with nail shapes that salons rarely offered. They sourced higher-grade polymers. They obsessed over adhesive chemistry the way a perfumer obsesses over base notes.</p>

      <p>The results were startling. Sets that lasted two, three weeks. Finishes that didn't yellow. Fits that felt custom. The word spread the way it always does now — through close-up photography, through comments that asked <em>wait, are those real?</em></p>

      <h2>What We Do Differently</h2>

      <p>When we started G&G, we made one decision early: we would never launch a product we wouldn't wear ourselves for two weeks straight. That sounds obvious. It eliminated about sixty percent of our early samples.</p>

      <p>The coffin shape took eleven iterations before we were happy with the taper. The adhesive tabs went through four formulations — too aggressive, too weak, too lifting at the edges, finally right. Our matte top coat required a separate supplier because every ready-made option we tested developed a sheen by day three.</p>

      <blockquote>The goal was never to replace the salon. The goal was to give you something the salon couldn't: your time back, without the trade-off.</blockquote>

      <p>We're not anti-salon. We love a good nail appointment. But we are pro-option — pro having something beautiful ready when the appointment isn't, when the budget doesn't stretch, when you simply want to do it yourself.</p>

      <h2>Wearing Them Well</h2>

      <p>A few things we've learned from thousands of customers: prep is everything. A nail that's been lightly buffed and cleaned with alcohol will hold for weeks. A nail that skipped that step will lift by Tuesday. The product itself accounts for maybe sixty percent of longevity. The application ritual accounts for the rest.</p>

      <p>We include a prep guide in every order because we've seen what happens when people skip it — and we've seen the difference when they don't. It's the part most brands don't talk about, which is exactly why we do.</p>
    `,
        author: "Genevieve Ashworth",
        authorRole: "Co-Founder & Creative Director",
        date: "2024-03-12",
        readTime: 6,
        category: "Behind the Brand",
        tags: ["press-on nails", "brand story", "nail care"],
        coverImage: "https://images.unsplash.com/photo-1684609365994-a144ee021c88?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDZ8fHxlbnwwfHx8fHw%3D",
        featured: true,
    },
    {
        id: 2,
        slug: "shape-guide",
        title: "Finding Your Shape",
        subtitle: "A considered guide to the five silhouettes we make — and how to choose",
        excerpt:
            "Almond, coffin, square, oval, stiletto. Each shape has a personality. The right one for you depends on more than just aesthetics.",
        content: `
      <p>Nail shape is one of those things people often decide impulsively — they see a set they love and order it without thinking too much about fit. Sometimes that works perfectly. Sometimes it means wearing a shape that's slightly off for your hand, and not quite knowing why it doesn't look the way it did in the photo.</p>

      <p>We've thought about this a lot. Here's what we've learned.</p>

      <h2>Almond</h2>

      <p>The almond is our most flattering shape for the widest range of hands. It narrows toward the tip without coming to a true point, creating the illusion of longer, slimmer fingers on almost everyone. If you're new to press-ons, this is where we'd start.</p>

      <p>It's particularly good on shorter nail beds because the taper draws the eye upward. It's also the shape that photographs best — there's something about the curve that catches light in a way that feels cinematic.</p>

      <h2>Coffin</h2>

      <p>The coffin — sometimes called ballerina — is a long shape with a flat, squared-off tip. It's the most dramatic silhouette we offer, and it requires some commitment: the length matters for the proportion. A short coffin loses the shape's character entirely.</p>

      <p>It suits longer fingers beautifully. On shorter or wider fingers, it can feel a little overwhelming, though that's also, depending on who you are, entirely the point.</p>

      <blockquote>A shape isn't just what looks good. It's what you feel like when you're wearing it.</blockquote>

      <h2>Square</h2>

      <p>Square is the most practical shape we make. It's clean, it's modern, it doesn't snag. People who work with their hands tend to gravitate here — there's nothing to catch, nothing to break. The flat tip also suits a shorter length in a way that other shapes don't.</p>

      <p>Design-wise, square works best with minimal or geometric nail art. It's a frame, not a canvas — which means what you put on it needs to be intentional.</p>

      <h2>Oval</h2>

      <p>Oval sits between almond and round — rounder than almond, less tapered than stiletto. It's a softer, more understated version of the elongating effect. If almond feels too dramatic for your day-to-day but you want the lengthening, oval is the answer.</p>

      <h2>A Note on Fit</h2>

      <p>All shapes come in our full size range. We include more sizes per set than most brands (28 nails across 14 sizes) because we know that the difference between a size 4 and size 5 on your ring finger is often the difference between a nail that stays put for three weeks and one that lifts by the weekend.</p>

      <p>When in doubt, size down rather than up. A nail that's slightly too narrow will adhere better and look cleaner at the edges than one that overhangs.</p>
    `,
        author: "Isla Mercer",
        authorRole: "Lead Product Designer",
        date: "2024-02-28",
        readTime: 5,
        category: "Education",
        tags: ["nail shapes", "guide", "how-to"],
        coverImage: "/product2.png",
        featured: true,
    },
    {
        id: 3,
        slug: "lny-collection-story",
        title: "The LNY Limited Story",
        subtitle: "How our Lunar New Year collection came together — and why it almost didn't",
        excerpt:
            "We almost didn't make it. Here's the honest story of our most personal collection, the decisions we agonised over, and what it taught us.",
        content: `
      <p>The Lunar New Year collection started as a sketch on a napkin in October. It nearly ended there, too.</p>

      <p>The brief we gave ourselves was loose: something that honours the occasion without being costume. Something that a person would wear to a family dinner and feel beautiful in, not performative. Something that didn't rely on obvious iconography — no dragons, no lanterns, no red-and-gold.</p>

      <p>That constraint turned out to be the hardest creative problem we'd ever set ourselves.</p>

      <h2>Three Months of Wrong Answers</h2>

      <p>Our first round of samples were beautiful and completely wrong. They were sophisticated, restrained, technically excellent — and they had nothing to do with the feeling of the holiday. We'd made something we could have made any time of year and called it LNY. It wasn't honest.</p>

      <p>We scrapped them. That was an expensive decision. It was the right one.</p>

      <p>The second round went too far the other way — bold colour, overt references, the kind of set that announces itself before you even walk in the room. Also not it.</p>

      <blockquote>We were trying to represent something. What we needed to do was remember something.</blockquote>

      <h2>What Changed</h2>

      <p>Genevieve went home for the holiday between rounds two and three. She came back with photographs — not of decorations or food, but of fabric. A qipao in her grandmother's wardrobe. The way the silk moved. The particular darkness of the navy against the gold embroidery, the texture in the weave.</p>

      <p>That became the brief for round three: textile as reference point, not iconography. The deep silk finish of Midnight Silk. The warmth underneath the black. The sense that there's something rich and considered beneath the surface.</p>

      <h2>The Result</h2>

      <p>Midnight Silk became our best-selling product of all time within six weeks of launch. We still don't fully understand why — whether it was the timing, the story, the product itself, or some combination of all three.</p>

      <p>What we do know is that the napkin sketch and the scrapped samples and the expensive wrong turns were all necessary. The collection that almost didn't happen turned out to be the one that mattered most.</p>
    `,
        author: "Genevieve Ashworth",
        authorRole: "Co-Founder & Creative Director",
        date: "2024-02-08",
        readTime: 7,
        category: "Behind the Brand",
        tags: ["LNY", "collection", "design process"],
        coverImage: "https://images.unsplash.com/photo-1777287852750-53eb2ca506e9?q=80&w=1114&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        featured: false,
    },
    {
        id: 4,
        slug: "application-ritual",
        title: "The Ten-Minute Ritual",
        subtitle: "Our exact application process — the steps most people skip and why they shouldn't",
        excerpt:
            "Longevity isn't just about the product. It's about the five minutes of prep that most tutorials gloss over. Here's exactly what to do.",
        content: `
      <p>We hear the same story regularly. Someone buys their first set, applies it in a hurry before going out, and by day four one nail has lifted at the corner. They assume it's the product. Often, it isn't.</p>

      <p>The difference between two weeks and four days almost always comes down to prep. Here's the ritual we recommend — the one our team uses, the one our most long-term customers swear by.</p>

      <h2>Step One: Shape Your Natural Nails</h2>

      <p>File your natural nails short and as flat as possible. Press-ons adhere to the entire nail surface; any curve or length on the natural nail creates a gap at the tip where moisture can enter. This is the number one cause of premature lifting.</p>

      <h2>Step Two: Push Back Cuticles</h2>

      <p>Use a cuticle pusher to gently push back any overgrowth. The press-on needs to sit flush with your cuticle line — if cuticle is sitting under the edge of the nail, it'll lift within days.</p>

      <h2>Step Three: Buff Lightly</h2>

      <p>A light pass with a fine-grit buffer removes the shine from your natural nail surface and creates micro-texture for the adhesive to grip. Don't overdo it — ten strokes per nail is plenty.</p>

      <blockquote>Prep is the unsexy part. It's also the only part that determines how long your nails last.</blockquote>

      <h2>Step Four: Cleanse with Alcohol</h2>

      <p>Wipe every nail with an alcohol wipe or cotton pad soaked in rubbing alcohol. This removes oils, lotion, soap residue — anything that could prevent adhesion. Do this last, right before you apply. Don't touch your nails afterward.</p>

      <h2>Step Five: Choose Your Adhesive Method</h2>

      <p><strong>Adhesive tabs</strong> are better for shorter wear and easy removal. They give you about one to two weeks and come off cleanly in warm water. Use these if you rotate sets often or like flexibility.</p>

      <p><strong>Nail glue</strong> gives you up to three weeks. Apply a thin layer to the press-on (not the natural nail), press firmly for thirty seconds starting from the cuticle end, and hold. Thin is key — excess glue creates air bubbles.</p>

      <h2>Step Six: Apply in the Right Order</h2>

      <p>Start with your non-dominant hand. Work from thumb to pinky. Giving yourself a moment between each nail lets the adhesive set before you're using that hand to press the next one.</p>

      <p>The ritual takes ten minutes when you're used to it. The first time, give yourself fifteen. It's worth every minute.</p>
    `,
        author: "Isla Mercer",
        authorRole: "Lead Product Designer",
        date: "2024-01-19",
        readTime: 5,
        category: "Education",
        tags: ["application", "how-to", "longevity", "prep"],
        coverImage: "/product1.png",
        featured: false,
    },
    {
        id: 5,
        slug: "summer-24-palette",
        title: "Building the Summer '24 Palette",
        subtitle: "Heat, restraint, and the case for doing less",
        excerpt:
            "Summer collections are easy to get wrong. Too bright, too obvious, too much. Here's how we approached it — and the one colour we refused to include.",
        content: `
      <p>Summer is a trap for nail brands. The instinct is to go full colour — neons, corals, tropical prints, the kind of palette that reads as a mood board for a beach bar. It sells. It's also almost always forgettable by September.</p>

      <p>We wanted to make something that still felt like summer in October, when you're back at your desk and wanting the feeling of that trip you took. Something with longevity beyond the season.</p>

      <h2>The Colour Brief</h2>

      <p>We gave ourselves a rule: no colour that reads immediately as summer. No turquoise, no coral, no citrus yellow. Instead: colours that evoke summer indirectly. The gold of late afternoon light. The warmth that lingers in a sunburned sky. The cool, dark, surprising moment when the temperature drops at night and the stars appear.</p>

      <p>Champagne Toast came from the first. Obsidian Glaze came from the third. They're opposites in every technical sense — one sheer and glittering, one deep and colour-shifting — but they share a moodiness that felt right.</p>

      <h2>The Colour We Refused</h2>

      <p>We had a coral. It was beautiful. Our team loved it. It tested beautifully in focus groups. We cut it at the last round of samples.</p>

      <p>The reason was simple: when we laid it out next to the rest of the collection, it broke the spell. It was the one colour that said summer out loud when everything else was whispering it. The collection became more coherent without it — tighter, stranger, more itself.</p>

      <blockquote>Editing is the hardest creative skill. Knowing what to remove is harder than knowing what to add.</blockquote>

      <h2>What's Next</h2>

      <p>We won't say too much about what comes after Summer '24. But we'll say that Autumn is going to surprise people. We've been sitting on a finish development for eight months that we think is genuinely new — not new-to-us, new to the category.</p>

      <p>More soon.</p>
    `,
        author: "Genevieve Ashworth",
        authorRole: "Co-Founder & Creative Director",
        date: "2024-05-03",
        readTime: 4,
        category: "Collections",
        tags: ["summer", "palette", "design process", "collections"],
        coverImage: "/product2.png",
        featured: false,
    },
    {
        id: 6,
        slug: "care-and-reuse",
        title: "The Second Wear",
        subtitle: "How to remove, store, and rewear your press-ons without compromising the finish",
        excerpt:
            "Every set we make is designed to be worn more than once. Here's the process that makes it possible — and the mistakes that make it not.",
        content: `
      <p>Press-ons being single-use is a myth we'd like to retire. Done right, a good set can be worn three, sometimes four times before the structure or finish starts to compromise. Here's how.</p>

      <h2>Removal</h2>

      <p>The cardinal rule: never force it. A nail that feels stuck needs more time in warm water, not more force. Soak your fingertips in warm (not hot) water for five to ten minutes. The adhesive will soften and the nail will release with gentle side-to-side movement at the base.</p>

      <p>If you used nail glue, you may want to use a wooden cuticle stick to gently lever from the cuticle edge rather than pulling from the tip. Go slowly. The nail is reusable; treating it carefully during removal is how it stays that way.</p>

      <h2>Cleaning</h2>

      <p>Once removed, clean any adhesive residue from the inside of the nail with a cotton pad and rubbing alcohol. For stubborn glue, a very gentle scrape with an orange wood stick works better than any solvent. Don't use acetone — it will cloud the finish on most of our sets.</p>

      <blockquote>The finish on the outside of the nail is the hardest part to protect. The inside is easy. Never use acetone on the outside.</blockquote>

      <h2>Storage</h2>

      <p>Store your cleaned nails back in the original tray, or in a small organiser tray with separate slots. Stacking them loose in a bag creates scratches and chips. The few seconds it takes to store them properly is the difference between a set you can wear again and a set you can't.</p>

      <h2>The Second Application</h2>

      <p>The second wear is almost always better than the first. You know which sizes fit which fingers. You know how much adhesive you need. The ritual is faster, the result is cleaner.</p>

      <p>We always recommend adhesive tabs for second and subsequent wears rather than glue — they're gentler on both the nail and your natural nail, and they're sufficient since the press-on no longer needs to flex and settle the way a brand-new nail does.</p>
    `,
        author: "Isla Mercer",
        authorRole: "Lead Product Designer",
        date: "2024-04-10",
        readTime: 4,
        category: "Education",
        tags: ["care", "reuse", "removal", "how-to"],
        coverImage: "/product3.png",
        featured: false,
    },
];

// ─── GET /api/blog ────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");

    // Single post by slug
    if (slug) {
        const post = posts.find((p) => p.slug === slug);
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }
        const related = posts
            .filter(
                (p) =>
                    p.slug !== slug &&
                    (p.category === post.category ||
                        p.tags.some((t) => post.tags.includes(t)))
            )
            .slice(0, 3);
        return NextResponse.json({ post, related });
    }

    // List — optionally filtered by category
    const filtered = category
        ? posts.filter((p) => p.category.toLowerCase() === category.toLowerCase())
        : posts;

    const categories = [...new Set(posts.map((p) => p.category))];

    return NextResponse.json({
        posts: filtered,
        total: filtered.length,
        categories,
        featured: posts.filter((p) => p.featured),
    });
}