// ShopByShape.tsx
const shapes = [
    { name: "Almond", image: "/shapes/almond.png", href: "/collections/almond" },
    { name: "Coffin", image: "/shapes/coffin.png", href: "/collections/coffin" },
    { name: "Oval", image: "/shapes/oval.png", href: "/collections/oval" },
    { name: "Squoval", image: "/shapes/squoval.png", href: "/collections/squoval" },
    { name: "Square", image: "/shapes/square.png", href: "/collections/square" },
];

export default function ShopByShape() {
    return (
        <section className="bg-[#f2f0ee] py-16 px-4 w-full">
            <h2 className="text-center text-3xl md:text-4xl font-serif text-gray-900 mb-12">
                Shop By Shape
            </h2>
            <div className="flex justify-center items-end gap-6 md:gap-12 flex-wrap">
                {shapes.map((shape) => (
                    <a
                        key={shape.name}
                        href={shape.href}
                        className="flex flex-col items-center gap-4 group"
                    >
                        <div className="w-20 md:w-28 overflow-hidden">
                            <img
                                src={shape.image}
                                alt={shape.name}
                                className="w-full object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <span className="text-sm text-gray-700 tracking-wide">{shape.name}</span>
                    </a>
                ))}
            </div>
        </section>
    );
}