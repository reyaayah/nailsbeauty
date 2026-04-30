"use client";

import { useEffect, useState, useRef } from "react";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Sidebar from "./SideBar";
import CartSidebar from "./Cart";
import theme from "@/theme";

const announcements = [
  "FREE SHIPPING ON ORDERS OVER $75",
  "NEW SUMMER COLLECTION IS HERE",
  "BUY 3 GET 1 FREE BUNDLES",
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
const navItems = [
  { name: 'New Arrivals', href: '#new-arrivals' },
  { name: 'Shop All', href: '#shop-all' },
  { name: 'Bundles', href: '#bundles' },
  { name: 'Best Sellers', href: '#best-sellers' }, 
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
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
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


  return (
    <>
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <header
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="fixed top-0 left-0 w-full z-40 transition-all duration-300  "
      >



        {/* Main Navbar Wrapper */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white/60 ease-in-out ${searchOpen
            ? "bg-white backdrop-blur-md py-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]"
            : "bg-transparent py-6"
            }`}
        >
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between">
  
  <div className="flex flex-1 items-center gap-4">
    <button
      onClick={() => setIsOpen(true)}
      className="group flex items-center gap-2 overflow-hidden"
    >
      <div className="relative w-6 h-6 flex flex-col justify-center gap-1">
        <span className="h-[1px] w-6 transition-all duration-300 bg-black group-hover:w-4" />
        <span className="h-[1px] w-4 transition-all duration-300 bg-black group-hover:w-6" />
      </div>
      <span className="hidden md:block text-[10px] tracking-[0.3em] uppercase text-black">
        Menu
      </span>
    </button>

    <div className="flex flex-col leading-none">
      <h1
        className="text-lg md:text-xl text-[#c28c8d] font-black tracking-tighter uppercase whitespace-nowrap"
      >
        Gloss <span className="font-light italic text-gray-400">&</span> Grace
      </h1>
      <span className="text-[7px] tracking-[0.4em] text-gray-400 ml-0.5 uppercase">
        Aesthetics Studio
      </span>
    </div>
  </div>


<div className="hidden lg:flex flex-1 justify-center items-center gap-4">
  {navItems.map((item) => (
    <a
      key={item.name}
      href={item.href} // This points to the ID
      className="group relative text-[11px] font-bold uppercase tracking-[0.15em] text-gray-600 hover:text-black transition-colors"
    >
      {item.name}
      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  ))}
</div>

  {/* 3. Right Section: Actions (Width: 1/3) */}
  <div className="flex flex-1 items-center justify-end gap-4 md:gap-8">
    <button
      onClick={() => setSearchOpen(true)}
      className="transition-transform duration-300 hover:scale-110 text-black"
    >
      <Search size={20} strokeWidth={1.5} />
    </button>
    <button className="transition-transform duration-300 hover:scale-110 text-black">
      <User size={20} strokeWidth={1.5} />
    </button>
    <button
      onClick={() => setCartOpen(true)}
      className="relative transition-transform duration-300 hover:scale-110 text-black"
    >
      <ShoppingCart size={20} strokeWidth={1.5} />
      <span
        style={{ backgroundColor: theme.colors.primary }}
        className="absolute -top-2 -right-2 text-[9px] w-4 h-4 flex items-center justify-center rounded-full text-white border border-white/20"
      >
        2
      </span>
    </button>
  </div>

</div>

          {/* Refined Search Overlay (Slide Down) */}
          <div
            className={`absolute inset-x-0 top-0 bg-white transform transition-transform duration-500 ease-out ${searchOpen ? "translate-y-0" : "-translate-y-full"
              } z-10 shadow-xl`}
          >
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

              {/* Live Results Section */}
              {showDropdown && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Suggestions List */}
                  <div>
                    <h4 className="text-[10px] tracking-[0.2em] text-gray-800 mb-6 uppercase">Suggestions</h4>
                    <ul className="space-y-4">
                      {filteredSuggestions.map((s, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-800 font-light hover:translate-x-2 transition-transform cursor-pointer"
                          onClick={() => setSearchQuery(s)}
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Featured Products Mini-Grid */}
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