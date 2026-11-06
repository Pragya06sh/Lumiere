"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Section } from "@/components/shared/Section";
import { Badge } from "@/components/shared/Badge";
import { Card } from "@/components/shared/Card";

const scentFamilies = [
  {
    id: "sacred-woods",
    name: "Sacred Woods & Amber",
    tagline: "Mysore Sandalwood • Saffron • Black Amber",
    description: "Evoking the serenity of auspicious pujas and evening sanctums with royal sandalwood and golden amber.",
    candles: ["Lotus Diya Jar", "Noir and Gold Leaf Jar"],
    href: "/shop?category=surprise-inside",
  },
  {
    id: "blooming-florals",
    name: "Auspicious Florals",
    tagline: "Damascus Rose • Night Jasmine • Cotton Blossom",
    description: "Delicate petals and romantic blossoms inspired by floral offerings and tranquil evening gardens.",
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
    id: "warm-festive-spices",
    name: "Warm Evening Spice",
    tagline: "Sweet Orange • Cinnamon • Clove • Amber",
    description: "The welcoming warmth of hearthside spices and festive celebrations in the glow of the holidays.",
    candles: ["Crimson Hearth Jar", "Diwali Glow Hamper"],
    href: "/shop?collection=diwali-gifting",
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
          Aromatherapy &amp; Tradition
        </Badge>
      }
      title="Shop by scent family"
      subtitle="Discover authentic Indian aromas crafted for celebration, meditation, and warm gatherings."
    >
      {/* Family Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
        {scentFamilies.map((fam) => (
          <button
            key={fam.id}
            onClick={() => setActiveFamily(fam)}
            className={`px-5 py-2 text-sm rounded-full transition-all duration-200 ${
              activeFamily.id === fam.id
                ? "bg-[#F28A3D] text-[#1A0F0A] font-semibold shadow-[0_2px_12px_rgba(242,138,61,0.35)] scale-105"
                : "bg-[#1A0F0A] text-[#F8EFE6] border border-[#D9A441]/30 hover:border-[#F28A3D] font-medium"
            }`}
          >
            {fam.name}
          </button>
        ))}
      </div>

      {/* Selected Family Details Card */}
      <Card variant="dark" className="max-w-2xl mx-auto text-center space-y-4 border border-[#D9A441]/30 bg-[#1A0F0A]/80 shadow-2xl">
        <span className="text-xs font-semibold tracking-widest text-[#F28A3D] uppercase">
          {activeFamily.tagline}
        </span>
        <h3 className="font-display text-2xl md:text-3xl text-[#F8EFE6] font-light">
          {activeFamily.name}
        </h3>
        <p className="text-base text-[#CDB8A6] max-w-lg mx-auto leading-relaxed font-light">
          {activeFamily.description}
        </p>
        <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-sm text-[#CDB8A6]">Featured candles:</span>
          {activeFamily.candles.map((c) => (
            <Badge key={c} variant="gold">
              {c}
            </Badge>
          ))}
        </div>
        <div className="pt-4">
          <Link
            href={activeFamily.href}
            className="btn-primary text-sm py-3 px-7 inline-flex items-center gap-2"
          >
            <span>Explore this collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Card>
    </Section>
  );
}
