"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Gift, Star, Users, ChevronRight, Sparkles } from "lucide-react";

// ─── types ───────────────────────────────────────────────
type Tab = "earn" | "redeem" | "referrals";

// ─── data ────────────────────────────────────────────────
const tiers = [
    { label: "Level 1", spend: "$0", color: "#E8D5C4", active: true },
    { label: "Level 2", spend: "$150", color: "#C9956C", active: false },
    { label: "Level 3", spend: "$350", color: "#A8C5DA", active: false },
    { label: "Tier 4", spend: "$1,000", color: "#C9A0DC", active: false },
];

const earnActions = [
    { icon: "🛍️", label: "Place an order", pts: "+1 pt / $1" },
    { icon: "🎂", label: "Birthday bonus", pts: "+50 pts" },
    { icon: "📝", label: "Write a review", pts: "+20 pts" },
    { icon: "📱", label: "Follow on Instagram", pts: "+15 pts" },
];

const redeemOptions = [
    { icon: "💸", label: "$5 off", pts: "100 pts" },
    { icon: "💸", label: "$10 off", pts: "200 pts" },
    { icon: "🎁", label: "Free gift", pts: "500 pts" },
];

// ─── component ───────────────────────────────────────────
export default function RewardsModal() {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<Tab>("earn");
    const [visible, setVisible] = useState(false);

    // slide in after a short delay
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(t);
    }, []);

    // collapsed pill
    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="rewards-pill"
                style={{
                    position: "fixed",
                    bottom: 24,
                    left: 24,
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 20px",
                    background: "linear-gradient(135deg, #1a1a1a 0%, #2d2012 100%)",
                    border: "1px solid rgba(201,149,108,0.4)",
                    borderRadius: 999,
                    color: "#E8D5C4",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    cursor: "pointer",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                }}
            >
                <span style={{
                    width: 28, height: 28,
                    background: "linear-gradient(135deg, #C9956C, #E8D5C4)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14,
                }}>✦</span>
                <span>Rewards</span>
                <Sparkles size={13} style={{ color: "#C9956C", opacity: 0.8 }} />
            </button>
        );
    }

    // expanded panel
    return (
        <div
            style={{
                position: "fixed",
                bottom: 24,
                left: 24,
                zIndex: 9999,
                width: 360,
                maxHeight: "85vh",
                display: "flex",
                flexDirection: "column",
                background: "#0e0c0b",
                border: "1px solid rgba(201,149,108,0.25)",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
                fontFamily: "'DM Sans', sans-serif",
                animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)",
            }}
        >
            <style>{`
        @keyframes slideUp {
          from { opacity:0; transform: translateY(24px) scale(0.97); }
          to   { opacity:1; transform: translateY(0)    scale(1);    }
        }
        .rw-tab { background:none; border:none; cursor:pointer; }
        .rw-tab.active { border-bottom: 2px solid #C9956C !important; }
        .rw-earn-row:hover { background: rgba(201,149,108,0.06); }
        .rw-tier { transition: transform 0.2s; }
        .rw-tier:hover { transform: translateY(-2px); }
      `}</style>

            {/* ── hero banner ── */}
            <div style={{
                background: "linear-gradient(160deg, #1e1209 0%, #2d1a0a 50%, #1a1208 100%)",
                padding: "24px 20px 20px",
                position: "relative",
                flexShrink: 0,
            }}>
                {/* close */}
                <button
                    onClick={() => setOpen(false)}
                    style={{
                        position: "absolute", top: 14, right: 14,
                        background: "rgba(255,255,255,0.07)", border: "none",
                        borderRadius: "50%", width: 28, height: 28,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "#E8D5C4",
                    }}
                >
                    <X size={14} />
                </button>

                {/* logo mark */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <div style={{
                        width: 34, height: 34,
                        background: "linear-gradient(135deg, #C9956C, #E8D5C4)",
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16,
                    }}>✦</div>
                    <span style={{ fontSize: 10, letterSpacing: "0.25em", color: "#C9956C", textTransform: "uppercase", fontWeight: 700 }}>
                        Nailsa
                    </span>
                </div>

                <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "#C9956C", textTransform: "uppercase", marginBottom: 4 }}>
                    Welcome to
                </p>
                <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 22, fontWeight: 700,
                    color: "#E8D5C4", lineHeight: 1.2, marginBottom: 8,
                }}>
                    Nailsa<br />
                    <em style={{ color: "#C9956C", fontStyle: "italic" }}>Rewards</em>
                </h2>
                <p style={{ fontSize: 12, color: "rgba(232,213,196,0.6)", lineHeight: 1.6, marginBottom: 16 }}>
                    Getting new nails now comes with rewards! Join Nailsa inner circle to enjoy VIP access, special discounts, and more. 💓
                </p>

                <a
                    href="/auth/register"
                    style={{
                        display: "block", width: "100%",
                        padding: "11px 0",
                        background: "linear-gradient(135deg, #C9956C, #d4a97c)",
                        color: "#1a0f08",
                        fontSize: 11, fontWeight: 800,
                        letterSpacing: "0.15em", textTransform: "uppercase",
                        textAlign: "center", borderRadius: 999,
                        textDecoration: "none",
                    }}
                >
                    Become a Member — Free
                </a>

                <p style={{ fontSize: 11, color: "rgba(232,213,196,0.4)", textAlign: "center", marginTop: 10 }}>
                    Already have an account?{" "}
                    <Link href="/auth/login" style={{ color: "#C9956C", textDecoration: "underline" }}>Sign in</Link>
                </p>
            </div>

            {/* ── scrollable body ── */}
            <div style={{ overflowY: "auto", flexGrow: 1 }}>

                {/* ── Points section ── */}
                <div style={{ padding: "20px 20px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <Star size={14} style={{ color: "#C9956C" }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#E8D5C4", letterSpacing: "0.05em" }}>Points</span>
                    </div>
                    <p style={{ fontSize: 11, color: "rgba(232,213,196,0.45)", marginBottom: 16 }}>
                        Earn Points for different actions, and turn them into awesome rewards!
                    </p>

                    {/* tabs */}
                    <div style={{ display: "flex", borderBottom: "1px solid rgba(201,149,108,0.15)", marginBottom: 16 }}>
                        {(["earn", "redeem"] as Tab[]).map(t => (
                            <button
                                key={t} onClick={() => setTab(t)}
                                className={`rw-tab${tab === t ? " active" : ""}`}
                                style={{
                                    padding: "6px 16px 8px",
                                    fontSize: 11, fontWeight: 600,
                                    letterSpacing: "0.1em", textTransform: "capitalize",
                                    color: tab === t ? "#C9956C" : "rgba(232,213,196,0.35)",
                                    borderBottom: tab === t ? "2px solid #C9956C" : "2px solid transparent",
                                }}
                            >
                                Ways to {t}
                            </button>
                        ))}
                    </div>

                    {tab === "earn" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 20 }}>
                            {earnActions.map(a => (
                                <div key={a.label} className="rw-earn-row" style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    padding: "10px 12px", borderRadius: 10,
                                    border: "1px solid rgba(201,149,108,0.1)",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span style={{ fontSize: 18 }}>{a.icon}</span>
                                        <span style={{ fontSize: 12, color: "#E8D5C4" }}>{a.label}</span>
                                    </div>
                                    <span style={{
                                        fontSize: 11, fontWeight: 700, color: "#C9956C",
                                        background: "rgba(201,149,108,0.12)", padding: "3px 8px", borderRadius: 999,
                                    }}>{a.pts}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {tab === "redeem" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 20 }}>
                            {redeemOptions.map(r => (
                                <div key={r.label} className="rw-earn-row" style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    padding: "10px 12px", borderRadius: 10,
                                    border: "1px solid rgba(201,149,108,0.1)",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span style={{ fontSize: 18 }}>{r.icon}</span>
                                        <span style={{ fontSize: 12, color: "#E8D5C4" }}>{r.label}</span>
                                    </div>
                                    <span style={{
                                        fontSize: 11, fontWeight: 700, color: "#C9956C",
                                        background: "rgba(201,149,108,0.12)", padding: "3px 8px", borderRadius: 999,
                                    }}>{r.pts}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Referrals ── */}
                <div style={{
                    margin: "0 20px 20px",
                    background: "linear-gradient(135deg, rgba(201,149,108,0.08), rgba(168,197,218,0.06))",
                    border: "1px solid rgba(201,149,108,0.18)",
                    borderRadius: 14, padding: "16px",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <Users size={13} style={{ color: "#C9956C" }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#E8D5C4" }}>Referrals</span>
                    </div>
                    <p style={{ fontSize: 11, color: "rgba(232,213,196,0.45)", marginBottom: 14, lineHeight: 1.5 }}>
                        Pretty girls don't gatekeep. Spread the word &amp; get rewarded!
                    </p>
                    <div style={{ display: "flex", gap: 10 }}>
                        {[{ who: "They get", val: "$10 off coupon", icon: "🎁" }, { who: "You get", val: "$10 off coupon", icon: "💝" }].map(r => (
                            <div key={r.who} style={{
                                flex: 1, background: "rgba(0,0,0,0.3)",
                                border: "1px solid rgba(201,149,108,0.15)",
                                borderRadius: 10, padding: "12px 10px", textAlign: "center",
                            }}>
                                <div style={{ fontSize: 22, marginBottom: 6 }}>{r.icon}</div>
                                <div style={{ fontSize: 10, color: "rgba(232,213,196,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>{r.who}</div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: "#C9956C" }}>{r.val}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── VIP Tiers ── */}
                <div style={{ padding: "0 20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <Gift size={13} style={{ color: "#C9956C" }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#E8D5C4" }}>VIP Tiers</span>
                    </div>
                    <p style={{ fontSize: 11, color: "rgba(232,213,196,0.4)", marginBottom: 14, lineHeight: 1.5 }}>
                        Your all access pass to exclusive rewards. Reach higher tiers for more exclusive perks.
                    </p>

                    <div style={{ position: "relative" }}>
                        {/* connector line */}
                        <div style={{
                            position: "absolute", left: 16, top: 20, bottom: 20,
                            width: 1, background: "linear-gradient(to bottom, #C9956C44, #A8C5DA44)",
                        }} />

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {tiers.map((tier, i) => (
                                <div key={tier.label} className="rw-tier" style={{
                                    display: "flex", alignItems: "center", gap: 14,
                                    padding: "10px 12px",
                                    background: i === 0 ? "rgba(201,149,108,0.08)" : "transparent",
                                    border: `1px solid ${tier.color}${i === 0 ? "40" : "20"}`,
                                    borderRadius: 12,
                                }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                                        background: `radial-gradient(circle at 35% 35%, ${tier.color}, ${tier.color}88)`,
                                        boxShadow: `0 0 12px ${tier.color}44`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 12, fontWeight: 700, color: "#0e0c0b",
                                    }}>
                                        {i + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: tier.color }}>{tier.label}</div>
                                        <div style={{ fontSize: 10, color: "rgba(232,213,196,0.4)", marginTop: 1 }}>Spend {tier.spend}</div>
                                    </div>
                                    {i === 0 && (
                                        <span style={{
                                            fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                                            color: "#C9956C", background: "rgba(201,149,108,0.15)",
                                            padding: "3px 8px", borderRadius: 999, textTransform: "uppercase",
                                        }}>Current</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}