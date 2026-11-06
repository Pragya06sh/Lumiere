import { products } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { Flame, Clock, Sparkles, Gift } from "lucide-react";
import { Section } from "@/components/shared/Section";
import { StepCard } from "@/components/shared/StepCard";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { InfoBar } from "@/components/shared/InfoBar";

export const metadata = {
  title: "Surprise Inside Candles | Lumière Festive Collection",
  description:
    "Burn it. Discover it. Handcrafted Diwali candles with hidden keepsake treasures sealed safely at the bottom.",
};

export default function SurprisePage() {
  const surpriseProducts = products.filter((p) => p.hasSurpriseGift);

  const steps = [
    {
      step: 1,
      title: "Light it",
      desc: "Light the clean-burning wick and let festive aromas of sandalwood, rose, and saffron envelop your space.",
      icon: <Flame className="w-6 h-6" />,
    },
    {
      step: 2,
      title: "Let it burn",
      desc: "As the pure soy wax melts evenly over 20-30 hours, the heat-safe protective parcel emerges gradually.",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      step: 3,
      title: "Reveal your gift",
      desc: "Extinguish the flame when 1 cm of wax remains. Using tongs, unwrap your keepsake gift and scan your reveal card.",
      icon: <Sparkles className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* 1. Hero Section */}
      <Section
        background="cream"
        headerAlign="center"
        badge={
          <Badge variant="surprise">
            <Gift className="w-3.5 h-3.5 text-[#A8742A]" />
            Lumière Signature Innovation
          </Badge>
        }
        title="Burn it. Discover it."
        subtitle="A hidden gift is lovingly sealed inside every candle. As the wax gently recedes, an auspicious keepsake reveals itself—from silver charms and pendants to brass keepsakes and bespoke accessories."
      >
        {/* 3 Step Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {steps.map((s) => (
            <StepCard
              key={s.step}
              step={s.step}
              title={s.title}
              description={s.desc}
              icon={s.icon}
            />
          ))}
        </div>

        {/* Safety Warning (Required, Visible, >= 32px space above) */}
        <InfoBar variant="safety" title="Safety first">
          The gift is metal, sealed in a heat-safe pouch or box at the bottom, away from the wick. Never leave a burning candle unattended. Stop burning when 1 cm of wax is left. Keep away from children and pets. Not suitable for children under 14.
        </InfoBar>
      </Section>

      {/* 2. Gift Tiers Guide */}
      <Section
        background="sand"
        headerAlign="center"
        badge={<Badge variant="gold">Gift Tier Options</Badge>}
        title="Three ways to experience the reveal"
        subtitle="Each candle contains a sealed heat-safe treasure thoughtfully matched to our gift tiers."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="space-y-3">
            <Badge variant="surprise">Tier 1 • Mystery Gift</Badge>
            <h4 className="font-display text-xl text-[#2A1B15] font-medium">
              Mystery Gift
            </h4>
            <p className="text-sm text-[#5C463B] leading-relaxed">
              An enchanting unknown treasure curated by our artisans. Let destiny choose your Diwali blessing.
            </p>
          </Card>

          <Card className="space-y-3">
            <Badge variant="surprise">Tier 2 • Choose Your Gift</Badge>
            <h4 className="font-display text-xl text-[#2A1B15] font-medium">
              Choose Your Audience
            </h4>
            <p className="text-sm text-[#5C463B] leading-relaxed">
              Select your surprise audience (Her, Him, or Anyone) so our team can hand-package the ideal tailored keepsake inside.
            </p>
          </Card>

          <Card className="space-y-3">
            <Badge variant="surprise">Tier 3 • Premium Reveal</Badge>
            <h4 className="font-display text-xl text-[#2A1B15] font-medium">
              Premium Reveal
            </h4>
            <p className="text-sm text-[#5C463B] leading-relaxed">
              Higher-value heirloom pieces including sterling jewellery, bespoke lockets, and delicate metal keepsakes.
            </p>
          </Card>
        </div>
      </Section>

      {/* 3. Surprise Candles Grid */}
      <Section
        background="cream"
        title={`The Surprise Inside Collection (${surpriseProducts.length} candles)`}
        subtitle="Each poured in heavy frosted glass jars with wooden wicks and sealed treasures."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {surpriseProducts.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Section>
    </div>
  );
}
