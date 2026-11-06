import { siteConfig } from "@/config/site";
import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/shared/Badge";

export const metadata = {
  title: "Terms & Conditions | Lumière Festive Candles",
  description: "Terms and conditions, surprise candle safety policies, and legal guidelines governing Lumière Candles.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] py-16 md:py-24 text-[#2A1B15]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 max-w-4xl space-y-8">
        <div className="space-y-2">
          <Badge variant="surprise">
            Store Policies & Legal
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-[#2A1B15] font-medium">
            Terms & Conditions
          </h1>
          <p className="text-sm text-[#5C463B]">
            Governing all orders placed on {siteConfig.url}
          </p>
        </div>

        <div className="bg-white border border-[#E6D8C6] p-6 md:p-8 rounded-[20px] space-y-8 text-base text-[#5C463B] leading-relaxed shadow-sm">
          {/* SPECIAL SECTION: Surprise Inside Candle Safety & Terms */}
          <section className="p-5 md:p-6 rounded-[20px] bg-[#FFF8EE] border border-[#E8A33D]/50 space-y-3">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-6 h-6 text-[#A8742A] shrink-0" />
              <h2 className="font-display text-lg text-[#2A1B15] font-semibold">
                Surprise Inside Candle Safety Terms (Mandatory Notice)
              </h2>
            </div>
            <p className="text-sm text-[#5C463B] leading-relaxed">
              <strong className="text-[#2A1B15]">Safety first:</strong> The gift is in a heat-safe sealed pouch at the bottom. Never leave a burning candle unattended. Stop burning when 1 cm of wax is left. Keep away from children and pets. Not suitable for children under 14.
            </p>
            <p className="text-sm text-[#5C463B] leading-relaxed">
              Customers purchasing Surprise Inside Candles acknowledge that the hidden gift is safely encapsulated in heat-resistant, fireproof wrapping at the base of the candle jar. Under no circumstances should customers probe, dig, or reach into liquid hot wax while the wick is burning. Extinguish flame, wait for wax to cool slightly, and use tongs to retrieve the pouch.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl text-[#2A1B15] font-semibold">
              1. Store Agreement
            </h2>
            <p>
              By accessing our store and placing an order with <strong>{siteConfig.brandName}</strong>, operated by {siteConfig.business.legalName}, you agree to be bound by these Terms and Conditions and our associated store policies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl text-[#2A1B15] font-semibold">
              2. Product Descriptions & Artisan Variations
            </h2>
            <p>
              Each candle is hand-poured in small batches in Kolkata using natural soy and coconut waxes. Due to the handcrafted nature of natural waxes, minor surface frosting, color nuances, or microscopic wick differences are natural characteristics of pure soy and not defects.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl text-[#2A1B15] font-semibold">
              3. Pricing, GST & Payment
            </h2>
            <p>
              All listed product prices are in Indian Rupees (INR) and include applicable 18% Goods and Services Tax (GST). We reserve the right to correct accidental pricing errors before order fulfillment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl text-[#2A1B15] font-semibold">
              4. General Candle Safety & Liability Waiver
            </h2>
            <p>
              Customers agree to strictly observe candle burning guidelines printed on each jar and safety card: never leave flames unattended, keep clear of drafts, children, and pets, and trim wicks to 5mm. {siteConfig.business.legalName} is not liable for damages resulting from unattended flames or improper placement on flammable surfaces.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl text-[#2A1B15] font-semibold">
              5. Jurisdiction
            </h2>
            <p>
              Any disputes arising from purchases on this website shall be subject to the exclusive jurisdiction of the competent courts in <strong>Kolkata, West Bengal, India</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
