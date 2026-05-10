"use client";

/**
 * /account/points/page.tsx
 * Full loyalty points history + rewards dashboard
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";
import { PointsTransaction, getProgressToNextReward, getLevelInfo, POINTS_CONFIG } from "@/lib/referral";
import { Star, Gift, ShoppingBag, ChevronLeft, Sparkles } from "lucide-react";
import theme from "@/theme";

const TYPE_META: Record<PointsTransaction["type"], { label: string; color: string; Icon: any }> = {
    signup_bonus: { label: "Welcome bonus", color: "#8b5cf6", Icon: Sparkles },
    referral_reward: { label: "Referral reward", color: "#f59e0b", Icon: Gift },
    purchase: { label: "Purchase points", color: "#22c55e", Icon: ShoppingBag },
    manual: { label: "Bonus points", color: "#3b82f6", Icon: Star },
};

export default function PointsPage() {
    const { user, userProfile, loading } = useAuth();
    const router = useRouter();
    const [history, setHistory] = useState<(PointsTransaction & { id: string })[]>([]);
    const [histLoading, setHistLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) router.push("/auth/login");
    }, [user, loading, router]);

    useEffect(() => {
        if (!user) return;
        const db = getClientDb();
        const q = query(
            collection(db, "users", user.uid, "pointsHistory"),
            orderBy("createdAt", "desc")
        );
        getDocs(q).then((snap) => {
            setHistory(snap.docs.map((d) => ({ id: d.id, ...d.data() } as any)));
            setHistLoading(false);
        });
    }, [user]);

    if (loading || !user || !userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.light }}>
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.colors.primary }} />
            </div>
        );
    }

    const points = userProfile.loyaltyPoints ?? 0;
    const { earned, progress, remaining, couponsEarned } = getProgressToNextReward(points);
    const { label: levelLabel } = getLevelInfo(points);

    return (
        <div className="min-h-screen pt-28 pb-20 px-4" style={{ backgroundColor: theme.colors.light }}>
            <div className="max-w-lg mx-auto space-y-5">

                {/* Back */}
                <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm font-bold opacity-40 hover:opacity-70 transition-opacity">
                    <ChevronLeft size={16} /> Back
                </button>

                {/* Points header card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm text-center relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-5" style={{ backgroundColor: theme.colors.primary }} />
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Star size={22} fill={theme.colors.primary} style={{ color: theme.colors.primary }} />
                        <span className="text-5xl font-serif font-bold" style={{ color: theme.colors.dark }}>{points}</span>
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-5">Total Points · {levelLabel}</p>

                    {/* Progress to next reward */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider opacity-40">
                            <span>{earned} / {POINTS_CONFIG.REWARD_THRESHOLD} pts</span>
                            <span>Next reward</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${progress}%`, backgroundColor: theme.colors.primary }}
                            />
                        </div>
                        <p className="text-xs font-semibold" style={{ color: theme.colors.primary }}>
                            {remaining} more points for a free 3M Sticky Tabs Pack coupon
                        </p>
                    </div>

                    {/* Coupons earned */}
                    {couponsEarned > 0 && (
                        <div className="mt-5 flex items-center justify-center gap-2 text-sm font-bold text-green-600">
                            <Gift size={16} />
                            {couponsEarned} coupon{couponsEarned > 1 ? "s" : ""} earned — check your email!
                        </div>
                    )}
                </div>

                {/* How to earn */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: theme.colors.dark }}>How to earn points</h2>
                    <div className="space-y-3">
                        {[
                            { icon: Sparkles, label: "Create an account", pts: POINTS_CONFIG.SIGNUP_BONUS, color: "#8b5cf6" },
                            { icon: Gift, label: "Refer a friend", pts: POINTS_CONFIG.REFERRER_REWARD, color: "#f59e0b" },
                            { icon: ShoppingBag, label: "Shop (per $1 spent)", pts: POINTS_CONFIG.POINTS_PER_POUND, color: "#22c55e" },
                        ].map(({ icon: Icon, label, pts, color }) => (
                            <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "15" }}>
                                        <Icon size={16} style={{ color }} />
                                    </div>
                                    <span className="text-sm font-semibold" style={{ color: theme.colors.dark }}>{label}</span>
                                </div>
                                <span className="text-sm font-black" style={{ color }}>+{pts} pts</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transaction history */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: theme.colors.dark }}>Points history</h2>
                    {histLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.colors.primary }} />
                        </div>
                    ) : history.length === 0 ? (
                        <p className="text-center text-sm opacity-40 py-8">No points yet. Start earning!</p>
                    ) : (
                        <div className="space-y-0">
                            {history.map(({ id, type, points: pts, description, createdAt }) => {
                                const meta = TYPE_META[type] ?? TYPE_META.manual;
                                const date = (createdAt as any)?.seconds
                                    ? new Date((createdAt as any).seconds * 1000)
                                    : new Date();
                                return (
                                    <div key={id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: meta.color + "15" }}>
                                            <meta.Icon size={15} style={{ color: meta.color }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate" style={{ color: theme.colors.dark }}>{description}</p>
                                            <p className="text-[11px] opacity-40">{date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                                        </div>
                                        <span className="text-sm font-black shrink-0" style={{ color: meta.color }}>+{pts}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}