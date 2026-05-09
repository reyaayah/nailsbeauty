"use client";

import { useEffect, useState, useRef } from "react";
import { Menu, Search, ShoppingCart, User, X, LogOut } from "lucide-react";
import Sidebar from "./SideBar";
import CartSidebar from "./Cart";
import theme from "@/theme";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/hooks/useProducts";

const announcements = [
  "FREE SHIPPING ON ORDERS OVER $75",
  "NEW SUMMER COLLECTION IS HERE",
  "BUY 3 GET 1 FREE BUNDLES",
];

const SUGGESTIONS = ["Almond", "Coffin", "Square", "Short", "Stiletto", "Oval", "French", "Glitter"];

const navItems = [
  { name: "New Arrivals", href: "#new-arrivals" },
  { name: "Shop All", href: "/products" },
  { name: "Bundles", href: "/collections/bundles" },
  { name: "Best Sellers", href: "#best-sellers" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const { totalItems } = useCart();
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Fetch all products once; filter client-side
  const { products, loading } = useProducts();

  const handleConfirmLogout = async () => {
    setShowSignOutModal(false);
    setUserMenuOpen(false);
    await logout();
    router.push("/");
  };

  const handleNav = (href: string) => {
    if (href.startsWith("#")) {
      if (pathname !== "/") router.push(`/${href}`);
      else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(href);
    }
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  // ── Derived search state ──────────────────────────────────────────────────
  const q = searchQuery.trim().toLowerCase();

  const filteredProducts = q
    ? products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        (p as any).style?.toLowerCase().includes(q) ||
        (p as any).shape?.toLowerCase().includes(q) ||
        (p as any).length?.toLowerCase().includes(q)
    )
    : [];

  const filteredSuggestions = q
    ? SUGGESTIONS.filter((s) => s.toLowerCase().includes(q))
    : SUGGESTIONS;

  const showDropdown = searchOpen && q.length > 0;

  // ── Timers & listeners ────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 100);
    else setSearchQuery("");
  }, [searchOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSearch();
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      // Close search if clicking outside the search bar area
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = userProfile?.displayName
    ? userProfile.displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "GG";

  return (
    <>
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Sidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onFilterSelect={(category, value) => router.push(`/products?${category}=${value}`)}
      />

      <header className="fixed top-0 left-0 w-full z-40">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-md py-6 shadow-sm transition-all duration-500">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-3 items-center">

            {/* Left */}
            <div className="flex items-center gap-4">
              <button onClick={() => setIsOpen(true)} className="group flex items-center gap-2">
                <div className="relative w-6 h-6 flex flex-col justify-center gap-1">
                  <span className="h-[1px] w-6 bg-black transition-all duration-300 group-hover:w-4" />
                  <span className="h-[1px] w-4 bg-black transition-all duration-300 group-hover:w-6" />
                </div>
                <span className="hidden md:block text-[10px] tracking-[0.3em] uppercase text-black">Menu</span>
              </button>

              <div onClick={() => router.push("/")} className="flex flex-col leading-none cursor-pointer">
                <h1 className="text-lg md:text-xl text-[#c28c8d] font-black tracking-tighter uppercase whitespace-nowrap">
                  Nailsa
                </h1>
                <span className="text-[7px] tracking-[0.4em] text-gray-400 ml-0.5 uppercase">
                  Beauty at your fingertips
                </span>
              </div>
            </div>

            {/* Center — nav links OR search bar */}
            {!searchOpen ? (
              <div className="hidden lg:flex justify-center items-center gap-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    onClick={() => handleNav(item.href)}
                    href={item.href}
                    className="group relative text-[11px] font-bold uppercase tracking-[0.15em] text-gray-600 hover:text-black transition-colors"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            ) : (
              <div ref={searchRef} className="relative">
                {/* Input row */}
                <div className="flex items-center border-b border-black/15 pb-2">
                  <Search size={14} className="text-gray-400 mr-3 shrink-0" strokeWidth={1.5} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="SEARCH OUR COLLECTION..."
                    className="w-full bg-transparent text-sm text-gray-700 font-light tracking-[0.15em] outline-none placeholder:text-gray-400 uppercase"
                  />
                  <button
                    onClick={closeSearch}
                    className="ml-3 hover:rotate-90 transition-transform duration-300 shrink-0"
                  >
                    <X size={16} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Dropdown — sits below the navbar, full width of the search bar */}
                {showDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-3 bg-white rounded-2xl shadow-xl border border-black/5 z-50 overflow-hidden">
                    <div className="grid grid-cols-2 gap-0 divide-x divide-black/5">

                      {/* Suggestions */}
                      <div className="p-5">
                        <h4 className="text-[9px] tracking-[0.25em] text-gray-400 mb-4 uppercase">
                          Suggestions
                        </h4>
                        {filteredSuggestions.length > 0 ? (
                          <ul className="space-y-2.5">
                            {filteredSuggestions.slice(0, 5).map((s, i) => (
                              <li
                                key={i}
                                onClick={() => setSearchQuery(s)}
                                className="flex items-center gap-2 text-xs text-gray-700 font-light hover:translate-x-1 transition-transform cursor-pointer"
                              >
                                <Search size={10} className="text-gray-300" strokeWidth={1.5} />
                                {s}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-[10px] text-gray-300 tracking-widest">No suggestions</p>
                        )}
                      </div>

                      {/* Top matches */}
                      <div className="p-5">
                        <h4 className="text-[9px] tracking-[0.25em] text-gray-400 mb-4 uppercase">
                          {loading
                            ? "Searching…"
                            : `Top Matches${filteredProducts.length > 0 ? ` (${filteredProducts.length})` : ""}`}
                        </h4>

                        {loading ? (
                          <div className="space-y-3">
                            {[1, 2].map((i) => (
                              <div key={i} className="flex gap-3 animate-pulse">
                                <div className="w-10 h-12 bg-gray-100 rounded-lg shrink-0" />
                                <div className="flex flex-col justify-center gap-1.5">
                                  <div className="h-1.5 w-24 bg-gray-100 rounded" />
                                  <div className="h-1.5 w-14 bg-gray-100 rounded" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : filteredProducts.length > 0 ? (
                          <div className="space-y-3">
                            {filteredProducts.slice(0, 3).map((p) => (
                              <div
                                key={p.id}
                                onClick={() => { router.push(`/products/${p.id}`); closeSearch(); }}
                                className="flex gap-3 group cursor-pointer"
                              >
                                <div className="w-10 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                                  <img
                                    src={(p as any).image || (p as any).images?.[0]}
                                    alt={p.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                </div>
                                <div className="flex flex-col justify-center">
                                  <p className="text-[10px] text-gray-700 tracking-wider uppercase leading-tight mb-0.5">
                                    {p.name}
                                  </p>
                                  <p className="text-[9px] text-gray-400">View Product →</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-gray-300 tracking-widest">
                            No results for "{searchQuery}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Right — actions */}
            <div className="flex items-center justify-end gap-4 md:gap-6">
              {!searchOpen && (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="transition-transform duration-300 hover:scale-110 text-black"
                >
                  <Search size={20} strokeWidth={1.5} />
                </button>
              )}

              {/* Auth-aware user button */}
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="transition-transform duration-300 hover:scale-105"
                  >
                    {userProfile?.photoURL ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-offset-1">
                        <Image src={userProfile.photoURL} alt="avatar" width={32} height={32} className="object-cover" />
                      </div>
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-black"
                        style={{ backgroundColor: theme.colors.primary }}
                      >
                        {initials}
                      </div>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => router.push("/auth/login")}
                    className="transition-transform duration-300 hover:scale-110 text-black"
                  >
                    <User size={20} strokeWidth={1.5} />
                  </button>
                )}

                {/* User dropdown */}
                {userMenuOpen && user && (
                  <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-xs font-bold truncate" style={{ color: theme.colors.dark }}>
                        {userProfile?.displayName ?? user.email}
                      </p>
                      <p className="text-[10px] opacity-40 truncate">{user.email}</p>
                    </div>
                    <button onClick={() => { setUserMenuOpen(false); router.push("/account"); }}
                      className="w-full text-left px-4 py-3 text-xs font-semibold hover:bg-gray-50 transition-colors text-gray-600">
                      My Account
                    </button>
                    <button onClick={() => { setUserMenuOpen(false); router.push("/account/orders"); }}
                      className="w-full text-left px-4 py-3 text-xs font-semibold hover:bg-gray-50 transition-colors text-gray-600">
                      Orders
                    </button>
                    <button onClick={() => { setUserMenuOpen(false); router.push("/account/wishlist"); }}
                      className="w-full text-left px-4 py-3 text-xs font-semibold hover:bg-gray-50 transition-colors text-gray-600">
                      Wishlist
                    </button>
                    <button
                      onClick={() => { setUserMenuOpen(false); setShowSignOutModal(true); }}
                      className="w-full text-left px-4 py-3 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 border-t border-gray-50"
                    >
                      <LogOut size={12} /> Sign Out
                    </button>
                  </div>
                )}
              </div>

              <button onClick={() => setCartOpen(true)} className="relative transition-transform duration-300 hover:scale-110 text-black">
                <ShoppingCart size={20} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span
                    style={{ backgroundColor: theme.colors.primary }}
                    className="absolute -top-2 -right-2 text-[9px] w-4 h-4 flex items-center justify-center rounded-full text-white border border-white/20"
                  >
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Sign out modal ───────────────────────────────────────────────── */}
      {showSignOutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowSignOutModal(false)}
          />
          <div className="relative bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: `${theme.colors.pink}15` }}
              >
                <LogOut size={28} style={{ color: theme.colors.pink }} />
              </div>
              <h3 className="text-xl font-serif mb-2" style={{ color: theme.colors.dark }}>
                Sign Out?
              </h3>
              <p className="text-sm text-gray-500 font-light leading-relaxed mb-8">
                Are you sure you want to sign out of your <br />
                <strong>Nailsa</strong> account?
              </p>
              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={handleConfirmLogout}
                  className="w-full py-4 rounded-2xl text-white text-xs font-bold uppercase tracking-widest transition-transform active:scale-95 shadow-lg shadow-black/10"
                  style={{ backgroundColor: theme.colors.dark }}
                >
                  Yes, Sign Me Out
                </button>
                <button
                  onClick={() => setShowSignOutModal(false)}
                  className="w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-colors hover:bg-gray-50"
                  style={{ color: theme.colors.muted }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
