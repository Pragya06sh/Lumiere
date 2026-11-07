import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Accept standard razorpay response fields or camelCase alternatives
    const order_id =
      body.razorpay_order_id || body.order_id || body.razorpayOrderId;
    const payment_id =
      body.razorpay_payment_id || body.payment_id || body.razorpayPaymentId;
    const signature =
      body.razorpay_signature || body.signature || body.razorpaySignature;

    // Validate missing fields
    if (!order_id || !payment_id || !signature) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: order_id, payment_id, and signature are required",
        },
        { status: 400 }
      );
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return NextResponse.json(
        { success: false, error: "Razorpay secret key not configured" },
        { status: 500 }
      );
    }

    // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const generatedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(`${order_id}|${payment_id}`)
      .digest("hex");

    let isSignatureValid = false;
    try {
      isSignatureValid = crypto.timingSafeEqual(
        Buffer.from(generatedSignature, "utf-8"),
        Buffer.from(signature, "utf-8")
      );
    } catch {
      isSignatureValid = false;
    }

    // Signature mismatch: return 400, do NOT mark as paid
    if (!isSignatureValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Signature verification failed: payment signature does not match",
        },
        { status: 400 }
      );
    }

    // Update order status in DB if orderId is provided or found by razorpayOrderId
    const dbOrderId = body.orderId || body.dbOrderId;
    try {
      if (dbOrderId) {
        await prisma.order.update({
          where: { id: dbOrderId },
          data: {
            paymentStatus: "PAID",
            razorpayPaymentId: payment_id,
            status: "CONFIRMED",
            statusHistory: {
              create: {
                status: "CONFIRMED",
                note: `Payment verified via Razorpay Standard Checkout (Payment ID: ${payment_id})`,
              },
            },
          },
        });
      } else if (order_id) {
        await prisma.order.updateMany({
          where: { razorpayOrderId: order_id },
          data: {
            paymentStatus: "PAID",
            razorpayPaymentId: payment_id,
            status: "CONFIRMED",
          },
        });
      }
    } catch (dbError) {
      console.warn("DB update skipped or not available:", dbError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified successfully",
        order_id,
        payment_id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal payment verification error",
      },
      { status: 500 }
    );
  }
}

