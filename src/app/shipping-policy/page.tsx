import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] py-12 md:py-20 text-[#3A2A22]">
      <div className="container-wide mx-auto max-w-4xl space-y-8">
        <div>
          <span className="text-xs text-[#B8893C] uppercase tracking-wider block mb-1">
            Fulfillment Guidelines
          </span>
          <h1 className="text-3xl sm:text-4xl font-display text-[#3A2A22] font-medium">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs text-[#8C7768] mt-1">
            Official delivery terms for {siteConfig.business.legalName}
          </p>
        </div>

        <div className="bg-white border border-[#B8893C]/20 p-6 md:p-8 rounded-2xl space-y-6 text-sm text-[#6B5548] leading-relaxed shadow-xs">
          <section className="space-y-2">
            <h2 className="font-display text-base text-[#3A2A22] font-semibold">
              1. Delivery Coverage (Kolkata & Pan-India)
            </h2>
            <p>
              All shipments originate directly from our central artisanal studio in Kolkata. Express courier delivery operates across all major Kolkata pincodes (700001 through 700100) with typical doorstep arrival in 3-5 business days. Standard pan-India delivery arrives within 3-7 business days.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-base text-[#3A2A22] font-semibold">
              2. Processing and Dispatch Time
            </h2>
            <p>
              Each candle is carefully hand-inspected, wrapped in protective eco-cushioning, and dispatched within <strong>24 to 48 hours</strong> of order verification (excluding Sundays and state festive holidays).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-base text-[#3A2A22] font-semibold">
              3. Delivery Rates & Free Shipping
            </h2>
            <div className="bg-[#FAF6F0] border border-[#B8893C]/20 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Orders ₹999 and above:</span>
                <span className="text-[#B8893C] font-semibold">FREE DELIVERY</span>
              </div>
              <div className="flex justify-between">
                <span>Orders below ₹999:</span>
                <span className="text-[#3A2A22] font-medium">{formatPrice(siteConfig.shipping.standardShippingFee)} Flat Rate</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
