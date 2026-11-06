"use client";

import { useState } from "react";
import { loadRazorpayScript, RazorpayResponse } from "@/lib/razorpayClient";
import toast from "react-hot-toast";
import { CreditCard, Loader2 } from "lucide-react";

export interface RazorpayCheckoutButtonProps {
  amount: number; // in paise (e.g. 99900 = ₹999)
  currency?: string;
  receipt?: string;
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  buttonText?: string;
  className?: string;
  onSuccess?: (verifyData: any, rzpResponse: RazorpayResponse) => void;
  onError?: (error: any) => void;
}

export function RazorpayCheckoutButton({
  amount,
  currency = "INR",
  receipt,
  name = "Lumière Candles",
  description = "Festive Scented Candles",
  prefill,
  buttonText,
  className = "",
  onSuccess,
  onError,
}: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    // Validate minimum amount (100 paise = ₹1)
    if (amount < 100) {
      toast.error("Minimum payment amount is ₹1.00 (100 paise)");
      return;
    }

    setLoading(true);

    try {
      // 1. Ensure Razorpay checkout.js script is loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error(
          "Failed to load Razorpay SDK. Please check your internet connection."
        );
      }

      // 2. Call Backend: POST /api/create-order
      const createOrderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency,
          receipt: receipt || `rcpt_${Date.now()}`,
        }),
      });

      const orderData = await createOrderRes.json();

      if (!createOrderRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || "Failed to create Razorpay order");
      }

      const keyId =
        orderData.key_id ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        "rzp_test_Tvm7FGlBhpX7ra";

      // 3. Configure Razorpay modal options
      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name,
        description,
        order_id: orderData.order_id,
        image: "/images/products/rose-pearl-reveal.jpg",
        prefill: {
          name: prefill?.name || "",
          email: prefill?.email || "",
          contact: prefill?.phone || "",
        },
        theme: {
          color: "#F28A3D",
        },
        handler: async function (response: RazorpayResponse) {
          try {
            // 4. Call Backend: POST /api/verify-payment
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              toast.success("Payment verified successfully!");
              onSuccess?.(verifyData, response);
            } else {
              const err = new Error(
                verifyData.error || "Payment signature verification failed"
              );
              toast.error(err.message);
              onError?.(err);
            }
          } catch (verifyErr: any) {
            console.error("Signature verification error:", verifyErr);
            const err = new Error(
              verifyErr.message || "Failed to verify payment with server"
            );
            toast.error(err.message);
            onError?.(err);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast("Payment cancelled by user", { icon: "ℹ️" });
          },
        },
      };

      // 4. Open Razorpay modal
      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        setLoading(false);
        const errMsg =
          response?.error?.description ||
          response?.error?.reason ||
          "Payment failed";
        toast.error(`Payment failed: ${errMsg}`);
        onError?.(new Error(errMsg));
      });

      rzp.open();
    } catch (err: any) {
      console.error("Razorpay checkout error:", err);
      toast.error(err.message || "Payment initialization failed");
      onError?.(err);
      setLoading(false);
    }
  };

  const displayAmount = `₹${(amount / 100).toLocaleString("en-IN")}`;

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={loading}
      className={`btn-primary px-6 py-3.5 rounded-full inline-flex items-center justify-center gap-2 font-medium shadow-md transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-[#1A0F0A]" />
          <span>Opening Checkout...</span>
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4 text-[#1A0F0A]" />
          <span>{buttonText || `Pay with Razorpay (${displayAmount})`}</span>
        </>
      )}
    </button>
  );
}

