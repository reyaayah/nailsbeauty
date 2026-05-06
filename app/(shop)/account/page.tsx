"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    User, Mail, ShoppingBag, Heart,
    LogOut, ChevronRight, Shield, MapPin
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import theme from "@/theme";

export default function AccountPage() {
    const { user, userProfile, logout, loading } = useAuth();
    const router = useRouter();

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/login");
        }
    }, [user, loading, router]);

    if (loading || !user || !userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.light }}>
                <div className="flex flex-col items-center gap-4">
                    <div
                        className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: theme.colors.primary }}
                    />
                    <p className="text-sm opacity-50">Loading your profile...</p>
                </div>
            </div>
        );
    }

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    const menuItems = [
        { icon: ShoppingBag, label: "Order History", sub: `${userProfile.orderHistory?.length ?? 0} orders`, href: "/account/orders" },
        { icon: Heart, label: "Wishlist", sub: `${userProfile.wishlist?.length ?? 0} saved items`, href: "/account/wishlist" },
        { icon: MapPin, label: "Addresses", sub: `${userProfile.addresses?.length ?? 0} saved`, href: "/account/addresses" },
        { icon: Shield, label: "Security", sub: "Password & login", href: "/account/security" },
    ];

    const initials = userProfile.displayName
        ? userProfile.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "GG";

    return (
        <div className="min-h-screen pt-28 pb-20 px-4" style={{ backgroundColor: theme.colors.light }}>
            <div className="max-w-lg mx-auto">

                {/* Profile Card */}
                <div className="bg-white rounded-3xl p-8 mb-6 shadow-sm text-center">
                    {/* Avatar */}
                    <div className="relative w-20 h-20 mx-auto mb-4">
                        {userProfile.photoURL ? (
                            <Image
                                src={userProfile.photoURL}
                                alt={userProfile.displayName ?? "User"}
                                fill
                                className="rounded-full object-cover border-4 border-white shadow-md"
                            />
                        ) : (
                            <div
                                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-serif font-bold"
                                style={{ backgroundColor: theme.colors.primary }}
                            >
                                {initials}
                            </div>
                        )}
                        {/* Provider badge */}
                        <div
                            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center"
                        >
                            {userProfile.provider === "google" ? (
                                <svg width="14" height="14" viewBox="0 0 18 18">
                                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
                                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
                                    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
                                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
                                </svg>
                            ) : (
                                <Mail size={12} />
                            )}
                        </div>
                    </div>

                    <h1 className="text-2xl font-serif font-bold mb-1" style={{ color: theme.colors.dark }}>
                        {userProfile.displayName ?? "Guest"}
                    </h1>
                    <p className="text-sm opacity-50 mb-4">{userProfile.email}</p>

                    <div
                        className="inline-block text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full text-white"
                        style={{ backgroundColor: theme.colors.primary }}
                    >
                        Beauty Member
                    </div>
                </div>

                {/* Menu */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm mb-6 divide-y divide-gray-50">
                    {menuItems.map(({ icon: Icon, label, sub, href }) => (
                        <button
                            key={label}
                            onClick={() => router.push(href)}
                            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: theme.colors.primary + "15" }}
                            >
                                <Icon size={18} style={{ color: theme.colors.primary }} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold" style={{ color: theme.colors.dark }}>{label}</p>
                                <p className="text-xs opacity-40">{sub}</p>
                            </div>
                            <ChevronRight size={16} className="opacity-30" />
                        </button>
                    ))}
                </div>

                {/* Edit Profile */}
                <button
                    onClick={() => router.push("/account/edit")}
                    className="w-full border-2 rounded-full py-3.5 text-sm font-black uppercase tracking-widest transition-all hover:bg-gray-50 mb-4"
                    style={{ borderColor: theme.colors.muted, color: theme.colors.dark }}
                >
                    Edit Profile
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 text-red-500 text-sm font-bold uppercase tracking-widest py-3 hover:opacity-70 transition-opacity"
                >
                    <LogOut size={16} /> Sign Out
                </button>

                {/* Member since */}
                <p className="text-center text-[10px] opacity-30 mt-8 uppercase tracking-widest">
                    Member since{" "}
                    {userProfile.createdAt
                        ? new Date((userProfile.createdAt as any)?.seconds * 1000 || userProfile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                        : "—"}
                </p>
            </div>
        </div>
    );
}
