
"use client";

const publications = [
    { name: "BYRDIE", color: "text-black", font: "font-bold tracking-[0.2em]" },
    { name: "INSIDER", color: "text-black", font: "font-bold tracking-[0.15em]" },
    { name: "ELLE", color: "text-black", font: "font-light tracking-[0.3em] text-2xl italic" },
    { name: "teenVOGUE", color: "", font: "font-bold tracking-wide", custom: true },
    { name: "GLAMOUR", color: "text-black", font: "font-black tracking-[0.15em]" },
];

function PublicationName({ pub }: { pub: typeof publications[0] }) {
    if (pub.custom) {
        // Teen Vogue styling
        return (
            <span className="text-xl font-bold tracking-wide">
                <span className="text-[#c8102e]">teen</span>
                <span className="text-black">VOGUE</span>
            </span>
        );
    }
    return (
        <span className={`text-xl ${pub.color} ${pub.font}`}>
            {pub.name}
        </span>
    );
}

export default function AsSeenIn() {
    return (
        <section className="bg-white py-16 px-4 max-w-full">
            <h2 className="text-center text-3xl md:text-4xl font-serif text-gray-900 mb-10">
                As Seen In
            </h2>

            {/* Infinite marquee */}
            <>
                <style>{`
          @keyframes marquee-pub {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .pub-track {
            animation: marquee-pub 20s linear infinite;
          }
          .pub-track:hover {
            animation-play-state: paused;
          }
        `}</style>

                <div className="overflow-hidden">
                    <div className="pub-track flex w-max items-center gap-16 md:gap-24">
                        {[...publications, ...publications].map((pub, i) => (
                            <div key={i} className="shrink-0">
                                <PublicationName pub={pub} />
                            </div>
                        ))}
                    </div>
                </div>
            </>
        </section>
    );
}