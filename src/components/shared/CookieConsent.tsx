"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("wick-and-wish-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("wick-and-wish-cookie-consent", "accepted");
    setIsVisible(false);
  };

  const decline = () => {
    localStorage.setItem("wick-and-wish-cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 bg-[#16110a]/95 border border-[#d4a017]/30 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(212,160,23,0.12)] backdrop-blur-xl"
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 bg-[#d4a017]/15 rounded-full text-[#f3d47d] shrink-0 mt-0.5">
          <Flame className="w-5 h-5 flame-flicker fill-[#d4a017]" />
        </div>
        <div>
          <h4 className="text-sm font-semibold tracking-wider text-[#f3d47d] mb-1">
            We Value Your Privacy
          </h4>
          <p className="text-xs text-[#d9cdbd] leading-relaxed mb-4 font-light">
            We use cookies to enhance your artisanal candle shopping experience, analyze site traffic, and remember your cart. Read our{" "}
            <Link
              href="/privacy-policy"
              className="text-[#f3d47d] underline hover:text-white"
            >
              Privacy Policy
            </Link>
            .
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={accept}
              className="px-5 py-2 bg-gradient-to-r from-[#f3d47d] to-[#d4a017] hover:from-[#fae29f] hover:to-[#dfad27] text-[#0e0a07] text-xs font-semibold uppercase tracking-wider rounded-full shadow-md transition-all active:scale-95"
            >
              Accept All
            </button>
            <button
              onClick={decline}
              className="px-4 py-2 bg-transparent border border-[#d4a017]/25 hover:border-[#d4a017]/50 text-[#9e8e7a] hover:text-[#fcf8f2] text-xs uppercase tracking-wider rounded-full transition-colors"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
