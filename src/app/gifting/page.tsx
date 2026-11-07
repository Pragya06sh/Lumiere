"use client";

import { useState } from "react";
import Link from "next/link";
import { products } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { siteConfig } from "@/config/site";
import {
  Gift,
  Building2,
  CheckCircle,
  Send,
  Sparkles,
  Heart,
  ArrowRight,
} from "lucide-react";

export default function GiftingPage() {
  const giftSets = products.filter(
    (p) =>
      p.category.includes("gift-hampers") ||
      p.category.includes("gift-boxes") ||
      p.collections.includes("diwali-gifting") ||
      p.collections.includes("luxury-picks")
  );

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    units: "25-50 units",
    budget: "₹1,000 - ₹2,000 per gift set",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-12 md:py-20 text-[#3A2A22]">
      <div className="container-wide mx-auto space-y-16">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white border border-[#B8893C]/30 rounded-full text-xs font-medium text-[#B8893C] shadow-xs">
            <Gift className="w-3.5 h-3.5 text-[#E8A33D]" />
            <span>Bespoke &amp; Corporate Gifting</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-[#3A2A22]">
            Gifts Poured with Meaning
          </h1>

          <p className="text-base text-[#6B5548] max-w-2xl mx-auto leading-relaxed">
            Bespoke handcrafted gift sets with cotton wicks, signature fragrances, and personalized luxury packaging.
          </p>
        </div>

        {/* Catalog Showcase */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#B8893C]/20 pb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-display font-medium text-[#3A2A22]">
                Curated Gift Boxes
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-medium text-[#B8893C] hover:underline flex items-center gap-1"
            >
              <span>View all gift sets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {giftSets.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>

        {/* Corporate Services Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#B8893C]/20 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#B8893C]">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-medium text-[#3A2A22]">
              Corporate Branding
            </h3>
            <p className="text-xs text-[#6B5548] leading-relaxed">
              Custom sleeve printing with your company logo, customized message cards, and bespoke wax colors matching your brand palette.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#B8893C]/20 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#B8893C]">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-medium text-[#3A2A22]">
              Wedding &amp; Special Events
            </h3>
            <p className="text-xs text-[#6B5548] leading-relaxed">
              We partner with families, event coordinators, and wedding planners for bespoke candle gift boxes and custom engraved lids.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#B8893C]/20 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#B8893C]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-medium text-[#3A2A22]">
              Direct Pan-India Fulfillment
            </h3>
            <p className="text-xs text-[#6B5548] leading-relaxed">
              Share your recipient roster via spreadsheet and we deliver directly to employee and client doorsteps with real-time tracking.
            </p>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-[#B8893C]/25 shadow-sm space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-display font-medium text-[#3A2A22]">
              Request a Custom Gifting Proposal
            </h2>
            <p className="text-xs text-[#6B5548]">
              Our corporate gifting coordinator will review your requirements and reach out within 4 business hours.
            </p>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 bg-[#FAF6F0] rounded-full flex items-center justify-center mx-auto text-[#2D6A4F]">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-medium text-[#3A2A22]">
                Inquiry Received
              </h3>
              <p className="text-xs text-[#6B5548] max-w-sm mx-auto">
                Thank you for considering {siteConfig.brandName}. A gifting specialist will contact you shortly with catalog options and pricing.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-[#3A2A22] block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sreya Sen"
                    className="w-full bg-[#FAF6F0] border border-[#B8893C]/30 rounded-xl px-4 py-2.5 text-xs text-[#3A2A22] focus:outline-none focus:border-[#B8893C]"
                  />
                </div>

                <div>
                  <label className="font-medium text-[#3A2A22] block mb-1">
                    Company / Organization (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Tata Consultancy Services"
                    className="w-full bg-[#FAF6F0] border border-[#B8893C]/30 rounded-xl px-4 py-2.5 text-xs text-[#3A2A22] focus:outline-none focus:border-[#B8893C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-[#3A2A22] block mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sreya@company.com"
                    className="w-full bg-[#FAF6F0] border border-[#B8893C]/30 rounded-xl px-4 py-2.5 text-xs text-[#3A2A22] focus:outline-none focus:border-[#B8893C]"
                  />
                </div>

                <div>
                  <label className="font-medium text-[#3A2A22] block mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98300 00000"
                    className="w-full bg-[#FAF6F0] border border-[#B8893C]/30 rounded-xl px-4 py-2.5 text-xs text-[#3A2A22] focus:outline-none focus:border-[#B8893C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-[#3A2A22] block mb-1">
                    Estimated Quantity
                  </label>
                  <select
                    value={formData.units}
                    onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#B8893C]/30 rounded-xl px-4 py-2.5 text-xs text-[#3A2A22] focus:outline-none focus:border-[#B8893C]"
                  >
                    <option value="10-25 units">10 – 25 Sets</option>
                    <option value="25-50 units">25 – 50 Sets</option>
                    <option value="50-100 units">50 – 100 Sets</option>
                    <option value="100-250 units">100 – 250 Sets</option>
                    <option value="250+ units">250+ Sets</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-[#3A2A22] block mb-1">
                    Budget Per Gift Set
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#B8893C]/30 rounded-xl px-4 py-2.5 text-xs text-[#3A2A22] focus:outline-none focus:border-[#B8893C]"
                  >
                    <option value="Under ₹1,000">Under ₹1,000</option>
                    <option value="₹1,000 - ₹2,000 per gift set">₹1,000 – ₹2,000</option>
                    <option value="₹2,000 - ₹3,500">₹2,000 – ₹3,500</option>
                    <option value="₹3,500+">₹3,500+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-[#3A2A22] block mb-1">
                  Customization Details &amp; Timeline
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about the occasion, preferred delivery dates, logo branding requirements, or specific scents you have in mind..."
                  className="w-full bg-[#FAF6F0] border border-[#B8893C]/30 rounded-xl px-4 py-2.5 text-xs text-[#3A2A22] focus:outline-none focus:border-[#B8893C] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <span>{loading ? "Transmitting..." : "Submit Gifting Inquiry"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
