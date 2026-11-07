import { Flame, Clock, Sparkles } from "lucide-react";
import { Section } from "@/components/shared/Section";
import { StepCard } from "@/components/shared/StepCard";
import { InfoBar } from "@/components/shared/InfoBar";

export function HowSurpriseWorks() {
  const steps = [
    {
      step: 1,
      title: "Light it",
      description: "Light the cotton wick. Let the gentle wax and artisanal notes fill your sanctuary with warm soothing fragrance.",
      icon: <Flame className="w-6 h-6" />,
    },
    {
      step: 2,
      title: "Let it burn",
      description: "As the candle burns down safely over 20-30 hours, a protective silver foil parcel emerges gently through the translucent melted wax.",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      step: 3,
      title: "Reveal your gift",
      description: "Extinguish the flame when 1 cm of wax remains. Using tongs, retrieve the heat-sealed pouch to reveal your keepsake treasure.",
      icon: <Sparkles className="w-6 h-6" />,
    },
  ];

  return (
    <Section
      background="dark-alt"
      headerAlign="center"
      title="Burn it. Discover it."
      subtitle="Three mindful steps from warm flicker to an unexpected revelation."
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

      {/* Mandatory Safety Notice */}
      <InfoBar variant="safety" title="Safety first">
        The gift is in a heat-safe sealed pouch at the bottom. Never leave a burning candle unattended. Stop burning when 1 cm of wax is left. Keep away from children and pets. Not suitable for children under 14.
      </InfoBar>
    </Section>
  );
}
