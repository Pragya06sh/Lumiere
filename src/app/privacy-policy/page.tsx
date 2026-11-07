import { siteConfig } from "@/config/site";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] py-12 md:py-20 text-[#3A2A22]">
      <div className="container-wide mx-auto max-w-4xl space-y-8">
        <div>
          <span className="text-xs text-[#B8893C] uppercase tracking-wider block mb-1">
            Privacy & Trust
          </span>
          <h1 className="text-3xl sm:text-4xl font-display text-[#3A2A22] font-medium">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#8C7768] mt-1">
            How {siteConfig.business.legalName} protects your personal information
          </p>
        </div>

        <div className="bg-white border border-[#B8893C]/20 p-6 md:p-8 rounded-2xl space-y-6 text-sm text-[#6B5548] leading-relaxed shadow-xs">
          <section className="space-y-2">
            <h2 className="font-display text-base text-[#3A2A22] font-semibold">
              1. Information We Collect
            </h2>
            <p>
              When you place an order or contact us, we collect necessary fulfillment information: your name, delivery address, phone number, and email. We never sell, rent, or disclose your personal contact information to any third-party advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-base text-[#3A2A22] font-semibold">
              2. Payment Data Security
            </h2>
            <p>
              We do not store your credit/debit card details or UPI credentials on our servers. All financial transactions are securely processed by Razorpay using bank-grade 256-bit encryption compliant with PCI-DSS standards.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-base text-[#3A2A22] font-semibold">
              3. Reveal Code Photos
            </h2>
            <p>
              When customers voluntarily upload photos of their revealed gifts on the /reveal page, these photos may be displayed in our customer community gallery to celebrate discoveries with fellow candle lovers. No sensitive personal data is attached to these images.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-base text-[#3A2A22] font-semibold">
              4. Customer Accounts & Stored Data
            </h2>
            <p>
              When you create an account, we store your full name, email address, contact phone number, and hashed passwords using industry-standard bcrypt encryption. Passwords are never stored or accessible in plain text. Saved delivery addresses and order histories are maintained securely to facilitate expedited checkout, order tracking, and keepsake reveal verification. You may update your profile details or request account removal at any time by contacting our concierge team.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
