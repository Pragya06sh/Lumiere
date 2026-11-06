import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { products } from "@/data/products";
import { generateOrderNumber } from "@/lib/utils";
import { createRazorpayOrder } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      address,
      items,
      couponCode,
      giftWrap,
      giftMessage,
      paymentMethod,
    } = body;

    if (!address || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid order parameters" },
        { status: 400 }
      );
    }

    // 1. RECALCULATE PRICES ON SERVER & CHECK SURPRISE GIFT STOCK
    let calculatedSubtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = products.find((p) => p.slug === item.slug);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.name} not found in catalog` },
          { status: 400 }
        );
      }

      // Check gift stock if surprise candle
      if (product.hasSurpriseGift) {
        const audience = item.giftAudience || "Anyone";
        try {
          const dbProd = await prisma.product.findUnique({
            where: { slug: product.slug },
            select: {
              giftStock: true,
              giftStockHer: true,
              giftStockHim: true,
              giftStockAnyone: true,
              hasSurpriseGift: true,
            },
          });
          if (dbProd && dbProd.hasSurpriseGift) {
            let audienceStock = dbProd.giftStockAnyone;
            if (audience === "Her") audienceStock = dbProd.giftStockHer;
            else if (audience === "Him") audienceStock = dbProd.giftStockHim;

            if (audienceStock <= 0) {
              return NextResponse.json(
                {
                  error: `Sorry, surprise gifts for "${product.name}" (Gift for ${audience}) are temporarily out of stock.`,
                },
                { status: 400 }
              );
            }
          }
        } catch {
          // Fallback to static data
          if (product.giftStock !== undefined && product.giftStock <= 0) {
            return NextResponse.json(
              { error: `Sorry, surprise gifts for "${product.name}" are out of stock.` },
              { status: 400 }
            );
          }
        }
      }

      const variant = product.variants.find((v) => v.sku === item.variantId);
      if (!variant) {
        return NextResponse.json(
          { error: `Variant for ${product.name} not found` },
          { status: 400 }
        );
      }

      const price = variant.price;
      const total = price * item.quantity;
      calculatedSubtotal += total;

      orderItemsData.push({
        productId: product.slug,
        variantId: variant.sku,
        name: product.name,
        variantName: variant.name,
        price,
        quantity: item.quantity,
        total,
        hasSurpriseGift: product.hasSurpriseGift,
        giftAudience: item.giftAudience || (product.hasSurpriseGift ? "Anyone" : null),
      });
    }

    // 2. RECALCULATE COUPON DISCOUNT ON SERVER
    let calculatedDiscount = 0;
    if (couponCode) {
      const code = couponCode.toUpperCase().trim();
      if (code === "DIWALI20" && calculatedSubtotal >= 99900) {
        calculatedDiscount = Math.min(
          Math.round((calculatedSubtotal * 20) / 100),
          50000
        ); // max ₹500
      } else if (code === "FIRST100" && calculatedSubtotal >= 49900) {
        calculatedDiscount = 10000; // ₹100
      } else if (code === "SURPRISE10") {
        calculatedDiscount = Math.round((calculatedSubtotal * 10) / 100); // 10% off
      }
    }

    // 3. RECALCULATE SHIPPING & FEES
    let shippingFee = 0;
    if (calculatedSubtotal < siteConfig.shipping.freeShippingThreshold) {
      shippingFee = siteConfig.shipping.standardShippingFee;
    }

    const codFee = paymentMethod === "COD" ? siteConfig.shipping.codFee : 0;
    const wrapFee = giftWrap ? 9900 : 0;
    const grandTotal = Math.max(
      0,
      calculatedSubtotal - calculatedDiscount + shippingFee + codFee + wrapFee
    );

    // GST calculation (18% inclusive)
    const gstAmount = Math.round((grandTotal * 18) / 118);

    const orderNumber = generateOrderNumber();

    // 4. Create Razorpay order if Razorpay is chosen
    let razorpayOrderId: string | null = null;
    if (paymentMethod === "RAZORPAY") {
      const rzpOrder = await createRazorpayOrder({
        amount: grandTotal,
        receipt: orderNumber,
        notes: {
          city: address.city,
          pincode: address.pincode,
        },
      });
      razorpayOrderId = rzpOrder.id;
    }

    // 5. Save order in Prisma database & generate reveal codes for surprise gifts
    let savedOrderId = orderNumber;
    try {
      const createdOrder = await prisma.order.create({
        data: {
          orderNumber,
          guestEmail: address.email || "guest@lumiere-candles.in",
          guestPhone: address.phone,
          shippingAddress: address,
          subtotal: calculatedSubtotal,
          shippingFee,
          codFee,
          discount: calculatedDiscount,
          gstAmount,
          total: grandTotal,
          couponCode: couponCode || null,
          paymentMethod,
          paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
          razorpayOrderId,
          status: "PLACED",
          giftMessage: giftMessage || null,
          giftWrap: !!giftWrap,
          items: {
            create: orderItemsData.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              name: item.name,
              variantName: item.variantName,
              price: item.price,
              quantity: item.quantity,
              total: item.total,
              giftAudience: item.giftAudience,
            })),
          },
          statusHistory: {
            create: {
              status: "PLACED",
              note: `Order placed via ${paymentMethod} for delivery`,
            },
          },
        },
        include: {
          items: true,
        },
      });
      savedOrderId = createdOrder.id;

      // Generate reveal codes for surprise items and decrement audience giftStock
      for (const orderItem of createdOrder.items) {
        const matchingCatalog = orderItemsData.find((d) => d.variantId === orderItem.variantId);
        if (matchingCatalog?.hasSurpriseGift) {
          const audience = matchingCatalog.giftAudience || "Anyone";
          try {
            const updateData: any = {
              giftStock: { decrement: orderItem.quantity },
            };
            if (audience === "Her") {
              updateData.giftStockHer = { decrement: orderItem.quantity };
            } else if (audience === "Him") {
              updateData.giftStockHim = { decrement: orderItem.quantity };
            } else {
              updateData.giftStockAnyone = { decrement: orderItem.quantity };
            }

            await prisma.product.updateMany({
              where: { slug: matchingCatalog.productId },
              data: updateData,
            });
          } catch (e) {
            console.warn("Could not decrement giftStock:", e);
          }

          // Generate unique reveal code
          const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
          const codeString = `DIWALI-${orderNumber.slice(-4)}-${randomSuffix}`;
          try {
            await prisma.revealCode.create({
              data: {
                code: codeString,
                orderItemId: orderItem.id,
                giftName: `Festive Keepsake (Gift for ${audience})`,
              },
            });
          } catch (e) {
            console.warn("Could not create reveal code:", e);
          }
        }
      }
    } catch (dbError) {
      console.warn("DB write failed or DB not connected, using orderNumber", dbError);
    }

    return NextResponse.json({
      success: true,
      orderId: savedOrderId,
      orderNumber,
      total: grandTotal,
      currency: "INR",
      paymentMethod,
      razorpayOrderId,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock",
    });
  } catch (error: any) {
    console.error("Checkout order error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process checkout" },
      { status: 500 }
    );
  }
}
