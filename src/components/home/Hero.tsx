"use client";

import Link from "next/link";
import Image from "next/image";
import { festiveConfig } from "@/config/festive";
import { Sparkles, Flame, ArrowUpRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-[#1A0F0A] border-b border-[#D9A441]/20">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-[#F28A3D]/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 left-1/6 w-[350px] h-[350px] bg-[#D9A441]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/6 w-[350px] h-[350px] bg-[#F28A3D]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Floating golden sparkles (hero only) */}
      {festiveConfig.enabled && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden z-10"
          aria-hidden="true"
        >
          <span className="hero-sparkle w-2 h-2 top-[12%] left-[18%] [animation-delay:0.2s]" />
          <span className="hero-sparkle w-3 h-3 top-[28%] left-[8%] [animation-delay:1.4s]" />
          <span className="hero-sparkle w-2.5 h-2.5 top-[55%] left-[22%] [animation-delay:0.8s]" />
          <span className="hero-sparkle w-2 h-2 top-[18%] right-[28%] [animation-delay:2.1s]" />
          <span className="hero-sparkle w-3 h-3 top-[45%] right-[12%] [animation-delay:1.1s]" />
          <span className="hero-sparkle w-2 h-2 top-[70%] right-[20%] [animation-delay:2.6s]" />
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-20 w-full">
        {/* Top 3-Column Layout: Left Arch | Center Hero Text & CTA | Right Pill Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center pt-2">
          
          {/* Left Column: Tall Arch Image Frame */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start order-2 lg:order-1">
            {/* Tall Arch Pill Frame */}
            <div className="relative w-[210px] sm:w-[230px] md:w-[240px] rounded-full p-2 border border-[#D9A441]/40 shadow-[0_0_30px_rgba(242,138,61,0.15)] group transition-transform duration-500 hover:scale-[1.02]">
              <div className="relative aspect-[9/16] w-full rounded-full overflow-hidden bg-gradient-to-b from-[#2E150C] to-[#150A06] border border-[#D9A441]/30">
                {/* Background image */}
                <Image
                  src="/images/products/rose-pearl-reveal.jpg"
                  alt="Handcrafted Soy Wax Candle"
                  fill
                  priority
                  className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A] via-transparent to-[#1A0F0A]/60 pointer-events-none" />

                {/* Floating Stat inside Arch at top */}
                <div className="absolute top-6 left-0 right-0 text-center px-4 z-10">
                  <span className="font-display italic text-2xl md:text-3xl text-[#F8EFE6] font-light block drop-shadow-md">
                    Artisanal
                  </span>
                  <span className="text-[11px] font-sans tracking-widest text-[#F28A3D] uppercase font-medium">
                    Hand-Poured
                  </span>
                </div>

                {/* Flame glow at bottom of image */}
                <div className="absolute bottom-6 left-0 right-0 text-center z-10 px-3">
                  <span className="text-[10px] text-[#CDB8A6] font-light tracking-wider uppercase">
                    Handcrafted
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom mini note under left arch */}
            <div className="mt-4 text-center lg:text-left max-w-[220px]">
              <p className="text-xs text-[#CDB8A6] font-light leading-relaxed">
                Hand-poured with care, one candle at a time.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-1 text-xs text-[#F28A3D] hover:underline mt-1 font-medium"
              >
                <span>Learn More</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Center Column: Script line, Huge Serif, Subtext, Round CTA circle */}
          <div className="lg:col-span-6 text-center flex flex-col items-center order-1 lg:order-2">
            {/* Script Accent Line */}
            <p className="font-script text-[#F28A3D] text-3xl sm:text-4xl md:text-5xl leading-tight -rotate-2 select-none mb-1">
              Light a candle.
            </p>

            {/* Huge Serif Headline (72-96px desktop, 40px mobile) */}
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-normal text-[#F8EFE6] leading-[1.05] tracking-tight max-w-xl mx-auto">
              Reveal a wish.
            </h1>

            {/* One-line subtext */}
            <p className="mt-4 text-base sm:text-lg text-[#CDB8A6] max-w-md mx-auto font-light leading-relaxed">
              Hand-poured soy candles, each holding a cherished keepsake inside.
            </p>

            {/* Floating Round Orange CTA Circle */}
            <div className="mt-7 flex flex-col items-center">
              <Link
                href="/surprise"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#F28A3D] hover:bg-[#ff9d55] text-[#1A0F0A] flex flex-col items-center justify-center p-3 text-center shadow-[0_0_45px_rgba(242,138,61,0.45)] hover:shadow-[0_0_60px_rgba(242,138,61,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 group"
                aria-label="Discover surprise candles"
              >
                <Sparkles className="w-5 h-5 text-[#1A0F0A] mb-1 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider leading-snug">
                  Discover
                  <br />
                  Surprise
                  <br />
                  Candles
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Stat Badge & Cream Arch Pill Card */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end order-3">
            {/* Top Stat: Signature Aromas */}
            <div className="flex items-center gap-3 mb-6 bg-[#241510] border border-[#D9A441]/30 rounded-full py-1.5 px-4 shadow-md">
              <div className="w-7 h-7 rounded-full bg-[#F28A3D]/20 flex items-center justify-center text-[#F28A3D]">
                <Flame className="w-4 h-4 fill-[#F28A3D]" />
              </div>
              <div className="text-left">
                <span className="font-display text-base font-semibold text-[#F8EFE6] leading-none block">
                  Signature
                </span>
                <span className="text-[10px] text-[#CDB8A6] uppercase tracking-wider block">
                  Aromas
                </span>
              </div>
            </div>

            {/* Cream Pill Arch Card (Reference-style) */}
            <div className="w-[210px] sm:w-[230px] rounded-full bg-[#FAF3EA] text-[#2A1B15] p-3 pt-4 pb-6 text-center border border-[#E6D8C6] shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-transform duration-500 hover:scale-[1.02]">
              {/* Inner Arch Surprise Candle Image Frame */}
              <div className="relative aspect-square w-full rounded-full overflow-hidden border border-[#D9A441]/40 mb-3 mx-auto shadow-inner">
                <Image
                  src="/images/surprise-candle-hero.jpg"
                  alt="Handcrafted surprise candle with keepsake inside"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 210px, 230px"
                  priority
                />
              </div>

              {/* Title inside Pill Card */}
              <h3 className="font-display text-base sm:text-lg font-medium text-[#2A1B15] leading-tight px-2">
                Surprise Inside
                <br />
                Candles
              </h3>

              {/* Link */}
              <Link
                href="/shop"
                className="inline-block mt-3 text-xs font-semibold text-[#8C3D00] hover:text-[#F28A3D] underline underline-offset-4 tracking-wide"
              >
                Our Collection
              </Link>
            </div>

            {/* Bottom note under right pill */}
            <div className="mt-4 text-center lg:text-right max-w-[210px]">
              <p className="text-xs text-[#CDB8A6] font-light italic">
                Melting hearts, one candle at a time.
              </p>
            </div>
          </div>
        </div>

        {/* Hero Bottom Banner: Centered Pill & Large Soft Serif Sentence */}
        <div className="mt-14 md:mt-20 pt-8 border-t border-[#D9A441]/15 text-center space-y-4">
          <div className="inline-flex">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-medium tracking-widest uppercase bg-[#241510] text-[#D9A441] border border-[#D9A441]/40 shadow-xs">
              Signature aromas
            </span>
          </div>

          <p className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#F8EFE6]/90 font-light italic max-w-3xl mx-auto leading-relaxed tracking-wide px-4">
            &ldquo;The softest light, the richest scents, the coziest moments await you&rdquo;
          </p>
        </div>
      </div>

      {/* Subtle warm flame/smoke gradient at the bottom only */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#1A0F0A] via-[#1A0F0A]/80 to-transparent pointer-events-none" />
    </section>
  );
}
