import { siteConfig } from "@/config/site";
import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/shared/Badge";

export const metadata = {
  title: `Terms & Conditions | ${siteConfig.brandName}`,
  description: `Terms and conditions, candle safety policies, and legal guidelines governing ${siteConfig.brandName}.`,
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
          {/* SPECIAL SECTION: Surprise Inside & Spiral Wish Candle Safety & Terms */}
          <section className="p-5 md:p-6 rounded-[20px] bg-[#FFF8EE] border border-[#E8A33D]/50 space-y-4">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-6 h-6 text-[#A8742A] shrink-0" />
              <h2 className="font-display text-lg text-[#2A1B15] font-semibold">
                Candle Safety Guidelines & Terms (Mandatory Notice)
              </h2>
            </div>
            <div className="space-y-3 text-sm text-[#5C463B] leading-relaxed">
              <p>
                <strong className="text-[#2A1B15]">Spiral Wish Safety:</strong> Safety first: Place on a heat-proof plate or dish, never directly on wood, plastic or glass. The flame burns at the edge and wax can run, so keep 30 cm clear of anything flammable. Do not move the candle while it is lit. Burn for no more than 3 to 4 hours at a time. The gift is a metal item sealed in a heat-safe pouch inside the candle. When it appears, put out the flame, let everything cool fully, then remove it. Never leave a burning candle unattended. Keep away from children and pets. Not suitable for children under 14.
              </p>
              <p>
                <strong className="text-[#2A1B15]">Surprise Inside Glass Candle Safety:</strong> Safety first: the gift is in a heat-safe sealed pouch at the bottom. Never leave a burning candle unattended. Stop burning when 1 cm of wax is left. Keep away from children and pets. Not suitable for children under 14. The gift is metal, sealed in a heat-safe pouch at the bottom, away from the wick.
              </p>
            </div>
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
              Each candle is hand-poured in small batches using gentle soy wax blends. Due to the handcrafted nature of artisanal waxes, minor surface frosting, color nuances, or small wick differences are natural characteristics and not defects.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl text-[#2A1B15] font-semibold">
              3. Pricing & Payment
            </h2>
            <p>
              All listed product prices are in Indian Rupees (INR) as final prices with no hidden charges. We reserve the right to correct accidental pricing errors before order fulfillment.
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
              5. Customer Accounts & Stored Credentials
            </h2>
            <p>
              Customers registering an account are responsible for maintaining the confidentiality of their login credentials. Accounts are protected by automated security rate-limiting and temporary lockouts upon consecutive failed attempts. Passwords are encrypted with cryptographic hashing and are never stored in plain text.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl text-[#2A1B15] font-semibold">
              6. Jurisdiction
            </h2>
            <p>
              Any disputes arising from purchases on this website shall be subject to the exclusive jurisdiction of the competent courts in <strong>India</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
