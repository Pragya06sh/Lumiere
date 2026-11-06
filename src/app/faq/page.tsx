"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Badge } from "@/components/shared/Badge";

const allFaqs = [
  {
    category: "Surprise Inside Candle Safety (Important)",
    questions: [
      {
        q: "What are the essential safety rules for burning Surprise Inside candles?",
        a: "Safety first: the gift is in a heat-safe sealed pouch at the bottom. Never leave a burning candle unattended. Stop burning when 1 cm of wax is left. Keep away from children and pets. Not suitable for children under 14.",
      },
      {
        q: "How is the gift protected from heat and fire inside the candle?",
        a: "Each keepsake gift is double-wrapped in industrial heat-resistant aluminum foil pouches tested to withstand temperatures exceeding 300°C. The pouch sits securely on the bottom glass base beneath the wick tabs so it never comes into contact with the open flame.",
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
    category: "Delivery in Kolkata & Pan-India",
    questions: [
      {
        q: "Which areas of Kolkata do you service?",
        a: "We currently deliver directly across all major Kolkata pincodes from 700001 to 700100 (including Park Street, Ballygunge, Alipore, Salt Lake, New Town, Jadavpur, Behala, Dum Dum, and Howrah). Standard dispatch takes 3-5 business days.",
      },
      {
        q: "How does Free Delivery work?",
        a: "Free shipping is automatically applied at checkout whenever your cart subtotal reaches ₹999 or higher. For orders below ₹999, a flat delivery fee of ₹79 applies.",
      },
    ],
  },
  {
    category: "Payments & Orders",
    questions: [
      {
        q: "Can I pay using BHIM UPI, cards, or Cash on Delivery?",
        a: "Yes! We support instant UPI QR scanning (Google Pay, PhonePe, Paytm), credit/debit cards, net banking via Razorpay, as well as Cash on Delivery across serviceable pincodes.",
      },
      {
        q: "Do prices include GST?",
        a: "Yes, all prices listed on our website are inclusive of 18% GST. A compliant tax invoice is included in your parcel and available digitally.",
      },
    ],
  },
  {
    category: "Candle Care & Burning Instructions",
    questions: [
      {
        q: "Why is the first burn so critical?",
        a: "On your very first light, allow the candle to burn continuously for 2-3 hours until the melted wax pool reaches all outer edges of the glass jar. Wax has memory—allowing a complete pool prevents tunneling on future burns.",
      },
      {
        q: "How do I take care of the crackling wood wick?",
        a: "Before every lighting, gently pinch or trim off the charred tip of the wood wick to approximately 4-5mm. This ensures a clean flame without excess smoke or flickering.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string>("0-0");

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 max-w-3xl space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="surprise">
            <HelpCircle className="w-3.5 h-3.5 text-[#A8742A]" />
            Candle Care & Safety Guidelines
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-[#2A1B15] font-medium">
            Frequently Asked Questions
          </h1>

          <p className="text-base text-[#5C463B] leading-relaxed max-w-xl mx-auto">
            Essential instructions on surprise candle safety, pure soy wax care, and Kolkata fulfillment.
          </p>
        </div>

        {/* Categories of FAQs */}
        <div className="space-y-12">
          {allFaqs.map((section, sIdx) => (
            <div key={section.category} className="space-y-4">
              <h2 className="font-display text-2xl text-[#2A1B15] font-medium border-b border-[#E6D8C6] pb-3">
                {section.category}
              </h2>

              <div className="space-y-3">
                {section.questions.map((q, qIdx) => {
                  const key = `${sIdx}-${qIdx}`;
                  const isOpen = openItem === key;

                  return (
                    <div
                      key={q.q}
                      className="border border-[#E6D8C6] rounded-[20px] bg-white overflow-hidden shadow-sm transition-all"
                    >
                      <button
                        onClick={() => setOpenItem(isOpen ? "" : key)}
                        className="w-full p-5 text-left flex items-center justify-between text-base font-display text-[#2A1B15] hover:text-[#5A1E1E] transition-colors font-medium"
                      >
                        <span>{q.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-[#5C463B] shrink-0 ml-4 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-[#5A1E1E]" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-0 text-sm text-[#5C463B] leading-relaxed border-t border-[#E6D8C6] pt-3">
                          {q.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support CTA */}
        <div className="bg-white border border-[#E6D8C6] p-6 md:p-8 text-center rounded-[20px] space-y-3 shadow-sm">
          <h3 className="font-display text-2xl text-[#2A1B15] font-medium">
            Have a custom query or corporate gifting inquiry?
          </h3>
          <p className="text-sm text-[#5C463B] max-w-md mx-auto">
            Our Kolkata workshop team is always happy to assist you over WhatsApp or email.
          </p>
          <div className="pt-3">
            <Link href="/contact" className="btn-primary text-base py-3 px-8 shadow-sm inline-flex">
              Contact our team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
