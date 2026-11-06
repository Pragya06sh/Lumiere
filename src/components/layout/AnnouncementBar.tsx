"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { festiveConfig } from "@/config/festive";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";
import { Sparkles, X } from "lucide-react";

export function AnnouncementBar() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 12, minutes: 30, seconds: 45 });

  useEffect(() => {
    setMounted(true);
    if (!festiveConfig.enabled || !festiveConfig.announcement.countdownEnd) return;

    const updateTimer = () => {
      const difference =
        new Date(festiveConfig.announcement.countdownEnd).getTime() -
        new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const freeShippingText = `Free Kolkata delivery on orders above ${formatPrice(
    siteConfig.shipping.freeShippingThreshold
  )}`;

  return (
    <div className="relative bg-[#241510] text-[#F8EFE6] py-2.5 px-4 text-xs md:text-sm font-medium z-50 border-b border-[#D9A441]/20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center gap-2 text-center">
          {festiveConfig.enabled && (
            <Sparkles className="w-3.5 h-3.5 text-[#F28A3D] shrink-0 hidden sm:inline-block" />
          )}

          <div className="flex items-center gap-2 flex-wrap justify-center text-xs md:text-sm">
            {festiveConfig.enabled ? (
              <>
                <span className="text-[#F8EFE6] font-normal">{festiveConfig.announcement.text}</span>
                {mounted && (
                  <span className="hidden md:inline bg-[#1A0F0A] px-2.5 py-0.5 rounded-full text-xs font-mono tracking-wider text-[#D9A441] border border-[#D9A441]/40">
                    Offer ends in {String(timeLeft.hours).padStart(2, "0")}h :{" "}
                    {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
                    {String(timeLeft.seconds).padStart(2, "0")}s
                  </span>
                )}
                <Link
                  href={festiveConfig.announcement.link}
                  className="underline underline-offset-4 hover:text-[#F28A3D] font-medium inline-block transition-colors ml-1"
                >
                  Shop now
                </Link>
              </>
            ) : (
              <span className="text-[#F8EFE6]">{freeShippingText}</span>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-[#CDB8A6] hover:text-[#F8EFE6] p-1 ml-2 transition-colors rounded-full"
          aria-label="Close announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
