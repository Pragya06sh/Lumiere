"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import {
  X,
  Plus,
  Minus,
  Trash2,
  Gift,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getDiscount,
    getShippingFee,
    getTotal,
    getFreeShippingRemaining,
    coupon,
    applyCoupon,
    removeCoupon,
    giftWrap,
    setGiftWrap,
    giftMessage,
    setGiftMessage,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shippingFee = getShippingFee();
  const total = getTotal();
  const freeShippingRemaining = getFreeShippingRemaining();
  const freeShippingTarget = siteConfig.shipping.freeShippingThreshold;
  const progressPercent = Math.min(
    100,
    Math.round(((freeShippingTarget - freeShippingRemaining) / freeShippingTarget) * 100)
  );

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    try {
      const code = couponInput.trim().toUpperCase();
      if (code === "DIWALI20") {
        if (subtotal < 99900) {
          setCouponError("Minimum order ₹999 required for DIWALI20");
        } else {
          applyCoupon({
            code: "DIWALI20",
            type: "PERCENTAGE",
            value: 20,
            discountAmount: Math.min(Math.round((subtotal * 20) / 100), 50000),
            minOrder: 99900,
          });
          setCouponInput("");
        }
      } else if (code === "FIRST100") {
        if (subtotal < 49900) {
          setCouponError("Minimum order ₹499 required for FIRST100");
        } else {
          applyCoupon({
            code: "FIRST100",
            type: "FLAT",
            value: 10000,
            discountAmount: 10000,
            minOrder: 49900,
          });
          setCouponInput("");
        }
      } else if (code === "SURPRISE10") {
        applyCoupon({
          code: "SURPRISE10",
          type: "PERCENTAGE",
          value: 10,
          discountAmount: Math.round((subtotal * 10) / 100),
        });
        setCouponInput("");
      } else {
        setCouponError("Invalid coupon code");
      }
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#FAF6F0] border-l border-[#E6D8C6] h-full flex flex-col justify-between shadow-2xl z-10 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#E6D8C6] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#A8742A]" />
            <h2 className="font-display text-lg text-[#2A1B15] font-semibold">
              Your Festive Cart ({items.length})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-[#5C463B] hover:text-[#2A1B15] transition-colors rounded-full"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-[#FFF8EE] px-5 py-3 border-b border-[#E8A33D]/30">
          <div className="flex items-center justify-between text-xs mb-1.5">
            {freeShippingRemaining === 0 ? (
              <span className="text-[#2A1B15] font-semibold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#1B5E20]" /> You qualify for FREE delivery!
              </span>
            ) : (
              <span className="text-[#5C463B]">
                Add <strong className="text-[#2A1B15]">{formatPrice(freeShippingRemaining)}</strong> more for FREE delivery
              </span>
            )}
            <span className="text-xs font-semibold text-[#5C463B]">{progressPercent}%</span>
          </div>
          <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#E8A33D]/30">
            <div
              className="bg-[#A8742A] h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-14 h-14 bg-white border border-[#E6D8C6] rounded-full flex items-center justify-center mx-auto text-[#5C463B] shadow-sm">
                <ShoppingBag className="w-7 h-7 opacity-60" />
              </div>
              <p className="font-display text-lg text-[#2A1B15] font-medium">
                Your cart is empty
              </p>
              <p className="text-sm text-[#5C463B] max-w-xs mx-auto">
                Explore our handcrafted festive scented candles and surprise inside editions.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="btn-primary inline-flex text-sm py-2.5 px-6 shadow-sm"
              >
                Browse candles
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-white border border-[#E6D8C6] rounded-[20px] relative shadow-sm"
              >
                {/* Product Image */}
                <div className="relative w-20 h-20 bg-[#FAF6F0] border border-[#E6D8C6] rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-display text-base text-[#2A1B15] font-medium leading-tight">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#5C463B] hover:text-[#5A1E1E] p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-[#5C463B] block mt-1">
                      {item.variantName}
                      {item.giftAudience && (
                        <span className="ml-1.5 text-[#F28A3D] font-medium">
                          • For: {item.giftAudience}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#E6D8C6] rounded-full bg-[#FAF6F0] px-1.5 py-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-[#5A1E1E] transition-colors rounded-full"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5 text-[#2A1B15]" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-[#2A1B15]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-[#5A1E1E] transition-colors rounded-full"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#2A1B15]" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-display text-base font-bold text-[#2A1B15]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Gifting Add-ons */}
          {items.length > 0 && (
            <div className="bg-white border border-[#E6D8C6] p-4 rounded-[20px] space-y-3 shadow-sm">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2A1B15]">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="rounded border-[#E6D8C6] text-[#5A1E1E] focus:ring-[#5A1E1E]"
                />
                <Gift className="w-4 h-4 text-[#A8742A]" />
                <span>Add Festive Gift Packaging (+ ₹99)</span>
              </label>

              {giftWrap && (
                <textarea
                  placeholder="Enter your personal Diwali greeting message..."
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  maxLength={250}
                  rows={2}
                  className="w-full bg-[#FAF6F0] border border-[#E6D8C6] p-3 text-xs rounded-xl text-[#2A1B15] placeholder-[#5C463B] focus:outline-none focus:border-[#5A1E1E]"
                />
              )}
            </div>
          )}
        </div>

        {/* Footer Breakdown & Checkout Button */}
        {items.length > 0 && (
          <div className="p-5 bg-white border-t border-[#E6D8C6] space-y-3.5 shadow-lg">
            {/* Coupon Code Input */}
            {coupon ? (
              <div className="flex items-center justify-between bg-[#FFF8EE] border border-[#E8A33D]/50 p-3 rounded-xl text-xs">
                <div className="flex items-center gap-2 text-[#2A1B15] font-medium">
                  <Sparkles className="w-4 h-4 text-[#A8742A]" />
                  <span>{coupon.code} applied</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-[#5A1E1E] font-semibold hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. DIWALI20)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 bg-[#FAF6F0] border border-[#E6D8C6] px-4 py-2 text-xs rounded-full uppercase text-[#2A1B15] placeholder-[#5C463B] focus:outline-none focus:border-[#5A1E1E]"
                />
                <button
                  type="submit"
                  disabled={couponLoading}
                  className="bg-[#5A1E1E] hover:bg-[#431414] text-white px-5 py-2 text-xs rounded-full font-semibold transition-colors shadow-sm"
                >
                  Apply
                </button>
              </form>
            )}
            {couponError && (
              <p className="text-xs text-[#8A1A1A] font-medium">{couponError}</p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-sm pt-2 border-t border-[#E6D8C6] text-[#5C463B]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#2A1B15]">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#8A1A1A] font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-[#1B5E20] font-semibold">Free</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              {giftWrap && (
                <div className="flex justify-between">
                  <span>Gift Packaging</span>
                  <span className="text-[#2A1B15] font-semibold">{formatPrice(9900)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-[#E6D8C6] text-base font-semibold text-[#2A1B15]">
                <span>Total (Incl. GST)</span>
                <span className="font-display text-xl font-bold text-[#2A1B15]">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Checkout Link */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base font-semibold mt-2 shadow-sm"
            >
              <span>Proceed to checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
