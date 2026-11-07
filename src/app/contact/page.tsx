"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import {
  Clock,
  Send,
  MessageCircle,
  CheckCircle,
  Sparkles,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/shared/Badge";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    orderNumber: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const rawWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const whatsappUrl = cleanWhatsApp
    ? `https://wa.me/${cleanWhatsApp.length === 10 ? `91${cleanWhatsApp}` : cleanWhatsApp}?text=${encodeURIComponent(
        `Hello ${siteConfig.brandName}, I have an inquiry regarding your candles.`
      )}`
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Unable to send message. Please verify your details.");
      } else {
        setSubmitted(true);
        setFormData({
          name: "",
          phone: "",
          orderNumber: "",
          message: "",
        });
      }
    } catch (err: any) {
      setErrorMessage("Network error. Please try again or reach out on Instagram.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-16 md:py-24 text-[#2A1B15]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 max-w-5xl space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="surprise">
            <Sparkles className="w-3.5 h-3.5 text-[#A8742A]" />
            Customer Care &amp; Support
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-[#2A1B15] font-medium">
            Contact Concierge
          </h1>
          <p className="text-base text-[#5C463B] max-w-md mx-auto">
            Have a question about your order, scent recommendations, or bespoke candle requests?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E6D8C6] p-5 md:p-6 rounded-[20px] space-y-5 shadow-sm">
              <h3 className="font-display text-xl text-[#2A1B15] border-b border-[#E6D8C6] pb-3 font-medium">
                Customer Care &amp; Atelier
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <InstagramIcon className="w-5 h-5 text-[#A8742A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#2A1B15] font-semibold block">Instagram:</span>
                    <a
                      href={siteConfig.contact.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5C463B] hover:text-[#F28A3D] transition-colors"
                    >
                      {siteConfig.contact.instagramHandle}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#A8742A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#2A1B15] font-semibold block">Crafted &amp; Dispatched From:</span>
                    <span className="text-[#5C463B]">{siteConfig.business.address}</span>
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

              {/* Direct WhatsApp Action Button (if configured) */}
              {whatsappUrl && (
                <div className="pt-4 border-t border-[#E6D8C6]">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#1B5E20] hover:bg-[#144718] text-white p-3.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Chat With Us on WhatsApp</span>
                  </a>
                </div>
              )}
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
                    Thank you. Our customer care team has received your note and will reach out to you via phone or WhatsApp shortly.
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
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

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
                        Phone / WhatsApp (10 digits) *
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                        placeholder="e.g. 9876543210"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#2A1B15] font-semibold block mb-1">
                      Order Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                      placeholder="e.g. WW-2026-..."
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="text-[#2A1B15] font-semibold block mb-1">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can our concierge assist you today?"
                      className="input-field resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <span>{loading ? "Transmitting..." : "Send Message"}</span>
                    <Send className="w-4 h-4" />
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
