"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  Search,
  Truck,
  CheckCircle,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/shared/Badge";

const orderSteps = [
  { status: "PLACED", label: "Order Placed", desc: "Received at atelier" },
  { status: "CONFIRMED", label: "Confirmed", desc: "Wax blend allocated" },
  { status: "PACKED", label: "Hand Packed", desc: "Sealed with surprise card" },
  { status: "SHIPPED", label: "Dispatched", desc: "In transit via courier" },
  { status: "OUT_FOR_DELIVERY", label: "Out For Delivery", desc: "On the way" },
  { status: "DELIVERED", label: "Delivered", desc: "Light and celebrate" },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("orderId") || "";

  const [orderInput, setOrderInput] = useState(initialId);
  const [searchedOrder, setSearchedOrder] = useState<string | null>(initialId || null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderInput.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setSearchedOrder(orderInput.trim().toUpperCase());
      setIsLoading(false);
    }, 350);
  };

  const currentStepIndex = 2; // "Packed"

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-16 md:py-24 text-[#2A1B15]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 max-w-3xl space-y-10">
        <div className="text-center space-y-3">
          <Badge variant="surprise">
            <Truck className="w-3.5 h-3.5 text-[#A8742A]" />
            Fulfillment Tracking
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-[#2A1B15] font-medium">
            Track Your Candle Shipment
          </h1>
          <p className="text-base text-[#5C463B] max-w-md mx-auto">
            Enter your order reference number to see real-time dispatch updates.
          </p>
        </div>

        {/* Lookup Form */}
        <form onSubmit={handleSearch} className="bg-white border border-[#E6D8C6] p-5 md:p-6 rounded-[20px] shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-[#5C463B] absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Enter Order Reference (e.g. LUM-8923 or ORD-102)"
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                className="w-full bg-[#FAF6F0] border border-[#E6D8C6] px-4 py-3 pl-11 text-sm text-[#2A1B15] font-mono rounded-xl placeholder-[#5C463B] focus:border-[#5A1E1E] outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary text-base py-3 px-8 shadow-sm flex items-center justify-center gap-2"
            >
              <span>{isLoading ? "Checking..." : "Track Status"}</span>
            </button>
          </div>
        </form>

        {/* Order Result Card */}
        {searchedOrder && (
          <div className="bg-white border border-[#E6D8C6] p-6 md:p-8 rounded-[20px] space-y-8 shadow-sm animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E6D8C6] pb-4 gap-2">
              <div>
                <span className="text-xs text-[#5C463B] block">Tracking Order:</span>
                <span className="text-lg font-mono font-bold text-[#2A1B15]">
                  #{searchedOrder}
                </span>
              </div>
              <div className="text-left sm:text-right">
                <Badge variant="gold">
                  Fulfillment: In Preparation
                </Badge>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-6">
              {orderSteps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.status} className="flex gap-4 relative">
                    {/* Line connecting steps */}
                    {idx < orderSteps.length - 1 && (
                      <div
                        className={`absolute left-3.5 top-8 bottom-0 w-0.5 -ml-[1px] ${
                          idx < currentStepIndex ? "bg-[#5A1E1E]" : "bg-[#E6D8C6]"
                        }`}
                      />
                    )}

                    {/* Step Icon */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                        isCompleted
                          ? "bg-[#5A1E1E] text-white"
                          : "bg-[#FAF6F0] text-[#5C463B] border border-[#E6D8C6]"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-mono">{idx + 1}</span>
                      )}
                    </div>

                    {/* Step Text */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            isCurrent
                              ? "text-[#5A1E1E]"
                              : isCompleted
                              ? "text-[#2A1B15]"
                              : "text-[#5C463B]"
                          }`}
                        >
                          {step.label}
                        </span>
                        {isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-[#E8A33D] animate-ping" />
                        )}
                      </div>
                      <p className="text-xs text-[#5C463B] mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Support Callout */}
            <div className="bg-[#FAF6F0] border border-[#E6D8C6] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#A8742A]" />
                <span className="text-[#5C463B]">
                  Dispatched from Central Fulfillment Atelier
                </span>
              </div>
              {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ? (
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER.replace(/[^0-9]/g, "").length === 10 ? `91${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}` : process.env.NEXT_PUBLIC_WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Namaste, I need assistance with order #${searchedOrder}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5A1E1E] hover:underline flex items-center gap-1.5 font-semibold"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Dispatch Desk</span>
                </a>
              ) : (
                <Link
                  href="/contact"
                  className="text-[#5A1E1E] hover:underline flex items-center gap-1.5 font-semibold"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Concierge</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F0] p-12 text-center text-[#5C463B]">Loading Tracking...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
