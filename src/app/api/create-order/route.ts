import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error("[create-order:config] Razorpay server credentials missing", {
        hasKeyId: Boolean(key_id),
        hasKeySecret: Boolean(key_secret),
      });
      return NextResponse.json(
        { error: "Payment gateway credentials not configured on server" },
        { status: 500 }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch (parseErr: any) {
      console.error("[create-order:body_parse] Failed to parse JSON request body", {
        message: parseErr?.message,
        code: parseErr?.code,
      });
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const { amount, currency = "INR", receipt } = body;

    // Validate amount (must be an integer >= 100 paise = 1 INR)
    const parsedAmount = Math.round(Number(amount));
    if (isNaN(parsedAmount) || parsedAmount < 100) {
      console.error("[create-order:validation] Invalid amount provided", {
        amount,
        parsedAmount,
      });
      return NextResponse.json(
        {
          error:
            "Invalid amount. Amount must be at least 100 paise (₹1.00).",
        },
        { status: 400 }
      );
    }

    const orderReceipt = receipt || `rcpt_${Date.now()}`;

    let order: any;
    try {
      order = await createRazorpayOrder({
        amount: parsedAmount,
        currency,
        receipt: orderReceipt,
      });
    } catch (razorpayErr: any) {
      console.error("[create-order:razorpay_api] Razorpay order creation failed", {
        message: razorpayErr?.message,
        code: razorpayErr?.code || razorpayErr?.statusCode,
        error: razorpayErr?.error,
        step: "createRazorpayOrder",
      });

      if (razorpayErr?.statusCode === 401 || razorpayErr?.error?.code === "BAD_REQUEST_ERROR") {
        return NextResponse.json(
          { error: "Payment gateway authentication failed. Please contact support." },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: "Payment provider was unable to create an order. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || key_id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[create-order:unhandled] Unexpected error in create-order route", {
      message: error?.message,
      code: error?.code,
      step: "unhandled_root",
    });

    return NextResponse.json(
      { error: "Failed to process payment initialization" },
      { status: 500 }
    );
  }
}
