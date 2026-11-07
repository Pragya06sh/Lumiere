import { Hero } from "@/components/home/Hero";
import { SpiralWishSection } from "@/components/home/SpiralWishSection";
import { SurpriseHighlight } from "@/components/home/SurpriseHighlight";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { ScentFamilySelector } from "@/components/home/ScentFamilySelector";
import { DiwaliHampers } from "@/components/home/DiwaliHampers";
import { CustomerReveals } from "@/components/home/CustomerReveals";
import { OriginStory } from "@/components/home/OriginStory";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { FAQPreview } from "@/components/home/FAQPreview";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. The Spiral Wish: Our Signature */}
      <SpiralWishSection />

      {/* 3. Surprise Inside */}
      <SurpriseHighlight />

      {/* 3. Featured candles */}
      <FeaturedSection />

      {/* 4. Shop by scent */}
      <ScentFamilySelector />

      {/* 5. Curated gift sets */}
      <DiwaliHampers />

      {/* 6. Customer reveals gallery */}
      <CustomerReveals />

      {/* 7. Our story */}
      <OriginStory />

      {/* 8. Reviews */}
      <ReviewsSection />

      {/* 9. Newsletter */}
      <NewsletterSection />

      {/* 10. FAQ Preview with safety tips */}
      <FAQPreview />
    </>
  );
}
