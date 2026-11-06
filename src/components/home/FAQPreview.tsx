"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import { Section } from "@/components/shared/Section";
import { Badge } from "@/components/shared/Badge";

const faqs = [
  {
    q: "How does the Surprise Inside candle work?",
    a: "Every Surprise Inside candle has a hidden keepsake gift (such as a silver Laxmi coin, fine jewelry, or miniature brass diya) sealed in a heat-safe foil pouch at the bottom of the jar. As the candle burns down and approximately 1 cm of wax remains, extinguish the flame, let it cool slightly, and gently retrieve your treasure.",
  },
  {
    q: "Are the Surprise Inside candles safe to burn?",
    a: "Safety first: the gift is in a heat-safe sealed pouch at the bottom. Never leave a burning candle unattended. Stop burning when 1 cm of wax is left. Keep away from children and pets. Not suitable for children under 14.",
  },
  {
    q: "Why do you use 100% soy wax instead of paraffin?",
    a: "Traditional paraffin wax is a petroleum byproduct that emits toxic black soot. We use 100% plant-based soy wax and lead-free wicks. Soy wax burns up to 40% longer, releases fragrance cleaner, and is completely biodegradable.",
  },
  {
    q: "What payment and delivery options are available?",
    a: "We support instant UPI (Google Pay, PhonePe, Paytm), debit/credit cards, and Cash on Delivery. Orders are dispatched from our Kolkata workshop with free delivery on orders above ₹999.",
  },
];

export function FAQPreview() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <Section
      background="dark-alt"
      headerAlign="center"
      badge={
        <Badge variant="orange">
          <HelpCircle className="w-3.5 h-3.5 text-[#F28A3D]" />
          Candle Care &amp; Guidance
        </Badge>
      }
      title="Frequently asked questions"
      subtitle="Everything you need to know about burning, surprise gifts, and delivery."
    >
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="border border-[#D9A441]/25 rounded-[24px] bg-[#1A0F0A] overflow-hidden transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full p-5 md:p-6 text-left flex items-center justify-between text-base md:text-lg font-display text-[#F8EFE6] hover:text-[#F28A3D] transition-colors font-normal"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-[#D9A441] shrink-0 ml-4 transition-transform duration-200 ${
                  openIdx === idx ? "rotate-180 text-[#F28A3D]" : ""
                }`}
              />
            </button>
            {openIdx === idx && (
              <div className="px-5 md:px-6 pb-5 md:pb-6 text-sm md:text-base text-[#CDB8A6] font-light leading-relaxed border-t border-[#D9A441]/15 pt-4">
                {faq.a}
              </div>
            )}
          </div>
        ))}

        <div className="text-center pt-8">
          <Link
            href="/faq"
            className="btn-outline text-sm py-3 px-7 rounded-full inline-flex items-center gap-2"
          >
            <span>View all FAQs &amp; safety instructions</span>
            <ArrowRight className="w-4 h-4 text-[#F28A3D]" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
