import Link from "next/link";
import { Flame, Clock, Sparkles, Gift, ArrowRight } from "lucide-react";
import { Section } from "@/components/shared/Section";
import { Badge } from "@/components/shared/Badge";
import { StepCard } from "@/components/shared/StepCard";
import { InfoBar } from "@/components/shared/InfoBar";

export function SurpriseHighlight() {
  const steps = [
    {
      step: 1,
      title: "Light it",
      description:
        "Light the crackling wooden wick. Let the pure soy wax and artisanal festive notes fill your sanctuary with warm Diwali fragrance.",
      icon: <Flame className="w-6 h-6" />,
    },
    {
      step: 2,
      title: "Let it burn",
      description:
        "As the candle burns down safely over 20-30 hours, a protective silver foil parcel emerges gently through the translucent melted wax.",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      step: 3,
      title: "Reveal your gift",
      description:
        "Extinguish the flame when 1 cm of wax remains. Using tongs, retrieve the heat-sealed pouch to reveal your keepsake treasure.",
      icon: <Sparkles className="w-6 h-6" />,
    },
  ];

  return (
    <Section
      id="surprise-inside"
      background="dark-alt"
      headerAlign="center"
      badge={
        <Badge variant="surprise">
          <Gift className="w-3.5 h-3.5 text-[#F28A3D]" />
          Surprise Inside Signature Experience
        </Badge>
      }
      title="Burn it. Discover it."
      subtitle="Three mindful steps from golden flicker to a joyful festive revelation. Every candle carries a sealed keepsake waiting to be discovered."
      action={
        <Link
          href="/surprise"
          className="btn-outline text-sm py-2.5 px-6 inline-flex items-center gap-2 mt-4"
        >
          <span>Explore all surprise candles</span>
          <ArrowRight className="w-4 h-4 text-[#F28A3D]" />
        </Link>
      }
    >
      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step) => (
          <StepCard
            key={step.step}
            step={step.step}
            title={step.title}
            description={step.description}
            icon={step.icon}
            variant="dark"
          />
        ))}
      </div>

      {/* Safety notice with 48px space above and 24px inner padding */}
      <InfoBar variant="safety" title="Safety first">
        The gift is metal, sealed in a heat-safe pouch or box at the bottom, away from the wick. Never leave a burning candle unattended. Stop burning when 1 cm of wax is left. Keep away from children and pets. Not suitable for children under 14.
      </InfoBar>
    </Section>
  );
}
