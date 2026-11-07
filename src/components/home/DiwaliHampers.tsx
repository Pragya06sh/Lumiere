import Link from "next/link";
import { products } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { Gift, ArrowRight } from "lucide-react";
import { Section } from "@/components/shared/Section";
import { Badge } from "@/components/shared/Badge";
import { Card } from "@/components/shared/Card";

export function DiwaliHampers() {
  const hamperProducts = products
    .filter(
      (p) =>
        p.category.includes("gift-hampers") ||
        p.category.includes("gift-boxes") ||
        p.collections.includes("diwali-gifting") ||
        p.collections.includes("luxury-picks")
    )
    .slice(0, 4);

  return (
    <Section
      background="dark"
      headerAlign="center"
      badge={
        <Badge variant="gold">
          <Gift className="w-3.5 h-3.5 text-[#D9A441]" />
          Curated Gift Sets
        </Badge>
      }
      title="Curated gift sets & boxes"
      subtitle="Thoughtfully packaged in rigid gold foil gift boxes with handwritten gift notes and signature wax centerpieces."
    >
      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {hamperProducts.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      {/* Corporate / Bulk Gifting banner */}
      <Card variant="dark" className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#D9A441]/30 bg-[#241510]">
        <div className="text-center md:text-left">
          <h4 className="font-display text-xl md:text-2xl text-[#F8EFE6] font-light">
            Corporate &amp; bespoke gifting
          </h4>
          <p className="text-base text-[#CDB8A6] mt-2 max-w-xl font-light leading-relaxed">
            Custom sleeve branding, personalized greeting notes, and direct pan-India door delivery for corporate teams and special celebrations.
          </p>
        </div>
        <Link
          href="/gifting"
          className="btn-primary text-sm py-3 px-7 whitespace-nowrap flex items-center gap-2 shrink-0"
        >
          <span>Request custom gift set</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Card>
    </Section>
  );
}
