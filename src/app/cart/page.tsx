"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Gift,
  ShieldCheck,
  Truck,
  CheckCircle,
} from "lucide-react";

export default function FullCartPage() {
  const { status } = useSession();
  const {
    items,
    updateQuantity,
    removeItem,
    getSubtotal,
    getDiscount,
    getShippingFee,
    getTotal,
    getFreeShippingRemaining,
    coupon,
    removeCoupon,
    giftWrap,
    setGiftWrap,
    giftMessage,
    setGiftMessage,
  } = useCartStore();

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shippingFee = getShippingFee();
  const total = getTotal();
  const freeRemaining = getFreeShippingRemaining();
  const threshold = siteConfig.shipping.freeShippingThreshold;
  const progressPercent = Math.min(
    100,
    Math.round(((threshold - freeRemaining) / threshold) * 100)
  );

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4 bg-[#FAF6F0]">
        <div className="w-16 h-16 bg-white border border-[#B8893C]/25 rounded-full flex items-center justify-center text-[#8C7768] shadow-xs">
          <ShoppingBag className="w-8 h-8 opacity-60" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-display text-[#3A2A22] font-medium">
          Your cart is empty
        </h1>
        <p className="text-xs text-[#6B5548] max-w-sm">
          You haven&apos;t added any handcrafted scented candles yet. Discover our bestsellers and curated gift boxes.
        </p>
        <Link href="/shop" className="btn-primary text-xs py-3 px-8 mt-2 inline-flex shadow-xs">
          Start shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-10 md:py-16">
      <div className="container-wide mx-auto">
        <h1 className="text-3xl sm:text-4xl font-display text-[#3A2A22] font-medium mb-8">
          Shopping Cart ({items.length} {items.length === 1 ? "candle" : "candles"})
        </h1>

        {/* Free Shipping Progress */}
        <div className="bg-white border border-[#B8893C]/20 p-4 rounded-2xl mb-8 shadow-xs">
          <div className="flex justify-between items-center text-xs mb-2">
            {freeRemaining === 0 ? (
              <span className="text-[#3A2A22] font-medium flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#B8893C]" /> You&apos;ve unlocked free delivery.
              </span>
            ) : (
              <span className="text-[#6B5548]">
                Add <strong className="text-[#3A2A22]">{formatPrice(freeRemaining)}</strong> more for FREE delivery
              </span>
            )}
            <span className="text-xs text-[#8C7768]">{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#FAF6F0] h-2 rounded-full overflow-hidden border border-[#B8893C]/25">
            <div
              className="bg-gradient-to-r from-[#F4C47A] to-[#B8893C] h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items Table */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#B8893C]/20 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 bg-[#FAF6F0] rounded-xl overflow-hidden shrink-0 border border-[#B8893C]/15">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg text-[#3A2A22] font-medium">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#8C7768]">
                      {item.variantName}
                    </p>
                    <p className="text-xs text-[#B8893C] font-semibold mt-1">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  {/* Quantity */}
                  <div className="flex items-center border border-[#B8893C]/30 rounded-full bg-[#FAF6F0] px-1 py-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-[#6B5548] hover:text-[#B8893C]"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-medium text-[#3A2A22]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-[#6B5548] hover:text-[#B8893C]"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="font-display text-base sm:text-lg text-[#3A2A22] font-semibold block">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-[#C98B6B] hover:underline flex items-center gap-1 mt-1 ml-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Gifting Box */}
            <div className="bg-white border border-[#B8893C]/20 p-5 rounded-2xl space-y-3 shadow-xs">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm font-medium text-[#3A2A22]">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="rounded border-[#B8893C]/30 text-[#B8893C] focus:ring-[#B8893C]"
                />
                <Gift className="w-4 h-4 text-[#E8A33D]" />
                <span>Add Luxury Gift Packaging (+ ₹99)</span>
              </label>

              {giftWrap && (
                <textarea
                  placeholder="Enter your personal gift message..."
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  maxLength={300}
                  rows={3}
                  className="w-full bg-[#FAF6F0] border border-[#B8893C]/25 p-3 text-xs rounded-xl text-[#3A2A22] placeholder-[#8C7768] focus:outline-none focus:border-[#B8893C]"
                />
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-[#B8893C]/20 p-6 rounded-2xl space-y-5 sticky top-24 shadow-xs">
              <h3 className="font-display text-lg text-[#3A2A22] border-b border-[#B8893C]/15 pb-3 font-medium">
                Order Breakdown
              </h3>

              <div className="space-y-2 text-xs text-[#6B5548]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#3A2A22] font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#B8893C]">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-[#B8893C] font-medium">FREE</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                {giftWrap && (
                  <div className="flex justify-between">
                    <span>Gift Packaging</span>
                    <span className="text-[#3A2A22]">{formatPrice(9900)}</span>
                  </div>
                )}

                <div className="flex justify-between pt-3 border-t border-[#B8893C]/15 text-sm font-semibold text-[#3A2A22]">
                  <span>Grand Total</span>
                  <span className="font-display text-xl text-[#3A2A22]">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="text-[11px] text-[#8C7768] text-right pt-0.5">
                  Final price. No hidden charges.
                </p>
              </div>

              <Link
                href={status === "authenticated" ? "/checkout" : "/login?next=/checkout"}
                className="btn-primary w-full py-3.5 text-xs flex items-center justify-center gap-2 shadow-xs"
              >
                <span>{status === "authenticated" ? "Proceed to checkout" : "Sign in to checkout"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="space-y-2 pt-4 border-t border-[#B8893C]/15 text-[11px] text-[#8C7768]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#B8893C]" />
                  <span>256-bit SSL encrypted checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#B8893C]" />
                  <span>Handcrafted with care &amp; carefully dispatched</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
