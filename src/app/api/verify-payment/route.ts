import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch (parseErr: any) {
      console.error("[verify-payment:body_parse] Failed to parse JSON request body", {
        message: parseErr?.message,
        code: parseErr?.code,
      });
      return NextResponse.json(
        { success: false, error: "Invalid request payload" },
        { status: 400 }
      );
    }

    // Accept standard razorpay response fields or camelCase alternatives
    const order_id =
      body.razorpay_order_id || body.order_id || body.razorpayOrderId;
    const payment_id =
      body.razorpay_payment_id || body.payment_id || body.razorpayPaymentId;
    const signature =
      body.razorpay_signature || body.signature || body.razorpaySignature;

    if (!order_id || !payment_id || !signature) {
      console.error("[verify-payment:validation] Missing required signature verification fields", {
        hasOrderId: Boolean(order_id),
        hasPaymentId: Boolean(payment_id),
        hasSignature: Boolean(signature),
      });
      return NextResponse.json(
        {
          success: false,
          error: "Missing required payment fields (order_id, payment_id, signature)",
        },
        { status: 400 }
      );
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      console.error("[verify-payment:config] RAZORPAY_KEY_SECRET missing on server");
      return NextResponse.json(
        { success: false, error: "Payment verification configuration error" },
        { status: 500 }
      );
    }

    // HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
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
    } catch (sigErr: any) {
      console.error("[verify-payment:timing_safe_equal] Signature comparison failed", {
        message: sigErr?.message,
        code: sigErr?.code,
      });
      isSignatureValid = false;
    }

    if (!isSignatureValid) {
      console.error("[verify-payment:signature_mismatch] Signature does not match", {
        step: "signature_verification",
        order_id,
        payment_id,
      });
      return NextResponse.json(
        {
          success: false,
          error: "Signature verification failed. Payment cannot be confirmed.",
        },
        { status: 400 }
      );
    }

    // Find order in DB by razorpayOrderId or id
    const dbOrderId = body.orderId || body.dbOrderId;
    let order: any = null;

    try {
      if (dbOrderId) {
        order = await prisma.order.findUnique({
          where: { id: dbOrderId },
          include: {
            items: {
              include: {
                product: true,
                revealCodes: true,
              },
            },
            user: true,
          },
        });
      }

      if (!order && order_id) {
        order = await prisma.order.findUnique({
          where: { razorpayOrderId: order_id },
          include: {
            items: {
              include: {
                product: true,
                revealCodes: true,
              },
            },
            user: true,
          },
        });
      }
    } catch (findErr: any) {
      console.error("[verify-payment:db_find_order] Failed to find order in database", {
        message: findErr?.message,
        code: findErr?.code,
        dbOrderId,
        order_id,
      });
    }

    if (!order) {
      console.error("[verify-payment:order_not_found] Order record not found for verification", {
        dbOrderId,
        order_id,
      });
      return NextResponse.json(
        { success: false, error: "Order record not found" },
        { status: 404 }
      );
    }

    // Idempotency: if already paid, return success immediately
    if (order.paymentStatus === "PAID") {
      return NextResponse.json(
        {
          success: true,
          message: "Payment already verified",
          order_id,
          payment_id,
        },
        { status: 200 }
      );
    }

    // Update order status to PAID and CONFIRMED
    try {
      await prisma.order.update({
        where: { id: order.id },
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
    } catch (updateErr: any) {
      console.error("[verify-payment:db_update_order] Failed to update order status to PAID", {
        message: updateErr?.message,
        code: updateErr?.code,
        orderId: order.id,
      });
      return NextResponse.json(
        { success: false, error: "Failed to update order status in database" },
        { status: 500 }
      );
    }

    // Generate reveal codes for surprise products if not yet created
    try {
      for (const item of order.items) {
        if (item.product?.hasSurpriseGift && item.revealCodes.length === 0) {
          const audience = item.giftAudience || "Anyone";
          for (let q = 0; q < item.quantity; q++) {
            const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
            const codeString = `WISH-${order.orderNumber.slice(-4)}-${randomSuffix}${q > 0 ? `-${q + 1}` : ""}`;
            await prisma.revealCode.create({
              data: {
                code: codeString,
                orderItemId: item.id,
                giftName: `Keepsake (Gift for ${audience})`,
              },
            });
          }
        }
      }
    } catch (revealErr: any) {
      console.error("[verify-payment:reveal_codes] Error generating reveal codes", {
        message: revealErr?.message,
        code: revealErr?.code,
        orderId: order.id,
      });
    }

    // Send confirmation email asynchronously (do not fail request if email fails)
    try {
      const shippingAddr = (order.shippingAddress as Record<string, any>) || {};
      const recipientEmail =
        order.user?.email || order.guestEmail || shippingAddr.email;
      const customerName =
        order.user?.name || shippingAddr.name || shippingAddr.fullName;

      if (recipientEmail) {
        sendOrderConfirmationEmail({
          orderNumber: order.orderNumber,
          email: recipientEmail,
          customerName,
          total: order.total,
          paymentMethod: "RAZORPAY",
          items: order.items.map((i: any) => ({
            name: i.name,
            variantName: i.variantName,
            quantity: i.quantity,
            price: i.price,
          })),
        }).catch((err) => {
          console.error("[verify-payment:email] Async send error", err);
        });
      }
    } catch (emailErr: any) {
      console.error("[verify-payment:email_prep] Could not trigger confirmation email", {
        message: emailErr?.message,
        code: emailErr?.code,
      });
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
    console.error("[verify-payment:unhandled] Unexpected payment verification error", {
      message: error?.message,
      code: error?.code,
      step: "unhandled_root",
    });

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while verifying your payment",
      },
      { status: 500 }
    );
  }
}
