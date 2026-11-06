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
  const giftSets = products.filter((p) => p.category.includes("gift-hampers") || p.collections.includes("diwali-gifting"));

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    units: "25-50 units",
    budget: "₹1,000 - ₹2,000 per hamper",
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
            <span>Festive & Corporate Gifting</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-[#3A2A22] font-medium">
            Hampers Poured with Meaning
          </h1>

          <p className="text-sm sm:text-base text-[#6B5548] leading-relaxed max-w-2xl mx-auto">
            Bespoke handcrafted Diwali hampers with crackling wood wicks, auspicious Indian fragrances, handcrafted brass diyas, and personalized festive packaging.
          </p>
        </div>

        {/* Curation of Gift Sets */}
        <div>
          <div className="flex items-center justify-between border-b border-[#B8893C]/20 pb-4 mb-8">
            <h2 className="text-2xl font-display text-[#3A2A22] font-medium">
              Curated Festive Hampers
            </h2>
            <Link
              href="/shop?category=gift-hampers"
              className="text-xs text-[#B8893C] hover:underline font-medium flex items-center gap-1"
            >
              <span>View all hampers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {giftSets.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>

        {/* Corporate Bulk Inquiries Section */}
        <div className="bg-white border border-[#B8893C]/20 p-8 md:p-12 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center shadow-xs">
          {/* Left: Perks */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-[#B8893C] uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-[#E8A33D]" />
              <span>Corporate & Wedding Suites</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display text-[#3A2A22] font-medium leading-tight">
              Elevate Your Corporate & Celebration Gifting
            </h3>

            <p className="text-sm text-[#6B5548] leading-relaxed">
              We partner with businesses, family events, and wedding planners for bespoke candle hampers and custom engraved brass lids.
            </p>

            <div className="space-y-3 text-xs text-[#6B5548]">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#B8893C] shrink-0" />
                <span>Custom sleeve branding & personalized greeting cards</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#B8893C] shrink-0" />
                <span>Bespoke fragrance formulations for bulk orders</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#B8893C] shrink-0" />
                <span>Doorstep multi-address dispatch across India</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#B8893C] shrink-0" />
                <span>GST invoices with corporate input tax credit</span>
              </div>
            </div>
          </div>

          {/* Right: Enquiry Form */}
          <div className="lg:col-span-7 bg-[#FAF6F0] border border-[#B8893C]/20 p-6 md:p-8 rounded-2xl">
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-white border border-[#B8893C] rounded-full flex items-center justify-center mx-auto text-[#B8893C]">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h4 className="font-display text-xl text-[#3A2A22] font-medium">
                  Inquiry Received!
                </h4>
                <p className="text-xs text-[#6B5548] max-w-sm mx-auto">
                  Our corporate gifting coordinator in Kolkata will review your requirements and reach out within 4 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-outline text-xs py-2 px-6 bg-white"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#6B5548] font-medium block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rohini Sen"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-[#6B5548] font-medium block mb-1">
                      Organization / Event
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Bengal Heritage Club / Wedding"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#6B5548] font-medium block mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rohini@company.com"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-[#6B5548] font-medium block mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9830123456"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#6B5548] font-medium block mb-1">
                      Estimated Quantity
                    </label>
                    <select
                      value={formData.units}
                      onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                      className="input-field"
                    >
                      <option value="10-25 units">10 – 25 Hampers</option>
                      <option value="25-50 units">25 – 50 Hampers</option>
                      <option value="50-100 units">50 – 100 Hampers</option>
                      <option value="100+ units">100+ Custom Suite</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#6B5548] font-medium block mb-1">
                      Budget Per Hamper
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="input-field"
                    >
                      <option value="₹500 - ₹1,000">₹500 – ₹1,000</option>
                      <option value="₹1,000 - ₹2,000">₹1,000 – ₹2,000</option>
                      <option value="₹2,000 - ₹3,500">₹2,000 – ₹3,500</option>
                      <option value="Luxury Custom">Luxury Bespoke</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[#6B5548] font-medium block mb-1">
                    Special Packaging / Fragrance Requests
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your event timeline, custom sleeve logo, or preferred scent notes..."
                    className="input-field"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 text-xs flex items-center justify-center gap-2 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? "Transmitting..." : "Submit Hamper Inquiry"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
