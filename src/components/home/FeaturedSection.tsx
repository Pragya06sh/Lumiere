import Link from "next/link";
import { products } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { ArrowRight, Sparkles } from "lucide-react";
import { Section } from "@/components/shared/Section";
import { Badge } from "@/components/shared/Badge";

export function FeaturedSection() {
  const featured = products
    .filter((p) => p.isBestseller || p.isFeatured)
    .slice(0, 4);

  return (
    <Section
      background="dark"
      badge={
        <Badge variant="gold">
          <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
          Signature Collection
        </Badge>
      }
      title="Featured candles"
      subtitle="Hand-poured in artisanal batches with gentle soy wax and signature botanical essences."
      action={
        <Link
          href="/shop"
          className="btn-outline text-sm py-2.5 px-5 inline-flex items-center gap-1.5"
        >
          <span>View all candles</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#F28A3D]" />
        </Link>
      }
    >
      {/* Product Grid - 24px gap on desktop, 16px on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {featured.map((product, idx) => (
          <ProductCard key={product.slug} product={product} priority={idx < 2} />
        ))}
      </div>
    </Section>
  );
}
