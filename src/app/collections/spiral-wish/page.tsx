import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { siteConfig } from "@/config/site";
import { Sparkles, Flame, ShieldAlert, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "The Spiral Wish Collection — Our Signature Turkish-Style Edge Wick Candles",
  description:
    "Inspired by Turkish spiral candles. One flame travels around the edge, slowly revealing a gift hidden inside. Discover our 4 signature spiral editions.",
};

export default function SpiralWishCollectionPage() {
  const spiralProducts = products.filter(
    (p) =>
      p.category.includes("spiral-wish") ||
      p.collections?.includes("spiral-wish")
  );

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2A1B15] pb-20">
      {/* Hero Header */}
      <div className="relative bg-[#1A0F0A] text-[#F8EFE6] py-16 md:py-24 border-b border-[#D9A441]/20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D9A441]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center space-y-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#CDB8A6] hover:text-[#D9A441] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Candle Collections</span>
          </Link>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] bg-[#241510] text-[#D9A441] border border-[#D9A441]/40 font-medium mb-3">
              <Sparkles className="w-3 h-3 text-[#D9A441]" />
              The Signature Range
            </span>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-[#F8EFE6] tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              The Spiral Wish
            </h1>
          </div>

          <p className="text-base sm:text-lg text-[#CDB8A6] max-w-xl mx-auto leading-relaxed font-light">
            Inspired by Turkish spiral candles. One flame travels around the edge, slowly revealing a gift hidden inside.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-12 space-y-12">
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {spiralProducts.map((product) => (
            <ProductCard key={product.slug} product={product} priority />
          ))}
        </div>

        {/* Mandatory Safety Notice Card */}
        <div className="bg-[#FFF8EE] border border-[#D9A441]/50 rounded-[24px] p-6 sm:p-8 space-y-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-[#A8742A] shrink-0" />
            <h3 className="font-serif text-lg font-semibold text-[#2A1B15]">
              Spiral Wish Candle Safety Guidelines
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#5C463B] leading-relaxed">
            Safety first: Place on a heat-proof plate or dish, never directly on wood, plastic or glass. The flame burns at the edge and wax can run, so keep 30 cm clear of anything flammable. Do not move the candle while it is lit. Burn for no more than 3 to 4 hours at a time. The gift is a metal item sealed in a heat-safe pouch inside the candle. When it appears, put out the flame, let everything cool fully, then remove it. Never leave a burning candle unattended. Keep away from children and pets. Not suitable for children under 14.
          </p>
        </div>
      </div>
    </div>
  );
}

