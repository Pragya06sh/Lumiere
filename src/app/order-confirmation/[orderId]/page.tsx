"use client";

import { use } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getDeliveryDateRange } from "@/lib/utils";
import {
  CheckCircle,
  Truck,
  Package,
  Calendar,
  ArrowRight,
  Printer,
  Sparkles,
  Gift,
} from "lucide-react";

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const dates = getDeliveryDateRange(3, 5);

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-12 md:py-20">
      <div className="container-wide mx-auto max-w-3xl">
        <div className="bg-white border border-[#B8893C]/25 p-8 md:p-12 rounded-3xl text-center space-y-8 shadow-sm relative overflow-hidden">
          {/* Success Check Icon */}
          <div className="w-16 h-16 bg-[#FFF8EE] border-2 border-[#B8893C] rounded-full flex items-center justify-center mx-auto text-[#B8893C] shadow-xs">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#FFF8EE] border border-[#E8A33D]/30 rounded-full text-xs text-[#B8893C] font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#E8A33D]" />
              <span>Festive Light On Its Way</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display text-[#3A2A22] font-medium">
              Order Confirmed!
            </h1>
            <p className="text-sm text-[#6B5548] mt-2 max-w-lg mx-auto leading-relaxed">
              Thank you for trusting {siteConfig.brandName}. Your artisanal candles are now prepared and packaged with love in our Kolkata workshop.
            </p>
          </div>

          {/* Surprise Reveal Card Callout */}
          <div className="p-5 rounded-2xl bg-[#FFF8EE] border border-[#E8A33D]/40 text-left flex items-start gap-3.5">
            <Gift className="w-5 h-5 text-[#E8A33D] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-display text-base text-[#3A2A22] font-medium">
                Look for your Reveal Card inside the box!
              </h4>
              <p className="text-xs text-[#6B5548] leading-relaxed">
                If you ordered a Surprise Inside candle, an exclusive golden Reveal Card with a unique QR code is placed in your box. Scan it or visit <strong>/reveal</strong> when your candle burns down to unveil your blessing and claim a 10% discount on your next order.
              </p>
            </div>
          </div>

          {/* Order Details Card */}
          <div className="bg-[#FAF6F0] border border-[#B8893C]/20 p-6 rounded-2xl text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#B8893C]/15 pb-4 gap-2">
              <div>
                <span className="text-xs text-[#8C7768] block">
                  Order Reference:
                </span>
                <span className="text-base font-mono font-semibold text-[#3A2A22]">
                  #{orderId}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#8C7768] block">
                  Status:
                </span>
                <span className="badge badge-gold text-[10px]">
                  Order Placed & Queued
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#B8893C] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#8C7768] block">Estimated Delivery Window:</span>
                  <span className="font-semibold text-[#3A2A22]">
                    {dates.from} – {dates.to}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#B8893C] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#8C7768] block">Fulfillment Hub:</span>
                  <span className="text-[#3A2A22]">
                    Park Street Dispatch Center, Kolkata
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => window.print()}
              className="btn-outline text-xs py-3 px-6 bg-white inline-flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Tax Invoice</span>
            </button>
            <Link
              href={`/track-order?orderId=${encodeURIComponent(orderId)}`}
              className="btn-primary text-xs py-3 px-6 shadow-sm inline-flex items-center justify-center gap-2"
            >
              <span>Track Live Delivery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
