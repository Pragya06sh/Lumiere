import { siteConfig } from "@/config/site";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] py-12 md:py-20 text-[#3A2A22]">
      <div className="container-wide mx-auto max-w-4xl space-y-8">
        <div>
          <span className="text-xs text-[#B8893C] uppercase tracking-wider block mb-1">
            Customer Guarantee
          </span>
          <h1 className="text-3xl sm:text-4xl font-display text-[#3A2A22] font-medium">
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs text-[#8C7768] mt-1">
            Care policies for {siteConfig.brandName} customers
          </p>
        </div>

        <div className="bg-white border border-[#B8893C]/20 p-6 md:p-8 rounded-2xl space-y-6 text-sm text-[#6B5548] leading-relaxed shadow-xs">
          <section className="space-y-2">
            <h2 className="font-display text-base text-[#3A2A22] font-semibold">
              1. Damaged or Broken in Transit
            </h2>
            <p>
              While we use heavy bubble padding and rigid gift boxes, glass candle jars can occasionally suffer transit damage. If your candle arrives broken or cracked, please take a photo and WhatsApp us at <strong>{siteConfig.contact.phone}</strong> or email <strong>{siteConfig.contact.email}</strong> within 48 hours of delivery. We will immediately dispatch a free replacement or issue a 100% refund without questions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-base text-[#3A2A22] font-semibold">
              2. Order Cancellation
            </h2>
            <p>
              Orders may be cancelled free of charge prior to dispatch (typically within 4 hours of placement). Once an order has been picked up by our courier partner in Kolkata, cancellations can no longer be processed.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-base text-[#3A2A22] font-semibold">
              3. Unused & Burned Candles
            </h2>
            <p>
              Due to hygiene and natural botanical composition, candles that have already been lit or burned cannot be returned or refunded unless there is an evident wick defect.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
