import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const key_id =
      process.env.RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { error: "Razorpay credentials not configured" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { amount, currency = "INR", receipt } = body;

    // Validate amount (must be an integer >= 100 paise = 1 INR)
    const parsedAmount = Math.round(Number(amount));
    if (isNaN(parsedAmount) || parsedAmount < 100) {
      return NextResponse.json(
        {
          error:
            "Invalid amount. Amount must be at least 100 paise (₹1.00).",
        },
        { status: 400 }
      );
    }

    const orderReceipt = receipt || `rcpt_${Date.now()}`;

    const order = await createRazorpayOrder({
      amount: parsedAmount,
      currency,
      receipt: orderReceipt,
    });

    return NextResponse.json(
      {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: key_id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Razorpay create-order error:", error);

    // Auth failure
    if (error?.statusCode === 401 || error?.error?.code === "BAD_REQUEST_ERROR") {
      return NextResponse.json(
        { error: error?.error?.description || error?.message || "Authentication failed" },
        { status: 401 }
      );
    }

    // Razorpay API or server error
    return NextResponse.json(
      {
        error:
          error?.error?.description ||
          error?.message ||
          "Failed to create Razorpay order",
      },
      { status: 500 }
    );
  }
}

