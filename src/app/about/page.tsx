import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Sparkles, ShieldCheck, Heart, Gift, ArrowRight } from "lucide-react";
import { Badge } from "@/components/shared/Badge";

export const metadata = {
  title: `Our Story | ${siteConfig.brandName}`,
  description: `Every ${siteConfig.brandName} candle is hand-poured with care, with a little surprise waiting at the end of the flame. Discover our story and quiet-luxury fragrances.`,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 max-w-4xl space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="surprise">
            <Sparkles className="w-3.5 h-3.5 text-[#A8742A]" />
            Artisanal Craft
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display text-[#2A1B15] font-medium leading-tight">
            Light a candle. Reveal a wish.
          </h1>

          <p className="text-lg text-[#5C463B] italic max-w-2xl mx-auto leading-relaxed font-serif">
            &ldquo;Every {siteConfig.brandName} candle is hand-poured with care, with a little surprise waiting at the end of the flame.&rdquo;
          </p>
        </div>

        {/* Narrative Chapters */}
        <div className="space-y-8">
          {/* Chapter 1 */}
          <div className="bg-white border border-[#E6D8C6] p-5 md:p-6 rounded-[20px] space-y-3 shadow-sm">
            <span className="text-xs text-[#A8742A] uppercase tracking-wider font-semibold">
              The Atelier
            </span>
            <h2 className="text-2xl font-display text-[#2A1B15] font-medium">
              A Quiet Devotion to Candle Craft
            </h2>
            <div className="space-y-3 text-base text-[#5C463B] leading-relaxed">
              <p>
                Time slows down with the arrival of dusk. The evening breeze carries notes of blooming jasmine, warm sandalwood, and the soft amber flicker of candlelight across tranquil spaces.
              </p>
              <p>
                We founded {siteConfig.brandName} to bring quiet luxury to candle making. Rather than overpowering synthetic scents and smoky paraffin wax, we craft with gentle soy blend wax, fine fragrance oils, and crackling wicks designed for mindful pauses.
              </p>
            </div>
          </div>

          {/* Chapter 2 */}
          <div className="bg-white border border-[#E6D8C6] p-5 md:p-6 rounded-[20px] space-y-3 shadow-sm">
            <span className="text-xs text-[#A8742A] uppercase tracking-wider font-semibold">
              The Reveal
            </span>
            <h2 className="text-2xl font-display text-[#2A1B15] font-medium">
              Small-Batch Mastery &amp; Sealed Keepsakes
            </h2>
            <div className="space-y-3 text-base text-[#5C463B] leading-relaxed">
              <p>
                Every single candle is poured by hand in small, disciplined batches in our workshop. We cure each batch for fourteen days, ensuring the fragrance oil and wax bind seamlessly for an even, smoke-free burn.
              </p>
              <p>
                Beneath the flame of our signature candles lies a sealed keepsake—a delicate piece of jewelry, a sculpted charm, or a fine metal token—waiting to be revealed when the burn draws to a close.
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
                <p className="text-xs text-[#5C463B]">Phthalate-free, cotton wicks, safe for pets & kids.</p>
              </div>
              <div className="p-5 bg-[#FAF6F0] border border-[#E6D8C6] rounded-xl space-y-1">
                <Heart className="w-6 h-6 text-[#B85D38] mb-2" />
                <h4 className="font-semibold text-sm text-[#2A1B15]">Artisanal Heritage</h4>
                <p className="text-xs text-[#5C463B]">Dedicated craftspeople trained in small-batch hand-pouring.</p>
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
            <span>Explore the Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
