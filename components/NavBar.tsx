"use client";

import { useEffect, useState } from "react";
import { Menu, Search, ShoppingCart } from "lucide-react";
import Sidebar from "./SideBar";
const announcements = [
  "BUY $99 GET 10% OFF | CODE: VACAYREADY10",
  "FREE SHIPPING ON ORDERS OVER $50",
  "NEW SUMMER COLLECTION OUT NOW 🌸",
];
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === announcements.length - 1 ? 0 : prev + 1
      );
    }, 3000); // change every 3 sec

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showBg = scrolled || hovered;

  return (
    <>
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <header
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      >
        {/* Top Announcement Bar */}
        <div
          className={`text-center text-xs py-2 tracking-wide transition  bg-black text-white
            `}
        >
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
          className={`flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-300 ${showBg
            ? "bg-white text-black shadow-md backdrop-blur-md "
            : "bg-transparent text-white "
            }`}
        >
          {/* Left */}
          <button onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>

          {/* Center */}
          <h1 className="text-xl md:text-2xl font-serif tracking-wide">
            Ersa Nails
          </h1>

          {/* Right */}
          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:block">USD$</span>

            <button>
              <Search size={20} />
            </button>

            <button>
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </header></>
  );
}