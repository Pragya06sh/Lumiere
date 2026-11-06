"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Send,
  MessageCircle,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/shared/Badge";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Order Inquiry",
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
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Order Inquiry",
        message: "",
      });
    }, 600);
  };

  const whatsappDirectUrl = `https://wa.me/91${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    "Namaste Lumière team! I have a question about your Diwali candles & hampers."
  )}`;

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-16 md:py-24 text-[#2A1B15]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 max-w-5xl space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="surprise">
            <Sparkles className="w-3.5 h-3.5 text-[#A8742A]" />
            Kolkata Studio & Support
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-[#2A1B15] font-medium">
            Contact & Customer Care
          </h1>
          <p className="text-base text-[#5C463B] max-w-md mx-auto">
            Have a question about your Diwali order, scent recommendations, or festive customization?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E6D8C6] p-5 md:p-6 rounded-[20px] space-y-5 shadow-sm">
              <h3 className="font-display text-xl text-[#2A1B15] border-b border-[#E6D8C6] pb-3 font-medium">
                Kolkata Workshop Details
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#A8742A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#2A1B15] font-semibold block">Studio Address:</span>
                    <span className="text-[#5C463B]">{siteConfig.business.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#A8742A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#2A1B15] font-semibold block">Email Support:</span>
                    <a href={`mailto:${siteConfig.contact.email}`} className="text-[#5C463B] hover:text-[#5A1E1E]">
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#A8742A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#2A1B15] font-semibold block">Phone / WhatsApp:</span>
                    <span className="text-[#5C463B]">{siteConfig.contact.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#A8742A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#2A1B15] font-semibold block">Operating Hours:</span>
                    <span className="text-[#5C463B]">Monday – Saturday: 10:00 AM – 8:00 PM IST</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action Button */}
              <div className="pt-4 border-t border-[#E6D8C6]">
                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#1B5E20] hover:bg-[#144718] text-white p-3.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat With Us on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E6D8C6] p-5 md:p-6 rounded-[20px] shadow-sm">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 bg-[#FFF8EE] border border-[#E6D8C6] rounded-full flex items-center justify-center mx-auto text-[#1B5E20]">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl text-[#2A1B15] font-medium">
                    Message Received
                  </h3>
                  <p className="text-sm text-[#5C463B] max-w-sm mx-auto">
                    Thank you. Our workshop team in Kolkata will review your note and respond shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-outline text-sm py-2.5 px-6 bg-white"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#2A1B15] font-semibold block mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sreya Sen"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-[#2A1B15] font-semibold block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="sreya@example.com"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#2A1B15] font-semibold block mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="9830123456"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-[#2A1B15] font-semibold block mb-1">
                        Inquiry Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="input-field"
                      >
                        <option value="Order Inquiry">Order & Delivery Status</option>
                        <option value="Surprise Candle Question">Surprise Inside Candle Question</option>
                        <option value="Corporate Gifting">Diwali Hamper / Bulk Gifting</option>
                        <option value="Other">Other Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[#2A1B15] font-semibold block mb-1">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your note here..."
                      className="input-field"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 shadow-sm font-semibold"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? "Sending..." : "Send Message"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
