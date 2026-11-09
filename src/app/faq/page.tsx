"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Badge } from "@/components/shared/Badge";

const allFaqs = [
  {
    category: "Candle Safety & Keepsake Guidelines (Important)",
    questions: [
      {
        q: "What are the essential safety rules for burning Spiral Wish candles?",
        a: "Safety first: Place on a heat-proof plate or dish, never directly on wood, plastic or glass. The flame burns at the edge and wax can run, so keep 30 cm clear of anything flammable. Do not move the candle while it is lit. Burn for no more than 3 to 4 hours at a time. The gift is a metal item sealed in a heat-safe pouch inside the candle. When it appears, put out the flame, let everything cool fully, then remove it. Never leave a burning candle unattended. Keep away from children and pets. Not suitable for children under 14.",
      },
      {
        q: "What are the essential safety rules for burning Surprise Inside glass candles?",
        a: "Safety first: the gift is in a heat-safe sealed pouch at the bottom. Never leave a burning candle unattended. Stop burning when 1 cm of wax is left. Keep away from children and pets. Not suitable for children under 14. The gift is metal, sealed in a heat-safe pouch at the bottom, away from the wick.",
      },
      {
        q: "How is the gift protected from heat and fire inside the candle?",
        a: "Each keepsake gift is double-wrapped in industrial heat-resistant protective foil pouches tested to withstand temperatures exceeding 300°C. The pouch sits securely on the bottom glass base beneath the wick tabs so it never comes into contact with the open flame.",
      },
      {
        q: "How do I safely extract the revealed gift pouch?",
        a: "Extinguish the candle using a metal snuffer or lid when approximately 1 cm of melted wax remains. Allow the wax to cool slightly for 2-3 minutes. Use metal kitchen tongs or tweezers to lift out the sealed foil pouch. Wipe the exterior with a paper towel and peel open the foil.",
      },
      {
        q: "What should I do if the foil parcel shifts during burning?",
        a: "Our pouches are anchored securely at the base. If any object ever shifts near the flame, immediately extinguish the candle and let it solidify. Always keep the flame clear of all objects.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "Where do you deliver and what are standard shipping times?",
        a: "We deliver directly across serviceable pincodes nationwide. Standard dispatch takes 3-5 business days with tracked delivery.",
      },
      {
        q: "How does Free Delivery work?",
        a: "Free shipping is automatically applied at checkout whenever your cart subtotal reaches ₹799 or higher. For orders below ₹799, standard shipping applies.",
      },
    ],
  },
  {
    category: "Payments & Orders",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept payments via Razorpay (UPI, Google Pay, PhonePe, Paytm, debit/credit cards, and net banking) as well as Cash on Delivery across serviceable pincodes.",
      },
      {
        q: "Are there any hidden fees or extra taxes on checkout?",
        a: "No. All prices listed on our website are final prices with no hidden charges. An order receipt is included with your delivery and accessible digitally.",
      },
    ],
  },
  {
    category: "Candle Care & Burning Instructions",
    questions: [
      {
        q: "Why is the first burn so critical?",
        a: "Soy wax has a burn memory. On your initial burn, let the candle melt entirely across to the outer edges of the container (usually 2-3 hours). This prevents tunneling and guarantees you enjoy every gram of wax.",
      },
      {
        q: "How short should I trim the wick before relighting?",
        a: "Always trim your cotton wick to 5 mm (1/4 inch) before relighting. This stops mushrooming, controls flame height, and prevents soot residue on the glass.",
      },
      {
        q: "What is the maximum continuous burn time for a single session?",
        a: "Never burn any candle for more than 4 hours at a time. Burning longer can cause containers to overheat and increase the rate of oil evaporation.",
      },
      {
        q: "How do I store my candles when not in use?",
        a: "Keep your candles in a cool, dry place away from direct sunlight, heaters, and humidity to preserve fragrance oils and wax integrity.",
      },
    ],
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(allFaqs[0].category);
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({
    "0-0": true,
  });

  const toggleQuestion = (catIdx: number, qIdx: number) => {
    const key = `${catIdx}-${qIdx}`;
    setOpenQuestions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const currentCategoryData = allFaqs.find((c) => c.category === activeCategory) || allFaqs[0];
  const catIdx = allFaqs.findIndex((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-16 md:py-24 text-[#2A1B15]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 max-w-4xl space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="surprise">
            <HelpCircle className="w-3.5 h-3.5 text-[#A8742A]" />
            Atelier Knowledge Base
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-[#2A1B15] font-medium">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-[#5C463B] max-w-lg mx-auto">
            Everything you need to know about our handcrafted candles, safety guidelines, and delivery.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-[#E6D8C6] pb-4">
          {allFaqs.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeCategory === cat.category
                  ? "bg-[#2A1B15] text-[#FAF6F0] shadow-sm font-semibold"
                  : "bg-white text-[#5C463B] border border-[#E6D8C6] hover:text-[#2A1B15]"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Accordion Questions */}
        <div className="space-y-3">
          {currentCategoryData.questions.map((faq, qIdx) => {
            const isOpen = !!openQuestions[`${catIdx}-${qIdx}`];
            return (
              <div
                key={qIdx}
                className="bg-white border border-[#E6D8C6] rounded-[20px] overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggleQuestion(catIdx, qIdx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between text-base sm:text-lg font-display text-[#2A1B15] hover:text-[#A8742A] transition-colors font-medium"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#A8742A] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm sm:text-base text-[#5C463B] leading-relaxed border-t border-[#FAF6F0] pt-3">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Help Banner */}
        <div className="p-6 bg-white border border-[#E6D8C6] rounded-[24px] text-center space-y-3 shadow-xs">
          <h3 className="font-display text-xl text-[#2A1B15] font-medium">
            Still Have a Question?
          </h3>
          <p className="text-sm text-[#5C463B] max-w-md mx-auto">
            Our concierge team is available Monday to Saturday to answer queries on scents, custom orders, or candle care.
          </p>
          <div className="pt-2">
            <Link href="/contact" className="btn-primary text-xs py-2.5 px-6 inline-flex shadow-xs">
              Contact Concierge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


