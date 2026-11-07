import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CheckCircle, Heart, Gift, ArrowRight } from "lucide-react";
import { Section } from "@/components/shared/Section";
import { Badge } from "@/components/shared/Badge";
import { Card } from "@/components/shared/Card";

export function OriginStory() {
  return (
    <Section background="dark">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Our Story */}
        <div className="lg:col-span-6 space-y-6">
          <Badge variant="orange">
            <Heart className="w-3.5 h-3.5 text-[#F28A3D]" />
            Our story • Crafted with devotion
          </Badge>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display text-[#F8EFE6] font-light leading-[1.15]">
            Handcrafted with care, poured with warm ambient light.
          </h2>

          <div className="space-y-4 text-base text-[#CDB8A6] font-light leading-relaxed">
            <p>
              Every <strong className="text-[#F8EFE6] font-medium">{siteConfig.brandName}</strong> candle is hand-poured with care, with a little surprise waiting at the end of the flame. We craft in small, mindful batches using gentle soy blend wax and delicate fragrance oils that evoke tranquil sanctuaries and quiet evenings.
            </p>
            <p>
              As the wax gently recedes and the flame flickers, a sealed keepsake reveals itself at the base—a quiet moment of wonder crafted to celebrate every wish.
            </p>
          </div>

          {/* Quality Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#D9A441]/20">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#F28A3D] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[#F8EFE6]">
                  Artisanal Soy Blend
                </h4>
                <p className="text-xs text-[#CDB8A6] mt-0.5">Gentle smoke-free burn</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#F28A3D] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[#F8EFE6]">
                  Mindfully Crafted
                </h4>
                <p className="text-xs text-[#CDB8A6] mt-0.5">Cotton wicks &amp; refined oils</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#F28A3D] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[#F8EFE6]">
                  Heat-Safe Keepsake
                </h4>
                <p className="text-xs text-[#CDB8A6] mt-0.5">Sealed safely in signature jars</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#F28A3D] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[#F8EFE6]">
                  Pan-India Delivery
                </h4>
                <p className="text-xs text-[#CDB8A6] mt-0.5">Safe doorstep dispatch</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/about" className="btn-outline text-base py-3 px-7 inline-flex items-center gap-2">
              <span>Read our full journey</span>
              <ArrowRight className="w-4 h-4 text-[#F28A3D]" />
            </Link>
          </div>
        </div>

        {/* Right: Brand Values Light Contrast Card */}
        <div className="lg:col-span-6">
          <Card variant="cream" className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6D8C6] pb-4">
              <span className="text-xs font-semibold tracking-wider text-[#8C3D00] uppercase">
                Our Artisanal Promise
              </span>
              <span className="text-xs text-[#5C463B]">Artisanal Atelier</span>
            </div>

            <blockquote className="italic text-base md:text-lg text-[#2A1B15] leading-relaxed border-l-2 border-[#F28A3D] pl-4 font-serif">
              &ldquo;A candle should light more than a room. It should kindle serene memories, bring peace to the mind, and spark delight as the wax unveils a hidden keepsake.&rdquo;
            </blockquote>

            <div className="bg-[#F5ECE0] p-4 rounded-2xl border border-[#E6D8C6] text-sm space-y-2.5">
              <div className="flex justify-between">
                <span className="text-[#5C463B]">Wick Type:</span>
                <span className="text-[#2A1B15] font-medium">Braided cotton &amp; wood wicks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C463B]">Wax Blend:</span>
                <span className="text-[#2A1B15] font-medium">Hand-blended artisanal wax</span>
              </div>
            </div>

            {/* Surprise Gift Highlight */}
            <div className="bg-[#FAF3EA] border border-[#F28A3D]/40 p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
              <div className="p-2.5 bg-[#F28A3D]/15 rounded-full border border-[#F28A3D]/30 shrink-0">
                <Gift className="w-5 h-5 text-[#8C3D00]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2A1B15]">
                  Surprise Gift Sealed in Every Candle
                </p>
                <p className="text-xs text-[#5C463B] mt-0.5">
                  Heat-safe sealed keepsake charms and jewelry waiting to be unveiled.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}
