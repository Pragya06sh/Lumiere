import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { Sparkles, ArrowRight, Flame } from "lucide-react";

export function SpiralWishSection() {
  const spiralProducts = products.filter(
    (p) =>
      p.category.includes("spiral-wish") ||
      p.collections?.includes("spiral-wish")
  );

  return (
    <section className="relative bg-[#1A0F0A] text-[#F8EFE6] py-16 md:py-24 border-b border-[#D9A441]/20 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#D9A441]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 space-y-16">
        {/* Top Feature Spotlight: Arch Frame & Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Arch Frame with Noir Peony Spiral */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="relative aspect-[3/4] rounded-t-[140px] rounded-b-[28px] overflow-hidden border-2 border-[#D9A441]/40 shadow-[0_20px_60px_rgba(0,0,0,0.6)] bg-[#241510]">
                <Image
                  src="/images/products/noir-peony-spiral.jpg"
                  alt="Noir Peony Spiral — Signature Edge Wick Candle"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] bg-[#D9A441] text-[#1A0F0A] font-bold shadow-md">
                    <Sparkles className="w-3 h-3 text-[#1A0F0A]" />
                    Our Signature Piece
                  </span>
                  <h3
                    className="text-xl font-serif text-[#F8EFE6] font-medium mt-2"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    Noir Peony Spiral
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Headline, Story & 3 Steps */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] bg-[#241510] text-[#D9A441] border border-[#D9A441]/30 font-medium">
                <Flame className="w-3 h-3 text-[#D9A441]" />
                The Spiral Wish Collection
              </span>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#F8EFE6] tracking-wide leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Light the edge. Watch it spiral. Reveal your wish.
              </h2>
              <p className="text-sm sm:text-base text-[#CDB8A6] leading-relaxed max-w-xl">
                Inspired by Turkish spiral candles. Unlike traditional center-wick candles, our artisanal wick is set upon the carved outer perimeter. As the flame travels round and round the rim, it slowly unveils a sealed metal keepsake resting deep within.
              </p>
            </div>

            {/* 3 Mindful Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#241510]/80 border border-[#D9A441]/20 rounded-2xl p-5 space-y-2">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#D9A441] font-mono font-bold">
                  Step 01
                </span>
                <h4 className="text-base font-serif text-[#F8EFE6] font-medium">
                  Light it
                </h4>
                <p className="text-xs text-[#CDB8A6]/80 leading-relaxed">
                  Ignite the cotton wick placed carefully on the outer carved rim.
                </p>
              </div>

              <div className="bg-[#241510]/80 border border-[#D9A441]/20 rounded-2xl p-5 space-y-2">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#D9A441] font-mono font-bold">
                  Step 02
                </span>
                <h4 className="text-base font-serif text-[#F8EFE6] font-medium">
                  Watch it spiral
                </h4>
                <p className="text-xs text-[#CDB8A6]/80 leading-relaxed">
                  The flame journeys in a steady circular path, filling your room with pure fragrance.
                </p>
              </div>

              <div className="bg-[#241510]/80 border border-[#D9A441]/20 rounded-2xl p-5 space-y-2">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#D9A441] font-mono font-bold">
                  Step 03
                </span>
                <h4 className="text-base font-serif text-[#F8EFE6] font-medium">
                  Reveal your wish
                </h4>
                <p className="text-xs text-[#CDB8A6]/80 leading-relaxed">
                  As the outer wax gently clears, your sealed keepsake treasure emerges.
                </p>
              </div>
            </div>

            {/* Pill CTA button */}
            <div className="pt-2">
              <Link
                href="/collections/spiral-wish"
                className="inline-flex items-center gap-2.5 py-3 px-8 bg-[#D9A441] hover:bg-[#E8B655] text-[#1A0F0A] text-xs uppercase tracking-[0.2em] font-semibold rounded-full shadow-lg transition-all"
              >
                <span>Shop Spiral Wish</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Spiral Product Cards Grid */}
        <div className="space-y-6 pt-4 border-t border-[#D9A441]/20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#D9A441] font-medium block mb-1">
                Curated Editions
              </span>
              <h3
                className="text-2xl sm:text-3xl font-serif text-[#F8EFE6] font-medium"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                The Four Spiral Creations
              </h3>
            </div>
            <Link
              href="/collections/spiral-wish"
              className="text-xs uppercase tracking-[0.2em] text-[#D9A441] hover:text-[#F8EFE6] inline-flex items-center gap-1.5 transition-colors"
            >
              <span>View all spiral creations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {spiralProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

