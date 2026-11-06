"use client";

import toast from "react-hot-toast";

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface OpenRazorpayOptions {
  amount: number; // in paise
  currency?: string;
  receipt?: string;
  name?: string;
  description?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  orderId?: string; // DB order ID if existing
  onSuccess?: (verifyData: any, rzpResponse: RazorpayResponse) => void;
  onError?: (error: any) => void;
  onDismiss?: () => void;
}

/**
 * Ensures the Razorpay checkout.js script is loaded in the browser.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay checkout script");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Standard Razorpay checkout flow:
 * 1. Creates an order via POST /api/create-order
 * 2. Opens the Razorpay modal
 * 3. On success, verifies the payment via POST /api/verify-payment
 * 4. Handles modal dismiss and payment failure
 */
export async function initiateRazorpayCheckout({
  amount,
  currency = "INR",
  receipt,
  name = "Lumière Candles",
  description = "Handcrafted Festive Candles",
  customer,
  orderId,
  onSuccess,
  onError,
  onDismiss,
}: OpenRazorpayOptions) {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      const err = new Error("Could not load Razorpay payment gateway. Please check your internet connection.");
      toast.error(err.message);
      onError?.(err);
      return;
    }

    // Step 1: Backend - Create Order
    const createRes = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
      }),
    });

    const orderData = await createRes.json();

    if (!createRes.ok || !orderData.order_id) {
      const errMsg = orderData.error || "Failed to initialize payment order";
      toast.error(errMsg);
      onError?.(new Error(errMsg));
      return;
    }

    const keyId =
      orderData.key_id ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      "rzp_test_Tvm7FGlBhpX7ra";

    // Step 2: Open Razorpay modal with order_id
    const options = {
      key: keyId,
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name,
      description,
      order_id: orderData.order_id,
      image: "/images/products/rose-pearl-reveal.jpg",
      prefill: {
        name: customer?.name || "",
        email: customer?.email || "",
        contact: customer?.phone || "",
      },
      theme: {
        color: "#F28A3D",
      },
      handler: async function (response: RazorpayResponse) {
        try {
          // Step 3: Backend - Verify Signature
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.success) {
            toast.success("Payment verified successfully!");
            onSuccess?.(verifyData, response);
          } else {
            const err = new Error(
              verifyData.error || "Payment verification failed. Please contact support."
            );
            toast.error(err.message);
            onError?.(err);
          }
        } catch (verifyErr: any) {
          console.error("Verification call error:", verifyErr);
          const err = new Error(verifyErr.message || "Failed to verify payment");
          toast.error(err.message);
          onError?.(err);
        }
      },
      modal: {
        ondismiss: function () {
          toast("Payment cancelled", { icon: "ℹ️" });
          onDismiss?.();
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);

    // Handle payment.failed event
    rzp.on("payment.failed", function (response: any) {
      console.error("Razorpay payment failed:", response.error);
      const desc =
        response?.error?.description ||
        response?.error?.reason ||
        "Payment processing failed";
      toast.error(`Payment failed: ${desc}`);
      onError?.(new Error(desc));
    });

    rzp.open();
  } catch (err: any) {
    console.error("Checkout initiation error:", err);
    toast.error(err.message || "An unexpected error occurred");
    onError?.(err);
  }
}

