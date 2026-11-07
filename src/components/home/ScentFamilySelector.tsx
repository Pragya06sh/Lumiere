"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Section } from "@/components/shared/Section";
import { Badge } from "@/components/shared/Badge";
import { Card } from "@/components/shared/Card";

const scentFamilies = [
  {
    id: "rare-woods",
    name: "Rare Woods & Amber",
    tagline: "Mysore Sandalwood • Saffron • Black Amber",
    description: "Evoking the serenity of quiet evening sanctums with royal sandalwood and golden amber.",
    candles: ["Lotus Diya Jar", "Noir and Gold Leaf Jar"],
    href: "/shop?category=surprise-inside",
  },
  {
    id: "blooming-florals",
    name: "Blooming Florals",
    tagline: "Damascus Rose • Night Jasmine • Cotton Blossom",
    description: "Delicate petals and romantic blossoms inspired by tranquil evening gardens.",
    candles: ["Rose Pearl Reveal", "Red Tulip Candle Bouquet", "White Tulip Candle Bouquet"],
    href: "/shop?category=flower-bouquets",
  },
  {
    id: "gourmand-sweets",
    name: "Gourmand & Coffee",
    tagline: "Espresso Mocha • Wild Raspberry • Honey Vanilla",
    description: "Decadent aromas of freshly roasted espresso, tart raspberry bubbles, and golden honey nectar.",
    candles: ["Espresso Martini Candle", "Raspberry Bubbly Glass Candle", "Sunflower Garden Tray Candle"],
    href: "/shop",
  },
  {
    id: "warm-spices",
    name: "Warm Evening Spice",
    tagline: "Sweet Orange • Cinnamon • Clove • Amber",
    description: "The welcoming warmth of hearthside spices in the glow of the evening.",
    candles: ["Crimson Hearth Jar", "Warm Glow Gift Box"],
    href: "/shop",
  },
];

export function ScentFamilySelector() {
  const [activeFamily, setActiveFamily] = useState(scentFamilies[0]);

  return (
    <Section
      background="dark-alt"
      headerAlign="center"
      badge={
        <Badge variant="gold">
          <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
          Aromatherapy &amp; Ambience
        </Badge>
      }
      title="Shop by scent family"
      subtitle="Discover distinctive aromas crafted for comfort, quiet moments, and warm gatherings."
    >
      {/* Scent Family Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 max-w-4xl mx-auto">
        {scentFamilies.map((family) => {
          const isActive = activeFamily.id === family.id;
          return (
            <button
              key={family.id}
              onClick={() => setActiveFamily(family)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 shadow-sm ${
                isActive
                  ? "bg-[#D9A441] text-[#1A0F0A] shadow-md scale-105 font-semibold"
                  : "bg-[#241510] text-[#CDB8A6] border border-[#D9A441]/25 hover:border-[#D9A441]/60 hover:text-[#F8EFE6]"
              }`}
            >
              {family.name}
            </button>
          );
        })}
      </div>

      {/* Active Scent Family Showcase Card */}
      <Card
        variant="dark"
        className="max-w-4xl mx-auto p-6 md:p-10 border border-[#D9A441]/30 bg-[#241510] relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#F28A3D] block font-medium">
              {activeFamily.tagline}
            </span>
            <h3 className="font-display text-2xl md:text-3xl text-[#F8EFE6] font-light">
              {activeFamily.name}
            </h3>
            <p className="text-base text-[#CDB8A6] font-light leading-relaxed">
              {activeFamily.description}
            </p>

            <div className="pt-2">
              <span className="text-xs text-[#CDB8A6]/80 block mb-2 uppercase tracking-wider">
                Featured creations in this family:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeFamily.candles.map((candle) => (
                  <span
                    key={candle}
                    className="text-xs px-3 py-1 rounded-full bg-[#1A0F0A] border border-[#D9A441]/30 text-[#F8EFE6]"
                  >
                    {candle}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center md:self-end">
            <Link
              href={activeFamily.href}
              className="btn-primary text-sm py-3 px-6 flex items-center gap-2 group shadow-sm"
            >
              <span>Explore this family</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </Card>
    </Section>
  );
}
