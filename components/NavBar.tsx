"use client";

import { useEffect, useState, useRef } from "react";
import { Search, ShoppingCart, User, X, LogOut } from "lucide-react";
import Sidebar from "./SideBar";
import CartSidebar from "./Cart";
import theme from "@/theme";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/hooks/useProducts";

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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);

  const { totalItems } = useCart();
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { products, loading } = useProducts();

  // Track breakpoint so we can split mobile vs desktop search
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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

  const showDesktopDropdown = searchOpen && isDesktop && q.length > 0;

  // Focus correct input when search opens
  useEffect(() => {
    if (!searchOpen) { setSearchQuery(""); return; }
    const ref = isDesktop ? desktopSearchInputRef : mobileSearchInputRef;
    const t = setTimeout(() => ref.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [searchOpen, isDesktop]);

  // Lock body scroll while mobile overlay is up
  useEffect(() => {
    document.body.style.overflow = (searchOpen && !isDesktop) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen, isDesktop]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeSearch(); setUserMenuOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close desktop search / user menu on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setUserMenuOpen(false);
      if (isDesktop && desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node))
        closeSearch();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [isDesktop]);

  const initials = userProfile?.displayName
    ? userProfile.displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "GG";

  /* ─────────────────────────────────────────────────────────────────────────
     Reusable search results for mobile overlay
  ───────────────────────────────────────────────────────────────────────── */
  const MobileSearchResults = () => (
    <div className="flex-1 overflow-y-auto">
      {q.length > 0 ? (
        <div className="divide-y divide-black/5">
          {/* Suggestions */}
          <div className="px-5 py-5">
            <h4 className="text-[9px] tracking-[0.25em] text-gray-400 mb-4 uppercase">Suggestions</h4>
            {filteredSuggestions.length > 0 ? (
              <ul className="space-y-3">
                {filteredSuggestions.slice(0, 5).map((s, i) => (
                  <li
                    key={i}
                    onClick={() => setSearchQuery(s)}
                    className="flex items-center gap-3 text-sm text-gray-700 font-light cursor-pointer py-1 active:opacity-60"
                  >
                    <Search size={12} className="text-gray-300 shrink-0" strokeWidth={1.5} />
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[10px] text-gray-300 tracking-widest">No suggestions</p>
            )}
          </div>

          {/* Product matches */}
          <div className="px-5 py-5">
            <h4 className="text-[9px] tracking-[0.25em] text-gray-400 mb-4 uppercase">
              {loading ? "Searching…" : `Top Matches${filteredProducts.length > 0 ? ` (${filteredProducts.length})` : ""}`}
            </h4>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-12 h-14 bg-gray-100 rounded-xl shrink-0" />
                    <div className="flex flex-col justify-center gap-2">
                      <div className="h-2 w-28 bg-gray-100 rounded" />
                      <div className="h-2 w-16 bg-gray-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="space-y-4">
                {filteredProducts.slice(0, 6).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => { router.push(`/products/${p.id}`); closeSearch(); }}
                    className="flex gap-3 cursor-pointer active:opacity-60"
                  >
                    <div className="w-12 h-14 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={(p as any).image || (p as any).images?.[0]}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-xs text-gray-700 tracking-wider uppercase leading-tight mb-1">{p.name}</p>
                      <p className="text-[10px] text-gray-400">View Product →</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-gray-300 tracking-widest">No results for "{searchQuery}"</p>
            )}
          </div>
        </div>
      ) : (
        /* Empty state — popular searches chips */
        <div className="px-5 py-5">
          <h4 className="text-[9px] tracking-[0.25em] text-gray-400 mb-4 uppercase">Popular Searches</h4>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => setSearchQuery(s)}
                className="px-3 py-1.5 text-[10px] tracking-widest uppercase border border-black/10 rounded-full text-gray-600 active:bg-black active:text-white transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Sidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onFilterSelect={(category, value) => router.push(`/products?${category}=${value}`)}
      />

      {/* ── Mobile Search Full-Screen Overlay ───────────────────────────────
           Rendered at the very top of the DOM tree so nothing clips it.
           Only mounts on mobile (< lg) when searchOpen is true.
      ──────────────────────────────────────────────────────────────────── */}
      {searchOpen && !isDesktop && (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
          {/* Search bar header */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-black/8 shrink-0">
            <Search size={16} className="text-gray-400 shrink-0" strokeWidth={1.5} />
            <input
              ref={mobileSearchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH OUR COLLECTION..."
              className="flex-1 min-w-0 bg-transparent text-sm text-gray-700 font-light tracking-[0.12em] outline-none placeholder:text-gray-400 uppercase"
            />
            <button
              onClick={closeSearch}
              className="ml-1 shrink-0 p-1 active:opacity-60"
              aria-label="Close search"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>

          <MobileSearchResults />
        </div>
      )}

      {/* ── Navbar bar ──────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-40">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-md shadow-sm transition-all duration-500">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
            {/*
              Flex layout — logo is absolutely centered so it's truly centred
              regardless of how many icons are on the right.
              Right icon group uses ml-auto to always hug the right edge.
            */}
            <div className="relative flex items-center py-4 md:py-6">

              {/* ── Left: hamburger + logo ──────────────────────────────── */}
              <div className="flex items-center gap-3 z-10 shrink-0">
                <button onClick={() => setIsOpen(true)} className="group flex items-center gap-2" aria-label="Menu">
                  <div className="relative w-6 h-6 flex flex-col justify-center gap-1">
                    <span className="h-[1px] w-6 bg-black transition-all duration-300 group-hover:w-4" />
                    <span className="h-[1px] w-4 bg-black transition-all duration-300 group-hover:w-6" />
                  </div>
                  <span className="hidden md:block text-[10px] tracking-[0.3em] uppercase text-black">Menu</span>
                </button>

                <div
                  onClick={() => router.push("/")}
                  className="flex flex-col leading-none cursor-pointer"
                >
                  <h1 className="text-base sm:text-lg md:text-xl text-[#c28c8d] font-black tracking-tighter uppercase whitespace-nowrap">
                    Nailsa
                  </h1>
                  <span className="hidden sm:block text-[7px] tracking-[0.4em] text-gray-400 ml-0.5 uppercase">
                    Beauty at your fingertips
                  </span>
                </div>
              </div>



              {/* Desktop nav links — only lg+, centred via own absolute container */}
              <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center z-10 pt-0">
                {!searchOpen ? (
                  /* Push nav links down slightly so they don't clash with the logo
                     (logo is already centred; on lg we hide the logo text above
                     and show nav links here instead) */
                  <div className="flex items-center gap-4">
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
                  <div ref={desktopSearchRef} className="relative w-[360px] xl:w-[460px]">
                    <div className="flex items-center border-b border-black/15 pb-2">
                      <Search size={14} className="text-gray-400 mr-3 shrink-0" strokeWidth={1.5} />
                      <input
                        ref={desktopSearchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="SEARCH OUR COLLECTION..."
                        className="w-full bg-transparent text-sm text-gray-700 font-light tracking-[0.15em] outline-none placeholder:text-gray-400 uppercase"
                      />
                      <button onClick={closeSearch} className="ml-3 hover:rotate-90 transition-transform duration-300 shrink-0">
                        <X size={16} strokeWidth={1.5} />
                      </button>
                    </div>

                    {showDesktopDropdown && (
                      <div className="absolute left-0 right-0 top-full mt-3 bg-white rounded-2xl shadow-xl border border-black/5 z-50 overflow-hidden">
                        <div className="grid grid-cols-2 divide-x divide-black/5">
                          <div className="p-5">
                            <h4 className="text-[9px] tracking-[0.25em] text-gray-400 mb-4 uppercase">Suggestions</h4>
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
                          <div className="p-5">
                            <h4 className="text-[9px] tracking-[0.25em] text-gray-400 mb-4 uppercase">
                              {loading ? "Searching…" : `Top Matches${filteredProducts.length > 0 ? ` (${filteredProducts.length})` : ""}`}
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
                                      <p className="text-[10px] text-gray-700 tracking-wider uppercase leading-tight mb-0.5">{p.name}</p>
                                      <p className="text-[9px] text-gray-400">View Product →</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[10px] text-gray-300 tracking-widest">No results for "{searchQuery}"</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Right: action icons — ml-auto pins them to the far right ── */}
              <div className="flex items-center gap-4 sm:gap-5 md:gap-6 ml-auto z-10 shrink-0">

                {/* Search */}
                <button
                  onClick={() => setSearchOpen(true)}
                  className="transition-transform hover:scale-110 active:scale-95 text-black"
                  aria-label="Search"
                >
                  <Search size={20} strokeWidth={1.5} />
                </button>

                {/* User */}
                <div className="relative" ref={userMenuRef}>
                  {user ? (
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="transition-transform hover:scale-105"
                      aria-label="Account"
                    >
                      {userProfile?.photoURL ? (
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden ring-2 ring-offset-1">
                          <Image src={userProfile.photoURL} alt="avatar" width={32} height={32} className="object-cover" />
                        </div>
                      ) : (
                        <div
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-[10px] font-black"
                          style={{ backgroundColor: theme.colors.primary }}
                        >
                          {initials}
                        </div>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push("/auth/login")}
                      className="transition-transform hover:scale-110 active:scale-95 text-black"
                      aria-label="Login"
                    >
                      <User size={20} strokeWidth={1.5} />
                    </button>
                  )}

                  {userMenuOpen && user && (
                    <div className="absolute right-0 top-10 sm:top-12 w-48 sm:w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-xs font-bold truncate" style={{ color: theme.colors.dark }}>
                          {userProfile?.displayName ?? user.email}
                        </p>
                        <p className="text-[10px] opacity-40 truncate">{user.email}</p>
                      </div>
                      {[
                        { label: "My Account", href: "/account" },
                        { label: "Orders", href: "/account/orders" },
                        { label: "Wishlist", href: "/account/wishlist" },
                      ].map(({ label, href }) => (
                        <button
                          key={href}
                          onClick={() => { setUserMenuOpen(false); router.push(href); }}
                          className="w-full text-left px-4 py-3 text-xs font-semibold hover:bg-gray-50 active:bg-gray-50 transition-colors text-gray-600"
                        >
                          {label}
                        </button>
                      ))}
                      <button
                        onClick={() => { setUserMenuOpen(false); setShowSignOutModal(true); }}
                        className="w-full text-left px-4 py-3 text-xs font-semibold text-red-500 hover:bg-red-50 active:bg-red-50 transition-colors flex items-center gap-2 border-t border-gray-50"
                      >
                        <LogOut size={12} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>

                {/* Cart */}
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative transition-transform hover:scale-110 active:scale-95 text-black"
                  aria-label="Cart"
                >
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
          </div>
        </nav>
      </header>

      {/* ── Sign out modal ─────────────────────────────────────────────────── */}
      {showSignOutModal && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowSignOutModal(false)}
          />
          <div className="relative bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="sm:hidden w-10 h-1 bg-gray-200 rounded-full mb-6" />
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-5 sm:mb-6"
                style={{ backgroundColor: `${theme.colors.pink}15` }}
              >
                <LogOut size={24} style={{ color: theme.colors.pink }} />
              </div>
              <h3 className="text-xl font-serif mb-2" style={{ color: theme.colors.dark }}>Sign Out?</h3>
              <p className="text-sm text-gray-500 font-light leading-relaxed mb-7 sm:mb-8">
                Are you sure you want to sign out of your <strong>Nailsa</strong> account?
              </p>
              <div className="flex flex-col w-full gap-3 pb-safe">
                <button
                  onClick={handleConfirmLogout}
                  className="w-full py-4 rounded-2xl text-white text-xs font-bold uppercase tracking-widest transition-transform active:scale-95 shadow-lg shadow-black/10"
                  style={{ backgroundColor: theme.colors.dark }}
                >
                  Yes, Sign Me Out
                </button>
                <button
                  onClick={() => setShowSignOutModal(false)}
                  className="w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 active:bg-gray-50 transition-colors"
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