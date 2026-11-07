"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/shared/Logo";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Flame,
  Gift,
  Heart,
  User as UserIcon,
  LogOut,
  Package,
  MapPin,
  ChevronDown,
  Shield,
} from "lucide-react";

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const { data: session, status } = useSession();

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
    { name: "Spiral Wish", href: "/collections/spiral-wish", highlight: true },
    { name: "Surprise Inside", href: "/surprise" },
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
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 lg:gap-5 xl:gap-8">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#F8EFE6] hover:text-[#F28A3D] transition-colors focus:outline-none shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Left Nav (Desktop) - letter-spaced small caps */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6 shrink-0 justify-start">
            {leftNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] xl:text-xs uppercase tracking-[0.16em] xl:tracking-[0.2em] transition-all relative py-1 hover:text-[#F28A3D] whitespace-nowrap ${
                  link.highlight
                    ? "text-[#F28A3D] flex items-center gap-1.5 font-medium"
                    : "text-[#F8EFE6] font-normal"
                }`}
              >
                {link.highlight && (
                  <Gift className="w-3.5 h-3.5 text-[#F28A3D] shrink-0" />
                )}
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Center Brand Logo (Desktop & Mobile) */}
          <div className="shrink-0 text-center px-2 sm:px-4 lg:px-6">
            <Logo variant="header" theme="dark" />
          </div>

          {/* Right Nav & Actions (Desktop) */}
          <div className="flex items-center gap-2 sm:gap-3 xl:gap-4 shrink-0 justify-end">
            <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 mr-1 xl:mr-2 shrink-0">
              {rightNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] xl:text-xs uppercase tracking-[0.16em] xl:tracking-[0.2em] font-normal text-[#F8EFE6] hover:text-[#F28A3D] transition-colors whitespace-nowrap"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 sm:p-2 text-[#F8EFE6] hover:text-[#F28A3D] transition-colors relative shrink-0"
              aria-label="Search products"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/shop"
              className="p-1.5 sm:p-2 text-[#F8EFE6] hover:text-[#F28A3D] transition-colors relative hidden sm:block shrink-0"
              aria-label="View Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#F28A3D] text-[#1A0F0A] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account / Login Menu */}
            {mounted && (
              status === "authenticated" ? (
                <div className="relative hidden sm:block shrink-0">
                  <button
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    className="flex items-center gap-1.5 p-1.5 text-[#F8EFE6] hover:text-[#F28A3D] transition-colors rounded-full"
                    aria-label="Account menu"
                  >
                    <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </button>

                  {accountMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setAccountMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-52 bg-[#241510] border border-[#D9A441]/30 rounded-2xl shadow-xl py-2 z-40 animate-fadeIn text-xs">
                        <div className="px-4 py-2 border-b border-[#D9A441]/20">
                          <p className="font-medium text-[#F8EFE6] truncate">
                            {session?.user?.name || "Client"}
                          </p>
                          <p className="text-[11px] text-[#CDB8A6]/70 truncate">
                            {session?.user?.email}
                          </p>
                        </div>
                        {session?.user?.role === "ADMIN" && (
                          <Link
                            href="/admin"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-[#D9A441] font-semibold hover:bg-[#1A0F0A] hover:text-[#F28A3D] transition-colors border-b border-[#D9A441]/20"
                          >
                            <Shield className="w-4 h-4 text-[#D9A441]" />
                            <span>Staff Atelier Admin</span>
                          </Link>
                        )}
                        <Link
                          href="/account?tab=orders"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[#F8EFE6] hover:bg-[#1A0F0A] hover:text-[#F28A3D] transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#D9A441]" />
                          <span>Orders</span>
                        </Link>
                        <Link
                          href="/account?tab=addresses"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[#F8EFE6] hover:bg-[#1A0F0A] hover:text-[#F28A3D] transition-colors"
                        >
                          <MapPin className="w-4 h-4 text-[#D9A441]" />
                          <span>Addresses</span>
                        </Link>
                        <Link
                          href="/shop"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[#F8EFE6] hover:bg-[#1A0F0A] hover:text-[#F28A3D] transition-colors"
                        >
                          <Heart className="w-4 h-4 text-[#D9A441]" />
                          <span>Wishlist</span>
                        </Link>
                        <div className="border-t border-[#D9A441]/20 mt-1 pt-1">
                          <button
                            onClick={() => {
                              setAccountMenuOpen(false);
                              signOut({ callbackUrl: "/" });
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-[#F8EFE6] hover:bg-[#1A0F0A] hover:text-[#E85D4A] transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-[11px] xl:text-xs uppercase tracking-[0.16em] xl:tracking-[0.2em] font-medium text-[#F8EFE6] hover:text-[#F28A3D] px-1.5 sm:px-2 py-1 transition-colors whitespace-nowrap hidden sm:inline-block shrink-0"
                >
                  Login
                </Link>
              )
            )}

            {/* Cart Icon / Button */}
            <button
              onClick={toggleCart}
              className="flex items-center gap-1.5 sm:gap-2 bg-[#241510] border border-[#D9A441]/30 hover:border-[#F28A3D] px-2.5 sm:px-3.5 py-1.5 rounded-full transition-all group shadow-sm shrink-0 whitespace-nowrap"
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
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mt-3 pb-2 animate-fadeIn">
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
                <Logo variant="compact" theme="dark" />
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
                        SIGNATURE
                      </span>
                    )}
                  </Link>
                ))}

                {/* Mobile Auth Links */}
                {status === "authenticated" ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base text-[#D9A441] hover:text-[#F28A3D] py-3 border-b border-[#D9A441]/10 flex items-center justify-between font-normal"
                    >
                      <span className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        My Account & Orders
                      </span>
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="text-base text-[#E85D4A] py-3 border-b border-[#D9A441]/10 flex items-center justify-between font-normal text-left"
                    >
                      <span className="flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base text-[#F8EFE6] hover:text-[#F28A3D] py-3 border-b border-[#D9A441]/10 flex items-center justify-between font-normal"
                  >
                    <span className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      Client Login / Sign Up
                    </span>
                  </Link>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-[#D9A441]/20 text-xs text-[#CDB8A6]">
              <p className="font-medium text-[#F8EFE6] mb-1">
                Handcrafted Scented Candles
              </p>
              <p className="italic font-accent text-sm text-[#CDB8A6]">Poured with devotion, one candle at a time.</p>
              <a
                href={siteConfig.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-[#F28A3D] font-medium block hover:underline"
              >
                Instagram: {siteConfig.contact.instagramHandle}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
