"use client";

import { useEffect, useState, useRef } from "react";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import Sidebar from "./SideBar";
import CartSidebar from "./Cart";

const announcements = [
  "BUY $99 GET 10% OFF | CODE: VACAYREADY10",
  "FREE SHIPPING ON ORDERS OVER $50",
  "NEW SUMMER COLLECTION OUT NOW 🌸",
];

// Replace with your actual data / API call
const allSuggestions = [
  "nails short almond",
  "almond",
  "medium almond",
  "almond blue",
  "All",
  "almond",
  "coffin long",
  "oval pink",
  "square french",
];

const allProducts = [
  { id: 1, name: "Bloomwave - medium almond", image: "/product1.png" },
  { id: 2, name: "Dark Blood", image: "/product2.png" },
  { id: 3, name: "Lush Green", image: "/product3.png" },
  { id: 4, name: "Spiced Bloom", image: "/product2.png" },
  { id: 5, name: "Rich Girl", image: "/product1.png" },
  { id: 6, name: "Candy Blossom", image: "/product3.png" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = searchQuery.trim()
    ? allSuggestions.filter((s) =>
      s.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  const filteredProducts = searchQuery.trim()
    ? allProducts.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  const showDropdown =
    searchOpen &&
    searchQuery.trim().length > 0 &&
    (filteredSuggestions.length > 0 || filteredProducts.length > 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === announcements.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const showBg = scrolled || hovered;

  return (
    <>
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <header
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="fixed top-0 left-0 w-full z-40 transition-all duration-300"
      >
        {/* Announcement Bar */}
        <div className="text-center text-xs py-2 tracking-wide bg-black text-white">
          <div className="relative h-4 overflow-hidden">
            {announcements.map((text, index) => (
              <div
                key={index}
                className={`absolute w-full transition-all duration-500 ${index === currentIndex
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4"
                  }`}
              >
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Main Navbar */}
        <div
          className={`relative flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-300 ${showBg || searchOpen
            ? "bg-white text-black shadow-md"
            : "bg-transparent text-white"
            }`}
        >
          <button onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>

          <h1 className="text-xl md:text-2xl font-serif tracking-wide">
            Ersa Nails
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:block">USD$</span>
            <button onClick={() => setSearchOpen((prev) => !prev)}>
              <Search size={20} />
            </button>
            <button onClick={() => setCartOpen(true)}>
              <ShoppingCart size={20} />
            </button>
          </div>

          {/* Search bar + dropdown */}
          <div
            className={`absolute left-0 right-0 top-full transition-all h-12 duration-300 ${searchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              } bg-white shadow-sm`}
          >
            {/* Input row — centered */}
            <div className="flex justify-center px-6 py-3 border-t border-gray-100">
              <div className="flex items-center gap-3 w-full max-w-lg">
                <Search size={18} className="text-gray-500 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      console.log("Search:", searchQuery);
                    }
                  }}
                  placeholder="Search"
                  className="flex-1 bg-transparent text-black text-sm outline-none placeholder-gray-400"
                />
                <button onClick={closeSearch} className="text-gray-400 hover:text-black transition">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Dropdown — same max-w as input, centered */}
            {showDropdown && (
              <div className="flex justify-center px-6 pb-4">
                <div className="w-full max-w-lg bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden">
                  <div className="max-h-[60vh] overflow-y-auto">
                    {/* Suggestions */}
                    {filteredSuggestions.length > 0 && (
                      <ul className="px-4 pt-4 pb-2 space-y-3">
                        {filteredSuggestions.map((s, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => setSearchQuery(s)}
                          >
                            <Search size={14} className="text-gray-400 shrink-0" />
                            <span className="text-sm text-gray-800 group-hover:text-black">
                              {s}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Products */}
                    {filteredProducts.length > 0 && (
                      <div className="px-4 pb-4">
                        <p className="text-xs font-bold tracking-widest text-gray-800 mb-3 mt-2">
                          PRODUCTS
                        </p>
                        <hr className="border-gray-200 mb-4" />
                        <ul className="space-y-4 mb-4">
                          {filteredProducts.map((p) => (
                            <li
                              key={p.id}
                              className="flex items-center gap-4 cursor-pointer group"
                              onClick={() => console.log("Go to product:", p.name)}
                            >
                              <div className="w-12 h-12 rounded bg-gray-100 shrink-0 overflow-hidden">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-sm text-gray-800 group-hover:text-black">
                                {p.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Footer — pinned outside scroll area */}
                  {filteredProducts.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => console.log("View all:", searchQuery)}
                          className="text-sm text-gray-800 hover:text-black transition"
                        >
                          View All Results
                        </button>
                        <span className="text-xs text-gray-400">Press enter</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Overlay to close search when clicking outside */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={closeSearch}
        />
      )}
    </>
  );
}