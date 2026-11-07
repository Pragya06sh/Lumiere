"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart";
import { siteConfig } from "@/config/site";
import { formatPrice, isValidPincode } from "@/lib/utils";
import { loadRazorpayScript, RazorpayResponse } from "@/lib/razorpayClient";
import toast from "react-hot-toast";
import {
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  ArrowLeft,
  Loader2,
  Lock,
  UserCheck,
  MapPin,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const {
    items,
    getSubtotal,
    getDiscount,
    getShippingFee,
    getTotal,
    coupon,
    giftWrap,
    giftMessage,
    clearCart,
  } = useCartStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?next=/checkout");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || session.user.name || "",
        email: session.user.email || prev.email,
        phone: prev.phone || (session.user as any).phone || "",
      }));

      fetch("/api/account/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setFormData((prev) => ({
              ...prev,
              name: prev.name || data.user.name || "",
              phone: prev.phone || data.user.phone || "",
            }));

            if (data.user.addresses && data.user.addresses.length > 0) {
              setSavedAddresses(data.user.addresses);
              const defaultAddr = data.user.addresses.find((a: any) => a.isDefault) || data.user.addresses[0];
              if (defaultAddr) {
                setSelectedAddressId(defaultAddr.id);
                setFormData((prev) => ({
                  ...prev,
                  name: defaultAddr.name || prev.name,
                  phone: defaultAddr.phone || prev.phone,
                  line1: defaultAddr.line1,
                  line2: defaultAddr.line2 || "",
                  city: defaultAddr.city,
                  state: defaultAddr.state,
                  pincode: defaultAddr.pincode,
                }));
              }
            }
          }
        })
        .catch(() => {});
    }
  }, [status, session]);

  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "UPI_DIRECT" | "COD">("RAZORPAY");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shippingFee = getShippingFee();
  const codFee = paymentMethod === "COD" ? siteConfig.shipping.codFee : 0;
  const wrapFee = giftWrap ? 9900 : 0;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee + codFee + wrapFee);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(siteConfig.payment.upiId);
    setUpiCopied(true);
    toast.success("UPI ID copied to clipboard!");
    setTimeout(() => setUpiCopied(false), 3000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#1A0F0A] p-6 text-center text-[#F8EFE6]">
        <Loader2 className="w-8 h-8 text-[#D9A441] animate-spin mb-4" />
        <p className="text-xs uppercase tracking-[0.2em] text-[#CDB8A6]">
          Verifying Client Session...
        </p>
      </div>
    );
  }

  if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!isValidPincode(formData.pincode)) {
      toast.error("Please enter a valid 6-digit Indian PIN code");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. If Razorpay is chosen, ensure SDK script is loaded before creating order
      if (paymentMethod === "RAZORPAY") {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          throw new Error("Could not load Razorpay payment gateway. Please check your internet connection.");
        }
      }

      // 2. Send checkout request to backend API (calculates prices & creates Razorpay order)
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: formData,
          items,
          couponCode: coupon?.code,
          giftWrap,
          giftMessage,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Order placement failed");
      }

      // 3. Handle Razorpay Standard Checkout Modal
      if (paymentMethod === "RAZORPAY" && data.razorpayOrderId) {
        const options = {
          key: data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_Tvm7FGlBhpX7ra",
          amount: data.total,
          currency: data.currency || "INR",
          name: siteConfig.brandName,
          description: `Candle Order #${data.orderNumber}`,
          image: "/images/products/rose-pearl-reveal.jpg",
          order_id: data.razorpayOrderId,
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#F28A3D",
          },
          handler: async function (response: RazorpayResponse) {
            try {
              // 4. Verify Payment Signature on Backend: POST /api/verify-payment
              const verifyRes = await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: data.orderId,
                }),
              });

              const verifyData = await verifyRes.json();

              if (verifyRes.ok && verifyData.success) {
                clearCart();
                toast.success("Payment verified successfully!");
                router.push(`/order-confirmation/${data.orderId}?payment=success`);
              } else {
                toast.error(
                  verifyData.error ||
                    "Payment signature verification failed. Please contact support."
                );
              }
            } catch (vErr: any) {
              console.error("Signature verification error:", vErr);
              toast.error("Error communicating with verification server.");
            } finally {
              setIsSubmitting(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
              toast("Payment cancelled by user", { icon: "ℹ️" });
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);

        // Handle payment.failed event
        rzp.on("payment.failed", function (response: any) {
          setIsSubmitting(false);
          const desc =
            response?.error?.description ||
            response?.error?.reason ||
            "Payment failed. Please try another method.";
          toast.error(`Payment failed: ${desc}`);
        });

        rzp.open();
      } else {
        // Direct UPI or Cash On Delivery
        clearCart();
        setIsSubmitting(false);
        router.push(`/order-confirmation/${data.orderId}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#1A0F0A] p-6 text-center text-[#F8EFE6]">
        <Loader2 className="w-8 h-8 text-[#D9A441] animate-spin mb-4" />
        <p className="text-xs uppercase tracking-[0.2em] text-[#CDB8A6]">
          Verifying Client Session...
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#1A0F0A] p-6 text-center text-[#F8EFE6]">
        <h2 className="text-3xl font-display text-[#F8EFE6] mb-3 font-light">
          Your cart is empty
        </h2>
        <p className="text-sm text-[#CDB8A6] mb-6 max-w-sm">
          Add some handcrafted candles or surprise gift sets before proceeding to checkout.
        </p>
        <Link href="/shop" className="btn-primary text-sm py-3 px-8 shadow-md">
          Explore Candles
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A0F0A] py-10 md:py-16 text-[#F8EFE6]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-xs text-[#CDB8A6] hover:text-[#F28A3D] mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to cart</span>
        </Link>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-[#F8EFE6] font-light mb-8">
          Secure Checkout
        </h1>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Address & Payment Methods */}
          <div className="lg:col-span-7 space-y-6">
            {/* Shipping Address Section */}
            <div className="bg-[#241510] border border-[#D9A441]/25 p-6 rounded-[24px] space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-[#D9A441]/15 pb-3">
                <Truck className="w-5 h-5 text-[#F28A3D]" />
                <h2 className="font-display text-lg text-[#F8EFE6] font-light">
                  1. Delivery Address
                </h2>
              </div>

              {/* Logged in status */}
              <div className="bg-[#1A0F0A]/60 border border-[#D9A441]/20 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#CDB8A6]">
                  <UserCheck className="w-4 h-4 text-[#D9A441]" />
                  <span>
                    Logged in as{" "}
                    <strong className="text-[#F8EFE6]">
                      {session?.user?.name || session?.user?.email}
                    </strong>
                  </span>
                </div>
                <Link
                  href="/account"
                  className="text-[11px] uppercase tracking-[0.15em] text-[#D9A441] hover:underline"
                >
                  Manage Account
                </Link>
              </div>

              {/* Saved addresses selector */}
              {savedAddresses.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.15em] text-[#CDB8A6] font-medium block">
                    Use a Saved Address:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {savedAddresses.map((addr) => (
                      <button
                        type="button"
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddressId(addr.id);
                          setFormData((prev) => ({
                            ...prev,
                            name: addr.name || prev.name,
                            phone: addr.phone || prev.phone,
                            line1: addr.line1,
                            line2: addr.line2 || "",
                            city: addr.city,
                            state: addr.state,
                            pincode: addr.pincode,
                          }));
                        }}
                        className={`text-left p-3 rounded-xl border text-xs transition-all ${
                          selectedAddressId === addr.id
                            ? "bg-[#2A1B15] border-[#D9A441] text-[#F8EFE6]"
                            : "bg-[#1A0F0A]/40 border-[#D9A441]/20 text-[#CDB8A6] hover:border-[#D9A441]/50"
                        }`}
                      >
                        <p className="font-semibold text-[#F8EFE6]">{addr.name}</p>
                        <p className="truncate">{addr.line1}</p>
                        <p className="text-[11px] text-[#CDB8A6]/70">
                          {addr.city}, {addr.pincode}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[#CDB8A6] font-medium block mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Debashis Mukherjee"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="text-[#CDB8A6] font-medium block mb-1.5">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    className="input-field"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[#CDB8A6] font-medium block mb-1.5">
                    Email Address (for receipt & tracking) *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="debashis@example.com"
                    className="input-field"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[#CDB8A6] font-medium block mb-1.5">
                    Flat / House No., Apartment / Building *
                  </label>
                  <input
                    type="text"
                    name="line1"
                    required
                    value={formData.line1}
                    onChange={handleInputChange}
                    placeholder="Flat 4B, Emerald Heights, 12 Southern Avenue"
                    className="input-field"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[#CDB8A6] font-medium block mb-1.5">
                    Landmark / Area (Optional)
                  </label>
                  <input
                    type="text"
                    name="line2"
                    value={formData.line2}
                    onChange={handleInputChange}
                    placeholder="Near Southern Park"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="text-[#CDB8A6] font-medium block mb-1.5">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="700001"
                    className="input-field font-mono"
                  />
                </div>

                <div>
                  <label className="text-[#CDB8A6] font-medium block mb-1.5">
                    City &amp; State
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.city ? `${formData.city}, ${formData.state}` : "Pan-India Courier"}
                    className="input-field bg-[#1A0F0A] text-[#CDB8A6] cursor-not-allowed opacity-80"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-[#241510] border border-[#D9A441]/25 p-6 rounded-[24px] space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-[#D9A441]/15 pb-3">
                <CreditCard className="w-5 h-5 text-[#F28A3D]" />
                <h2 className="font-display text-lg text-[#F8EFE6] font-light">
                  2. Choose Payment Option
                </h2>
              </div>

              <div className="space-y-3">
                {/* 1. Razorpay Standard Checkout */}
                <label
                  onClick={() => setPaymentMethod("RAZORPAY")}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "RAZORPAY"
                      ? "border-[#F28A3D] bg-[#F28A3D]/10 shadow-md"
                      : "border-[#D9A441]/20 bg-[#1A0F0A] hover:border-[#D9A441]/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "RAZORPAY"}
                    onChange={() => setPaymentMethod("RAZORPAY")}
                    className="mt-1 accent-[#F28A3D]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#F8EFE6]">
                        Razorpay Standard Checkout (UPI, Cards, Netbanking)
                      </span>
                      <span className="badge-pill bg-[#F28A3D]/20 text-[#F28A3D] border border-[#F28A3D]/40 text-[10px]">
                        RECOMMENDED
                      </span>
                    </div>
                    <p className="text-xs text-[#CDB8A6] mt-1 font-light">
                      Pay instantly with Razorpay checkout: Google Pay, PhonePe, Paytm, BHIM UPI, Cards, or Netbanking.
                    </p>
                  </div>
                </label>

                {/* 2. Direct UPI */}
                <label
                  onClick={() => setPaymentMethod("UPI_DIRECT")}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "UPI_DIRECT"
                      ? "border-[#F28A3D] bg-[#F28A3D]/10 shadow-md"
                      : "border-[#D9A441]/20 bg-[#1A0F0A] hover:border-[#D9A441]/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "UPI_DIRECT"}
                    onChange={() => setPaymentMethod("UPI_DIRECT")}
                    className="mt-1 accent-[#F28A3D]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#F8EFE6] flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-[#D9A441]" />
                        Direct UPI ID Transfer
                      </span>
                    </div>
                    <p className="text-xs text-[#CDB8A6] mt-1 font-light">
                      Transfer directly to our store UPI ID: <code className="text-[#F28A3D] font-mono">{siteConfig.payment.upiId}</code>
                    </p>

                    {paymentMethod === "UPI_DIRECT" && (
                      <div className="mt-3 p-3 bg-[#1A0F0A] border border-[#D9A441]/25 rounded-xl text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[#CDB8A6]">Store UPI ID:</span>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="text-[#F28A3D] hover:underline font-semibold"
                          >
                            {upiCopied ? "Copied!" : "Copy UPI ID"}
                          </button>
                        </div>
                        <p className="text-[11px] text-[#CDB8A6]/70">
                          Transfer on GPay/PhonePe and confirm order below.
                        </p>
                      </div>
                    )}
                  </div>
                </label>

                {/* 3. Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod("COD")}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-[#F28A3D] bg-[#F28A3D]/10 shadow-md"
                      : "border-[#D9A441]/20 bg-[#1A0F0A] hover:border-[#D9A441]/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="mt-1 accent-[#F28A3D]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#F8EFE6] flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-[#D9A441]" />
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-xs text-[#CDB8A6] font-mono">+₹49 fee</span>
                    </div>
                    <p className="text-xs text-[#CDB8A6] mt-1 font-light">
                      Pay with cash upon safe doorstep delivery.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary - Cream Contrast Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#FAF3EA] text-[#2A1B15] border border-[#E6D8C6] p-6 rounded-[24px] space-y-5 sticky top-24 shadow-2xl">
              <h3 className="font-display text-xl text-[#2A1B15] border-b border-[#E6D8C6] pb-3 font-medium">
                Order Review ({items.length} items)
              </h3>

              {/* Items List Mini */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#F28A3D] font-bold">{i.quantity}x</span>
                      <div>
                        <p className="text-[#2A1B15] font-semibold">{i.name}</p>
                        <p className="text-[11px] text-[#5C463B]">{i.variantName}</p>
                      </div>
                    </div>
                    <span className="font-mono text-[#2A1B15] font-semibold">
                      {formatPrice(i.price * i.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs border-t border-[#E6D8C6] pt-4 text-[#5C463B]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#2A1B15] font-medium">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#8C3D00] font-medium">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-[#2A1B15] font-medium">
                    {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                  </span>
                </div>

                {paymentMethod === "COD" && (
                  <div className="flex justify-between text-[#8C3D00]">
                    <span>COD Convenience Fee</span>
                    <span>+{formatPrice(codFee)}</span>
                  </div>
                )}

                {giftWrap && (
                  <div className="flex justify-between">
                    <span>Luxury Gift Wrapping</span>
                    <span>{formatPrice(wrapFee)}</span>
                  </div>
                )}

                <div className="flex justify-between pt-3 border-t border-[#E6D8C6] text-base font-bold text-[#2A1B15]">
                  <span>Payable Total</span>
                  <span className="font-display text-2xl text-[#2A1B15]">
                    {formatPrice(grandTotal)}
                  </span>
                </div>

                <p className="text-[11px] text-[#5C463B] pt-1">
                  Final price. No hidden charges.
                </p>
              </div>

              {/* Complete Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 text-base font-bold shadow-md flex items-center justify-center gap-2 rounded-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-[#1A0F0A]" />
                    <span>Processing payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#1A0F0A]" />
                    <span>
                      {paymentMethod === "RAZORPAY"
                        ? `Pay with Razorpay (${formatPrice(grandTotal)})`
                        : `Place Order (${formatPrice(grandTotal)})`}
                    </span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-[#5C463B] space-y-1">
                <p>256-bit Encrypted Checkout • Razorpay Verified</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
