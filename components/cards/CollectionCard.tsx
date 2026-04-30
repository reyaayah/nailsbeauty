import theme from "@/theme";

export type Collection = {
    name: string;
    image: string;
    bg: string;
};

export function CollectionCard({ collection }: { collection: Collection }) {
    return (
        <div
            className="flex-none rounded-[20px] overflow-hidden relative"
            style={{ width: 170, aspectRatio: "3/4" }}
        >
            {/* Image or image placeholder */}
            {collection.image ? (
                <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover block transition-transform duration-500 hover:scale-[1.06]"
                />
            ) : (
                <div
                    className="w-full h-full flex items-center justify-center text-[52px]"
                    style={{ background: collection.bg }}
                >
                    {collection.image}
                </div>
            )}

            {/* Name overlay */}
            <div
                className="absolute inset-0 flex items-end p-3"
                style={{
                    background:
                        "linear-gradient(to top, rgba(66,43,35,0.72) 0%, transparent 55%)",
                }}
            >
                <span
                    className="font-bold text-[15px] leading-tight"
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        color: theme.colors.light,
                    }}
                >
                    {collection.name}
                </span>
            </div>
        </div>
    );
}