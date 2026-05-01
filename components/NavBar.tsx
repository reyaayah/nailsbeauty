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

const announcements = [
  "FREE SHIPPING ON ORDERS OVER $75",
  "NEW SUMMER COLLECTION IS HERE",
  "BUY 3 GET 1 FREE BUNDLES",
];

const allSuggestions = [
  "nails short almond", "almond", "medium almond", "almond blue",
  "All", "coffin long", "oval pink", "square french",
];

const allProducts = [
  { id: 1, name: "Bloomwave - medium almond", image: "/product1.png" },
  { id: 2, name: "Dark Blood", image: "/product2.png" },
  { id: 3, name: "Lush Green", image: "/product3.png" },
  { id: 4, name: "Spiced Bloom", image: "/product2.png" },
  { id: 5, name: "Rich Girl", image: "/product1.png" },
  { id: 6, name: "Candy Blossom", image: "/product3.png" },
];

const navItems = [
  { name: "New Arrivals", href: "#new-arrivals" },
  { name: "Shop All", href: "/products" },
  { name: "Bundles", href: "#bundles" },
  { name: "Best Sellers", href: "#best-sellers" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { totalItems } = useCart();
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleNav = (href: string) => {
    if (href.startsWith("#")) {
      if (pathname !== "/") {
        router.push(`/${href}`);
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(href);
    }
  };

  const filteredSuggestions = searchQuery.trim()
    ? allSuggestions.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const filteredProducts = searchQuery.trim()
    ? allProducts.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const showDropdown =
    searchOpen &&
    searchQuery.trim().length > 0 &&
    (filteredSuggestions.length > 0 || filteredProducts.length > 0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 100);
  }, [searchOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); setUserMenuOpen(false); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const closeSearch = () => { setSearchOpen(false); setSearchQuery(""); };

  const initials = userProfile?.displayName
    ? userProfile.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "GG";

  return (
    <>
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} onFilterSelect={(category, value) => {
        router.push(`/products?${category}=${value}`);
      }} />

      <header className="fixed top-0 left-0 w-full z-40 transition-all duration-300">
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
            ${searchOpen ? "bg-white py-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]" : "bg-white/60 backdrop-blur-md py-6"}
          `}
        >
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between">

            {/* Left */}
            <div className="flex flex-1 items-center gap-4">
              <button onClick={() => setIsOpen(true)} className="group flex items-center gap-2 overflow-hidden">
                <div className="relative w-6 h-6 flex flex-col justify-center gap-1">
                  <span className="h-[1px] w-6 transition-all duration-300 bg-black group-hover:w-4" />
                  <span className="h-[1px] w-4 transition-all duration-300 bg-black group-hover:w-6" />
                </div>
                <span className="hidden md:block text-[10px] tracking-[0.3em] uppercase text-black">Menu</span>
              </button>

              <div onClick={() => router.push("/")} className="flex flex-col leading-none cursor-pointer">
                <h1 className="text-lg md:text-xl text-[#c28c8d] font-black tracking-tighter uppercase whitespace-nowrap">
                  Gloss <span className="font-light italic text-gray-400">&</span> Grace
                </h1>
                <span className="text-[7px] tracking-[0.4em] text-gray-400 ml-0.5 uppercase">Aesthetics Studio</span>
              </div>
            </div>

            {/* Center nav */}
            <div className="hidden lg:flex flex-1 justify-center items-center gap-4">
              {navItems.map((item) => (
                <a key={item.name} onClick={() => handleNav(item.href)} href={item.href}
                  className="group relative text-[11px] font-bold uppercase tracking-[0.15em] text-gray-600 hover:text-black transition-colors">
                  {item.name}
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex flex-1 items-center justify-end gap-4 md:gap-8">
              <button onClick={() => setSearchOpen(true)} className="transition-transform duration-300 hover:scale-110 text-black">
                <Search size={20} strokeWidth={1.5} />
              </button>

              {/* ── Auth-aware user button ── */}
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="transition-transform duration-300 hover:scale-105"
                  >
                    {userProfile?.photoURL ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-offset-1"
                      // style={{
                      // ringColor: theme.colors.primary

                      //  }}
                      >
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
                  <button onClick={() => router.push("/auth/login")} className="transition-transform duration-300 hover:scale-110 text-black">
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
                    <button
                      onClick={() => { setUserMenuOpen(false); router.push("/account"); }}
                      className="w-full text-left px-4 py-3 text-xs font-semibold hover:bg-gray-50 transition-colors text-gray-600"
                    >
                      My Account
                    </button>
                    <button
                      onClick={() => { setUserMenuOpen(false); router.push("/account/orders"); }}
                      className="w-full text-left px-4 py-3 text-xs font-semibold hover:bg-gray-50 transition-colors text-gray-600"
                    >
                      Orders
                    </button>
                    <button
                      onClick={() => { setUserMenuOpen(false); router.push("/account/wishlist"); }}
                      className="w-full text-left px-4 py-3 text-xs font-semibold hover:bg-gray-50 transition-colors text-gray-600"
                    >
                      Wishlist
                    </button>
                    <button
                      onClick={async () => { setUserMenuOpen(false); await logout(); router.push("/"); }}
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

          {/* Search overlay */}
          <div className={`absolute inset-x-0 top-0 bg-white transform transition-transform duration-500 ease-out ${searchOpen ? "translate-y-0" : "-translate-y-full"} z-10 shadow-xl`}>
            <div className="max-w-4xl mx-auto px-6 py-12">
              <div className="flex items-center border-b border-black/10 pb-4">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH OUR COLLECTION..."
                  className="w-full bg-transparent text-xl text-gray-500 font-light tracking-[0.2em] outline-none placeholder:text-gray-800 uppercase"
                />
                <button onClick={closeSearch} className="ml-4 hover:rotate-90 transition-transform duration-300">
                  <X size={24} strokeWidth={1} />
                </button>
              </div>
              {showDropdown && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-[10px] tracking-[0.2em] text-gray-800 mb-6 uppercase">Suggestions</h4>
                    <ul className="space-y-4">
                      {filteredSuggestions.map((s, i) => (
                        <li key={i} className="text-sm text-gray-800 font-light hover:translate-x-2 transition-transform cursor-pointer" onClick={() => setSearchQuery(s)}>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] tracking-[0.2em] text-gray-800 mb-6 uppercase">Top Matches</h4>
                    <div className="space-y-6">
                      {filteredProducts.slice(0, 3).map((p) => (
                        <div key={p.id} className="flex gap-4 group cursor-pointer">
                          <div className="w-16 h-20 bg-gray-50 overflow-hidden">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex flex-col justify-center">
                            <p className="text-xs text-gray-600 tracking-widest uppercase mb-1">{p.name}</p>
                            <p className="text-[10px] text-gray-900">View Product —</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {searchOpen && <div className="fixed inset-0 z-30" onClick={closeSearch} />}
    </>
  );
}
