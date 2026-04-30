"use client";

import theme from "@/theme";
import { Zap, Clock, ShieldCheck, Truck, Star } from "lucide-react";



const items = [
    { icon: <Zap size={14} />, text: "APPLY IN UNDER 10 MIN" },
    { icon: <Clock size={14} />, text: "LAST UP TO 4 WEEKS" },
    { icon: <ShieldCheck size={14} />, text: "ZERO DAMAGE & REUSABLE" },
    { icon: <Truck size={14} />, text: "FREE SHIPPING OVER $60" },
    { icon: <Star size={14} />, text: "500,000+ HAPPY CUSTOMERS" },
];

export default function MarqueeBanner() {
    return (
        <div
            className="relative w-full overflow-hidden py-3 border-y transition-colors duration-500"
            style={{
                backgroundColor: theme.colors.light,
                borderColor: `${theme.colors.dark}15` // 15% opacity version of dark
            }}
        >
            {/* Edge Fades for a high-end feel */}
            <div
                className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none"
                style={{ background: `linear-gradient(to right, ${theme.colors.light}, transparent)` }}
            />
            <div
                className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none"
                style={{ background: `linear-gradient(to left, ${theme.colors.light}, transparent)` }}
            />

            <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 40s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

            <div className="marquee-track">
                {[...items, ...items].map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center px-8 whitespace-nowrap"
                        style={{
                            color: theme.colors.dark,
                            fontSize: "11px",
                            fontWeight: 600,
                            letterSpacing: "0.12em"
                        }}
                    >
                        <span style={{ color: theme.colors.primary }} className="mr-3">
                            {item.icon}
                        </span>
                        <span>{item.text}</span>

                        {/* Minimalist Separator */}
                        <span
                            className="ml-16 w-1 h-1 rounded-full"
                            style={{ backgroundColor: theme.colors.muted }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}