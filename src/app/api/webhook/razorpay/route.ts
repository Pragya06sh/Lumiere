import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[webhook:razorpay] Missing RAZORPAY_WEBHOOK_SECRET environment variable");
      return NextResponse.json(
        { error: "Webhook secret not configured on server" },
        { status: 500 }
      );
    }

    if (!signature) {
      console.error("[webhook:razorpay] Missing x-razorpay-signature header");
      return NextResponse.json(
        { error: "Missing signature header" },
        { status: 400 }
      );
    }

    // Verify HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    let isSignatureValid = false;
    try {
      isSignatureValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "utf-8"),
        Buffer.from(signature, "utf-8")
      );
    } catch {
      isSignatureValid = false;
    }

    if (!isSignatureValid) {
      console.error("[webhook:razorpay] Invalid webhook signature", {
        step: "verify_webhook_signature",
      });
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Parse event payload
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch (parseErr: any) {
      console.error("[webhook:razorpay] Failed parsing webhook payload", {
        message: parseErr?.message,
      });
      return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
    }

    const event = payload?.event;
    console.log(`[webhook:razorpay] Received event: ${event}`);

    // ─── 1. PAYMENT CAPTURED OR ORDER PAID ───────────────────────────
    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload?.payload?.payment?.entity;
      const orderEntity = payload?.payload?.order?.entity;

      const rzpOrderId =
        paymentEntity?.order_id || orderEntity?.id || null;
      const rzpPaymentId =
        paymentEntity?.id || null;

      if (!rzpOrderId) {
        console.warn("[webhook:razorpay] No order_id found in event payload", { event });
        return NextResponse.json({ received: true }, { status: 200 });
      }

      const order = await prisma.order.findUnique({
        where: { razorpayOrderId: rzpOrderId },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
              revealCodes: true,
            },
          },
          user: true,
        },
      });

      if (!order) {
        console.warn("[webhook:razorpay] Order not found for Razorpay order ID:", rzpOrderId);
        return NextResponse.json({ received: true }, { status: 200 });
      }

      // Idempotency: Do this only once, even if event arrives twice
      if (order.paymentStatus === "PAID") {
        console.log(`[webhook:razorpay] Order #${order.orderNumber} already marked PAID. Skipping.`);
        return NextResponse.json({ received: true, alreadyHandled: true }, { status: 200 });
      }

      // Mark order as PAID and CONFIRMED
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED",
          razorpayPaymentId: rzpPaymentId || order.razorpayPaymentId,
          statusHistory: {
            create: {
              status: "CONFIRMED",
              note: `Payment confirmed via Razorpay webhook event: ${event} (Payment ID: ${rzpPaymentId || "n/a"})`,
            },
          },
        },
      });

      // If the order was NOT created through standard checkout flow where stock was reserved,
      // reduce stock here. Otherwise, stock was reserved at checkout time.
      if (order.status !== "AWAITING_PAYMENT") {
        for (const item of order.items) {
          try {
            await prisma.variant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.quantity } },
            });
            if (item.product?.hasSurpriseGift) {
              const aud = item.giftAudience || "Anyone";
              const gData: any = { giftStock: { decrement: item.quantity } };
              if (aud === "Her") gData.giftStockHer = { decrement: item.quantity };
              else if (aud === "Him") gData.giftStockHim = { decrement: item.quantity };
              else gData.giftStockAnyone = { decrement: item.quantity };

              await prisma.product.update({
                where: { id: item.productId },
                data: gData,
              });
            }
          } catch (stkErr) {
            console.error("[webhook:razorpay] Error reducing stock:", stkErr);
          }
        }
      }

      // Generate reveal codes for surprise products
      for (const item of order.items) {
        if (item.product?.hasSurpriseGift && item.revealCodes.length === 0) {
          const audience = item.giftAudience || "Anyone";
          for (let q = 0; q < item.quantity; q++) {
            const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
            const codeString = `WISH-${order.orderNumber.slice(-4)}-${randomSuffix}${q > 0 ? `-${q + 1}` : ""}`;
            try {
              await prisma.revealCode.create({
                data: {
                  code: codeString,
                  orderItemId: item.id,
                  giftName: `Keepsake (Gift for ${audience})`,
                },
              });
            } catch (revErr) {
              console.error("[webhook:razorpay] Could not create reveal code:", revErr);
            }
          }
        }
      }

      // Send confirmation email
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
          paymentMethod: "Razorpay (Online)",
          items: order.items.map((i) => ({
            name: i.name,
            variantName: i.variantName,
            quantity: i.quantity,
            price: i.price,
          })),
        }).catch((err) => {
          console.error("[webhook:razorpay] Async email sending failed:", err);
        });
      }

      return NextResponse.json({ received: true, success: true }, { status: 200 });
    }

    // ─── 2. PAYMENT FAILED ───────────────────────────────────────────
    if (event === "payment.failed") {
      const paymentEntity = payload?.payload?.payment?.entity;
      const rzpOrderId = paymentEntity?.order_id || null;

      if (!rzpOrderId) {
        return NextResponse.json({ received: true }, { status: 200 });
      }

      const order = await prisma.order.findUnique({
        where: { razorpayOrderId: rzpOrderId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      if (!order) {
        return NextResponse.json({ received: true }, { status: 200 });
      }

      // If order is already FAILED or CANCELLED, do not release stock twice
      if (order.status === "FAILED" || order.paymentStatus === "FAILED") {
        return NextResponse.json({ received: true, alreadyFailed: true }, { status: 200 });
      }

      // Mark order FAILED
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "FAILED",
          paymentStatus: "FAILED",
          statusHistory: {
            create: {
              status: "FAILED",
              note: `Payment failed according to Razorpay webhook (Reason: ${paymentEntity?.error_description || "Payment failed"})`,
            },
          },
        },
      });

      // Release reserved stock back to inventory
      for (const item of order.items) {
        try {
          await prisma.variant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });

          if (item.product?.hasSurpriseGift) {
            const audience = item.giftAudience || "Anyone";
            const relData: any = { giftStock: { increment: item.quantity } };
            if (audience === "Her") relData.giftStockHer = { increment: item.quantity };
            else if (audience === "Him") relData.giftStockHim = { increment: item.quantity };
            else relData.giftStockAnyone = { increment: item.quantity };

            await prisma.product.update({
              where: { id: item.productId },
              data: relData,
            });
          }
        } catch (stkErr) {
          console.error("[webhook:razorpay] Error releasing stock:", stkErr);
        }
      }

      return NextResponse.json({ received: true, failedHandled: true }, { status: 200 });
    }

    // Always return 200 for other events ignored or handled
    return NextResponse.json({ received: true, ignored: true }, { status: 200 });
  } catch (error: any) {
    console.error("[webhook:razorpay:unhandled] Unexpected error in webhook route", {
      message: error?.message,
      code: error?.code,
    });
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 }
    );
  }
}

