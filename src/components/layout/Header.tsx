"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Flame,
  Gift,
  Heart,
} from "lucide-react";

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCart = useCartStore((s) => s.toggleCart);
  const totalItemsCount = useCartStore((s) => s.getTotalItemsCount());
  const wishlistCount = useWishlistStore((s) => s.itemIds.length);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  interface NavItem {
    name: string;
    href: string;
    highlight?: boolean;
  }

  const leftNav: NavItem[] = [
    { name: "Candles", href: "/shop" },
    { name: "Diwali", href: "/shop?collection=diwali-bestsellers" },
    { name: "Surprise Inside", href: "/surprise", highlight: true },
  ];

  const rightNav: NavItem[] = [
    { name: "Our Story", href: "/about" },
    { name: "Track Order", href: "/track-order" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 border-b border-[#D9A441]/20 ${
          isScrolled
            ? "bg-[#1A0F0A]/95 backdrop-blur-md py-3.5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "bg-[#1A0F0A]/85 backdrop-blur-sm py-4"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#F8EFE6] hover:text-[#F28A3D] transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Left Nav (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 flex-1 justify-start">
            {leftNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-all relative py-1 hover:text-[#F28A3D] ${
                  link.highlight
                    ? "text-[#F28A3D] flex items-center gap-1.5 font-medium"
                    : "text-[#F8EFE6] font-normal"
                }`}
              >
                {link.highlight && (
                  <Gift className="w-3.5 h-3.5 text-[#F28A3D]" />
                )}
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Center Brand Logo (Desktop & Mobile) */}
          <div className="flex-shrink-0 text-center">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <span className="font-display text-2xl md:text-3xl tracking-wide text-[#F8EFE6] group-hover:text-[#F28A3D] transition-colors font-light">
                {siteConfig.brandName}
              </span>
            </Link>
          </div>

          {/* Right Nav & Actions (Desktop) */}
          <div className="flex items-center gap-5 flex-1 justify-end">
            <nav className="hidden lg:flex items-center gap-7 mr-2">
              {rightNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-normal text-[#F8EFE6] hover:text-[#F28A3D] transition-colors tracking-wide"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#F8EFE6] hover:text-[#F28A3D] transition-colors relative"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/shop"
              className="p-2 text-[#F8EFE6] hover:text-[#F28A3D] transition-colors relative hidden sm:block"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#F28A3D] text-[#1A0F0A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon / Button */}
            <button
              onClick={toggleCart}
              className="flex items-center gap-2 bg-[#241510] border border-[#D9A441]/30 hover:border-[#F28A3D] px-3.5 py-1.5 rounded-full transition-all group shadow-sm"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#F28A3D] group-hover:scale-110 transition-transform" />
                {mounted && totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#F28A3D] text-[#1A0F0A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-medium text-[#F8EFE6]">
                Cart
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 mt-3 pb-2 animate-fadeIn">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/shop?search=${encodeURIComponent(
                    searchQuery.trim()
                  )}`;
                }
              }}
              className="relative max-w-xl mx-auto"
            >
              <input
                type="text"
                placeholder="Search scents (e.g. Chandan, Kesar, Mogra, Rose)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-[#241510] border border-[#D9A441]/40 text-[#F8EFE6] px-5 py-2.5 pl-11 text-sm rounded-full placeholder-[#CDB8A6]/60 focus:outline-none focus:border-[#F28A3D] shadow-inner"
              />
              <Search className="absolute left-4 top-3 w-4 h-4 text-[#CDB8A6]" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bg-[#F28A3D] text-[#1A0F0A] px-4 py-1.5 text-xs font-semibold rounded-full shadow-sm hover:bg-[#ff9d55] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#1A0F0A] border-r border-[#D9A441]/20 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[#D9A441]/20">
                <span className="font-display text-2xl text-[#F8EFE6] font-light">
                  {siteConfig.brandName}
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#F8EFE6] hover:text-[#F28A3D]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-2 mt-5">
                {[...leftNav, ...rightNav].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base text-[#F8EFE6] hover:text-[#F28A3D] py-3 border-b border-[#D9A441]/10 flex items-center justify-between font-normal"
                  >
                    <span className="flex items-center gap-2">
                      {link.highlight && <Gift className="w-4 h-4 text-[#F28A3D]" />}
                      {link.name}
                    </span>
                    {link.highlight && (
                      <span className="badge-pill bg-[#F28A3D]/20 text-[#F28A3D] border border-[#F28A3D]/40 text-[10px]">
                        NEW
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#D9A441]/20 text-xs text-[#CDB8A6]">
              <p className="font-medium text-[#F8EFE6] mb-1">
                Handcrafted Festive Candles
              </p>
              <p className="italic font-accent text-sm text-[#CDB8A6]">Poured with devotion in Kolkata.</p>
              <p className="mt-2 text-[#F28A3D] font-medium">
                {siteConfig.contact.phone}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
