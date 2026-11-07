"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { Home, Compass, Sparkles, ShoppingBag, Gift } from "lucide-react";

export function MobileNav() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const toggleCart = useCartStore((s) => s.toggleCart);
  const totalItemsCount = useCartStore((s) => s.getTotalItemsCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname.startsWith("/checkout") || pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { name: "Home", href: "/", icon: Home, active: pathname === "/" },
    { name: "Shop", href: "/shop", icon: Compass, active: pathname.startsWith("/shop") },
    { name: "Surprise", href: "/surprise", icon: Gift, active: pathname.startsWith("/surprise") },
    { name: "Gifting", href: "/gifting", icon: Sparkles, active: pathname === "/gifting" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1A0F0A]/95 backdrop-blur-xl border-t border-[#D9A441]/25 px-3 py-2 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-3 relative transition-colors ${
              item.active ? "text-[#F28A3D]" : "text-[#CDB8A6] hover:text-[#F8EFE6]"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-[0.18em] font-medium mt-1">
              {item.name}
            </span>
          </Link>
        );
      })}

      {/* Cart button */}
      <button
        onClick={toggleCart}
        className="flex flex-col items-center justify-center py-1 px-3 relative text-[#CDB8A6] hover:text-[#F28A3D] transition-colors"
        aria-label="View Cart"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-[#F28A3D]" />
          {mounted && totalItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#F28A3D] text-[#1A0F0A] text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono">
              {totalItemsCount}
            </span>
          )}
        </div>
        <span className="text-[11px] font-medium mt-1 text-[#F8EFE6]">
          Cart
        </span>
      </button>
    </div>
  );
}
