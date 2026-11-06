import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Sparkles, ShieldCheck, Heart, Gift, ArrowRight } from "lucide-react";
import { Badge } from "@/components/shared/Badge";

export const metadata = {
  title: "Our Story | Lumière Festive Candles Kolkata",
  description: "Handcrafted soy wax candles poured with devotion in Kolkata. Discover the story behind our auspicious fragrances and surprise inside candles.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 max-w-4xl space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="surprise">
            <Sparkles className="w-3.5 h-3.5 text-[#A8742A]" />
            Poured With Devotion • Kolkata
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display text-[#2A1B15] font-medium leading-tight">
            Crafting light, fragrance, and wonder.
          </h1>

          <p className="text-lg text-[#5C463B] italic max-w-2xl mx-auto leading-relaxed font-serif">
            &ldquo;{siteConfig.brandName} is a celebration of warmth, nostalgia, and sacred Indian festive moments captured in wax.&rdquo;
          </p>
        </div>

        {/* Narrative Chapters */}
        <div className="space-y-8">
          {/* Chapter 1 */}
          <div className="bg-white border border-[#E6D8C6] p-5 md:p-6 rounded-[20px] space-y-3 shadow-sm">
            <span className="text-xs text-[#A8742A] uppercase tracking-wider font-semibold">
              The Kolkata Inspiration
            </span>
            <h2 className="text-2xl font-display text-[#2A1B15] font-medium">
              Why We Poured Our First Candle
            </h2>
            <div className="space-y-3 text-base text-[#5C463B] leading-relaxed">
              <p>
                In Kolkata, autumn arrives with a sacred enchantment. The autumn breeze carries the fragrance of blooming shiuli flowers, evening dhunuchi incense, temple sandalwood paste, and the quiet reverence of illuminated earthen diyas lining doorways.
              </p>
              <p>
                Yet for years, when families sought scented candles for their homes or Diwali hampers, they found only synthetic vanilla jars poured with petroleum paraffin that generated black soot and headaches. We believed candles could honor our living traditions—pure, comforting, and deeply aromatic.
              </p>
            </div>
          </div>

          {/* Chapter 2 */}
          <div className="bg-white border border-[#E6D8C6] p-5 md:p-6 rounded-[20px] space-y-3 shadow-sm">
            <span className="text-xs text-[#A8742A] uppercase tracking-wider font-semibold">
              The Craft & The Flame
            </span>
            <h2 className="text-2xl font-display text-[#2A1B15] font-medium">
              Small-Batch Mastery in Our Kolkata Studio
            </h2>
            <div className="space-y-3 text-base text-[#5C463B] leading-relaxed">
              <p>
                Every candle is hand-poured in micro-batches in our Park Street studio workshop. We blend pure plant-based soy and coconut wax, cure each batch for a full fourteen days, and test every fragrance throw with organic cotton and crackling wooden wicks.
              </p>
              <p>
                At the base of our signature jars, our artisans seal a festive keepsake inside heat-resistant foil—a silver-plated Laxmi coin, a miniature brass diya, or a delicate charm—creating an unforgettable moment of revelation as the candle burns down.
              </p>
            </div>
          </div>

          {/* Chapter 3 */}
          <div className="bg-white border border-[#E6D8C6] p-5 md:p-6 rounded-[20px] space-y-4 shadow-sm">
            <span className="text-xs text-[#A8742A] uppercase tracking-wider font-semibold">
              Our Artisanal Values
            </span>
            <h2 className="text-2xl font-display text-[#2A1B15] font-medium">
              Pure Wax. Pure Devotion.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 bg-[#FAF6F0] border border-[#E6D8C6] rounded-xl space-y-1">
                <ShieldCheck className="w-6 h-6 text-[#A8742A] mb-2" />
                <h4 className="font-semibold text-sm text-[#2A1B15]">Clean Living</h4>
                <p className="text-xs text-[#5C463B]">Phthalate-free, lead-free wicks, safe for pets & kids.</p>
              </div>
              <div className="p-5 bg-[#FAF6F0] border border-[#E6D8C6] rounded-xl space-y-1">
                <Heart className="w-6 h-6 text-[#B85D38] mb-2" />
                <h4 className="font-semibold text-sm text-[#2A1B15]">Bengal Heritage</h4>
                <p className="text-xs text-[#5C463B]">Local craftspeople and potters trained in West Bengal.</p>
              </div>
              <div className="p-5 bg-[#FAF6F0] border border-[#E6D8C6] rounded-xl space-y-1">
                <Gift className="w-6 h-6 text-[#A8742A] mb-2" />
                <h4 className="font-semibold text-sm text-[#2A1B15]">Surprise Inside</h4>
                <p className="text-xs text-[#5C463B]">Every surprise candle hides a sealed keepsake treasure.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link href="/shop" className="btn-primary text-base py-3.5 px-8 shadow-sm inline-flex items-center gap-2">
            <span>Explore the Diwali Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
