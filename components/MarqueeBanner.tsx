const items = [
    { icon: "⚡", text: "Apply in under 10 min" },
    { icon: "🕐", text: "Last up to 4 weeks each wear" },
    { icon: "🙂", text: "Zero nail damage & reusable for life" },
    { icon: "📦", text: "Free shipping over $60" },
    { icon: "⭐", text: "500,000+ happy customers" },
];

export default function MarqueeBanner() {
    return (
        <>
            <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee 28s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

            <div style={{ background: "#111", overflow: "hidden", width: "100%", padding: "10px 0" }}>
                <div className="marquee-track" style={{ display: "flex", width: "max-content" }}>
                    {[...items, ...items].map((item, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "0 40px",
                                whiteSpace: "nowrap",
                                color: "#fff",
                                fontSize: 13,
                                letterSpacing: "0.06em",
                            }}
                        >
                            <span>{item.icon}</span>
                            <span>{item.text}</span>
                            <span style={{ color: "#555", fontSize: 18, marginLeft: 20 }}>✦</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}