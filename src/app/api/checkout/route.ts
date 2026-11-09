import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { generateOrderNumber } from "@/lib/utils";
import { createRazorpayOrder } from "@/lib/razorpay";
import { auth } from "@/auth";
import { sendOrderConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Session Authentication Check
    const session = await auth();
    if (!session?.user?.id) {
      console.error("[checkout:auth] Unauthenticated user checkout attempt");
      return NextResponse.json(
        { error: "Authentication required. Please sign in to place your order." },
        { status: 401 }
      );
    }

    // 2. Parse Request Body
    let body: any;
    try {
      body = await req.json();
    } catch (parseErr: any) {
      console.error("[checkout:body_parse] Malformed JSON request body", {
        message: parseErr?.message,
        code: parseErr?.code,
        step: "parse_body",
      });
      return NextResponse.json(
        { error: "Invalid order parameters" },
        { status: 400 }
      );
    }

    const {
      address,
      items,
      couponCode,
      giftWrap,
      giftMessage,
      paymentMethod,
    } = body;

    // 3. Validate Payment Method (Strictly RAZORPAY or COD)
    if (paymentMethod !== "RAZORPAY" && paymentMethod !== "COD") {
      console.error("[checkout:validation] Invalid payment method rejected", {
        paymentMethod,
        step: "validate_payment_method",
      });
      return NextResponse.json(
        { error: "Invalid payment method. Only Razorpay and Cash on Delivery are accepted." },
        { status: 400 }
      );
    }

    if (!address || !items || !Array.isArray(items) || items.length === 0) {
      console.error("[checkout:validation] Missing address or items in order request", {
        hasAddress: Boolean(address),
        itemCount: items?.length,
        step: "validate_items_and_address",
      });
      return NextResponse.json(
        { error: "Invalid order parameters. Address and items are required." },
        { status: 400 }
      );
    }

    // 4. Resolve Products & Variants from Database & Verify Stock
    let calculatedSubtotal = 0;
    const orderItemsData: Array<{
      productId: string;
      variantId: string;
      name: string;
      variantName: string;
      price: number;
      quantity: number;
      total: number;
      hasSurpriseGift: boolean;
      giftAudience: string | null;
    }> = [];

    for (const item of items) {
      let dbProduct: any = null;
      try {
        dbProduct = await prisma.product.findFirst({
          where: {
            OR: [
              { slug: item.slug || item.productId },
              { id: item.productId },
            ],
          },
          include: {
            variants: true,
          },
        });
      } catch (dbFindErr: any) {
        console.error("[checkout:db_find_product] Failed querying product from database", {
          message: dbFindErr?.message,
          code: dbFindErr?.code,
          itemSlug: item.slug,
          itemProductId: item.productId,
          step: "find_product_in_db",
        });
      }

      if (!dbProduct) {
        console.error("[checkout:product_not_found] Product not found in database", {
          item,
          step: "resolve_catalog_product",
        });
        return NextResponse.json(
          { error: `Product "${item.name || item.slug}" is not currently available.` },
          { status: 400 }
        );
      }

      // Find matching variant by id or sku
      const dbVariant =
        dbProduct.variants.find(
          (v: any) => v.id === item.variantId || v.sku === item.variantId
        ) || dbProduct.variants[0];

      if (!dbVariant) {
        console.error("[checkout:variant_not_found] Variant not found for product", {
          product: dbProduct.slug,
          variantId: item.variantId,
          step: "resolve_product_variant",
        });
        return NextResponse.json(
          { error: `Selected variant for "${dbProduct.name}" is not available.` },
          { status: 400 }
        );
      }

      // Check variant stock
      if (dbVariant.stock < item.quantity) {
        console.error("[checkout:insufficient_stock] Variant stock insufficient", {
          product: dbProduct.slug,
          variant: dbVariant.sku,
          available: dbVariant.stock,
          requested: item.quantity,
          step: "check_variant_stock",
        });
        return NextResponse.json(
          {
            error: `Sorry, "${dbProduct.name} (${dbVariant.name})" is out of stock (only ${dbVariant.stock} available).`,
          },
          { status: 400 }
        );
      }

      // Check gift stock if surprise candle (Surprise or Spiral Wish)
      const hasSurprise = Boolean(dbProduct.hasSurpriseGift);
      const audience = item.giftAudience || (hasSurprise ? "Anyone" : null);

      if (hasSurprise) {
        let audienceStock = dbProduct.giftStockAnyone;
        if (audience === "Her") audienceStock = dbProduct.giftStockHer;
        else if (audience === "Him") audienceStock = dbProduct.giftStockHim;

        if (audienceStock < item.quantity || dbProduct.giftStock < item.quantity) {
          console.error("[checkout:insufficient_gift_stock] Surprise gift stock depleted", {
            product: dbProduct.slug,
            audience,
            audienceStock,
            totalGiftStock: dbProduct.giftStock,
            requested: item.quantity,
            step: "check_gift_stock",
          });
          return NextResponse.json(
            {
              error: `Sorry, surprise gifts for "${dbProduct.name}" (Gift for ${audience || "Anyone"}) are temporarily out of stock.`,
            },
            { status: 400 }
          );
        }
      }

      const itemTotal = dbVariant.price * item.quantity;
      calculatedSubtotal += itemTotal;

      orderItemsData.push({
        productId: dbProduct.id,
        variantId: dbVariant.id,
        name: dbProduct.name,
        variantName: dbVariant.name,
        price: dbVariant.price,
        quantity: item.quantity,
        total: itemTotal,
        hasSurpriseGift: hasSurprise,
        giftAudience: audience,
      });
    }

    // 5. Coupon Discount
    let calculatedDiscount = 0;
    let couponRecord: any = null;

    if (couponCode) {
      const codeUpper = couponCode.toUpperCase().trim();
      try {
        couponRecord = await prisma.coupon.findUnique({
          where: { code: codeUpper },
        });

        if (couponRecord && couponRecord.isActive) {
          const now = new Date();
          const notExpired = !couponRecord.expiresAt || new Date(couponRecord.expiresAt) > now;
          const meetsMin = !couponRecord.minOrder || calculatedSubtotal >= couponRecord.minOrder;
          const underLimit =
            couponRecord.usageLimit === null || couponRecord.usedCount < couponRecord.usageLimit;

          if (notExpired && meetsMin && underLimit) {
            if (couponRecord.type === "PERCENTAGE") {
              const rawDisc = Math.round((calculatedSubtotal * couponRecord.value) / 100);
              calculatedDiscount = couponRecord.maxDiscount
                ? Math.min(rawDisc, couponRecord.maxDiscount)
                : rawDisc;
            } else {
              calculatedDiscount = couponRecord.value;
            }
          }
        }
      } catch (couponErr: any) {
        console.error("[checkout:coupon_lookup] Error fetching coupon", {
          message: couponErr?.message,
          code: couponErr?.code,
          couponCode,
          step: "find_coupon",
        });
      }

      // Hardcoded fallback coupons for standard promotions
      if (calculatedDiscount === 0) {
        if (codeUpper === "DIWALI20" && calculatedSubtotal >= 99900) {
          calculatedDiscount = Math.min(Math.round((calculatedSubtotal * 20) / 100), 50000);
        } else if (codeUpper === "FIRST100" && calculatedSubtotal >= 49900) {
          calculatedDiscount = 10000;
        } else if (codeUpper === "SURPRISE10") {
          calculatedDiscount = Math.round((calculatedSubtotal * 10) / 100);
        }
      }
    }

    // 6. Calculate Shipping & Fees
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
    const gstAmount = 0;
    const orderNumber = generateOrderNumber();

    // 7. Reserve Stock (Variant stock + Gift stock)
    for (const item of orderItemsData) {
      try {
        await prisma.variant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });

        if (item.hasSurpriseGift) {
          const audienceStockUpdate: any = {
            giftStock: { decrement: item.quantity },
          };
          if (item.giftAudience === "Her") {
            audienceStockUpdate.giftStockHer = { decrement: item.quantity };
          } else if (item.giftAudience === "Him") {
            audienceStockUpdate.giftStockHim = { decrement: item.quantity };
          } else {
            audienceStockUpdate.giftStockAnyone = { decrement: item.quantity };
          }

          await prisma.product.update({
            where: { id: item.productId },
            data: audienceStockUpdate,
          });
        }
      } catch (reserveErr: any) {
        console.error("[checkout:stock_reservation_failed] Error decrementing inventory stock", {
          message: reserveErr?.message,
          code: reserveErr?.code,
          item,
          step: "reserve_stock",
        });
        return NextResponse.json(
          { error: "Could not reserve inventory for this order. Please try again." },
          { status: 500 }
        );
      }
    }

    const guestEmail = session.user.email || address.email || "";
    const guestPhone = address.phone || (session.user as any)?.phone || "";

    // ─── 8. COD WORKFLOW (NEVER CALLS RAZORPAY) ──────────────────────
    if (paymentMethod === "COD") {
      let createdOrder: any = null;
      try {
        createdOrder = await prisma.order.create({
          data: {
            orderNumber,
            userId: session.user.id,
            guestEmail,
            guestPhone,
            shippingAddress: address,
            subtotal: calculatedSubtotal,
            shippingFee,
            codFee,
            discount: calculatedDiscount,
            gstAmount,
            total: grandTotal,
            couponId: couponRecord?.id || null,
            couponCode: couponCode || null,
            paymentMethod: "COD",
            paymentStatus: "PENDING",
            status: "PLACED",
            giftMessage: giftMessage || null,
            giftWrap: Boolean(giftWrap),
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
                note: "Order placed via Cash on Delivery (stock reserved)",
              },
            },
          },
          include: {
            items: true,
          },
        });
      } catch (dbOrderErr: any) {
        console.error("[checkout:cod_order_save_failed] Failed creating COD order in DB", {
          message: dbOrderErr?.message,
          code: dbOrderErr?.code,
          orderNumber,
          step: "prisma_order_create_cod",
        });

        // Release reserved stock on DB failure
        for (const item of orderItemsData) {
          try {
            await prisma.variant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            });
            if (item.hasSurpriseGift) {
              const relData: any = { giftStock: { increment: item.quantity } };
              if (item.giftAudience === "Her") relData.giftStockHer = { increment: item.quantity };
              else if (item.giftAudience === "Him") relData.giftStockHim = { increment: item.quantity };
              else relData.giftStockAnyone = { increment: item.quantity };

              await prisma.product.update({
                where: { id: item.productId },
                data: relData,
              });
            }
          } catch (relErr) {
            console.error("[checkout:stock_release_failed]", relErr);
          }
        }

        return NextResponse.json(
          { error: "Failed to save order to database. Please try again." },
          { status: 500 }
        );
      }

      // Generate Reveal Codes for surprise items in COD order
      try {
        for (const orderItem of createdOrder.items) {
          const matchingData = orderItemsData.find((d) => d.variantId === orderItem.variantId);
          if (matchingData?.hasSurpriseGift) {
            const audience = matchingData.giftAudience || "Anyone";
            for (let q = 0; q < orderItem.quantity; q++) {
              const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
              const codeString = `WISH-${orderNumber.slice(-4)}-${randomSuffix}${q > 0 ? `-${q + 1}` : ""}`;
              await prisma.revealCode.create({
                data: {
                  code: codeString,
                  orderItemId: orderItem.id,
                  giftName: `Keepsake (Gift for ${audience})`,
                },
              });
            }
          }
        }
      } catch (revealErr: any) {
        console.error("[checkout:reveal_code_generation_error] Failed generating reveal code for COD", {
          message: revealErr?.message,
          code: revealErr?.code,
          orderNumber,
          step: "generate_reveal_codes_cod",
        });
      }

      // Increment coupon usage
      if (couponRecord) {
        prisma.coupon
          .update({
            where: { id: couponRecord.id },
            data: { usedCount: { increment: 1 } },
          })
          .catch((e) => console.warn("Failed incrementing coupon usedCount", e));
      }

      // Send confirmation email
      if (guestEmail) {
        sendOrderConfirmationEmail({
          orderNumber: createdOrder.orderNumber,
          email: guestEmail,
          customerName: address.name || session.user.name,
          total: grandTotal,
          paymentMethod: "Cash on Delivery",
          items: orderItemsData.map((i) => ({
            name: i.name,
            variantName: i.variantName,
            quantity: i.quantity,
            price: i.price,
          })),
        }).catch((e) => console.error("[checkout:email] Confirmation email failed", e));
      }

      return NextResponse.json({
        success: true,
        orderId: createdOrder.id,
        orderNumber: createdOrder.orderNumber,
        total: grandTotal,
        currency: "INR",
        paymentMethod: "COD",
      });
    }

    // ─── 9. RAZORPAY WORKFLOW ─────────────────────────────────────────
    // Save order first with status AWAITING_PAYMENT
    let createdOrder: any = null;
    try {
      createdOrder = await prisma.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          guestEmail,
          guestPhone,
          shippingAddress: address,
          subtotal: calculatedSubtotal,
          shippingFee,
          codFee: 0,
          discount: calculatedDiscount,
          gstAmount,
          total: grandTotal,
          couponId: couponRecord?.id || null,
          couponCode: couponCode || null,
          paymentMethod: "RAZORPAY",
          paymentStatus: "PENDING",
          status: "AWAITING_PAYMENT",
          giftMessage: giftMessage || null,
          giftWrap: Boolean(giftWrap),
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
              status: "AWAITING_PAYMENT",
              note: "Order created in database with reserved stock, awaiting Razorpay checkout",
            },
          },
        },
      });
    } catch (dbOrderErr: any) {
      console.error("[checkout:razorpay_order_save_failed] Failed creating AWAITING_PAYMENT order in DB", {
        message: dbOrderErr?.message,
        code: dbOrderErr?.code,
        orderNumber,
        step: "prisma_order_create_awaiting_payment",
      });

      // Release reserved stock on DB failure
      for (const item of orderItemsData) {
        try {
          await prisma.variant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
          if (item.hasSurpriseGift) {
            const relData: any = { giftStock: { increment: item.quantity } };
            if (item.giftAudience === "Her") relData.giftStockHer = { increment: item.quantity };
            else if (item.giftAudience === "Him") relData.giftStockHim = { increment: item.quantity };
            else relData.giftStockAnyone = { increment: item.quantity };

            await prisma.product.update({
              where: { id: item.productId },
              data: relData,
            });
          }
        } catch (relErr) {
          console.error("[checkout:stock_release_failed]", relErr);
        }
      }

      return NextResponse.json(
        { error: "Failed to initialize order in database" },
        { status: 500 }
      );
    }

    // Now call Razorpay API to create order
    let rzpOrder: any = null;
    try {
      rzpOrder = await createRazorpayOrder({
        amount: grandTotal,
        receipt: orderNumber,
        notes: {
          orderId: createdOrder.id,
          orderNumber: createdOrder.orderNumber,
          city: address.city || "",
          pincode: address.pincode || "",
        },
      });
    } catch (rzpErr: any) {
      const refCode = Math.random().toString(36).substring(2, 6).toUpperCase();
      console.error("[checkout:razorpay_api_failure] Razorpay order creation failed", {
        refCode,
        message: rzpErr?.message,
        code: rzpErr?.code || rzpErr?.statusCode,
        error: rzpErr?.error,
        orderId: createdOrder.id,
        orderNumber: createdOrder.orderNumber,
        step: "createRazorpayOrder",
      });

      // Mark order FAILED in DB
      try {
        await prisma.order.update({
          where: { id: createdOrder.id },
          data: {
            status: "FAILED",
            paymentStatus: "FAILED",
            statusHistory: {
              create: {
                status: "FAILED",
                note: `Razorpay order creation failed (ref: ${refCode}): ${rzpErr?.message || "Unknown error"}`,
              },
            },
          },
        });
      } catch (updateFailErr: any) {
        console.error("[checkout:order_mark_failed_error] Could not mark order as FAILED", {
          message: updateFailErr?.message,
          code: updateFailErr?.code,
          orderId: createdOrder.id,
        });
      }

      // Release the reserved stock
      for (const item of orderItemsData) {
        try {
          await prisma.variant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });

          if (item.hasSurpriseGift) {
            const audienceRelease: any = {
              giftStock: { increment: item.quantity },
            };
            if (item.giftAudience === "Her") {
              audienceRelease.giftStockHer = { increment: item.quantity };
            } else if (item.giftAudience === "Him") {
              audienceRelease.giftStockHim = { increment: item.quantity };
            } else {
              audienceRelease.giftStockAnyone = { increment: item.quantity };
            }

            await prisma.product.update({
              where: { id: item.productId },
              data: audienceRelease,
            });
          }
        } catch (releaseErr: any) {
          console.error("[checkout:stock_release_failed] Failed releasing reserved stock", {
            message: releaseErr?.message,
            code: releaseErr?.code,
            item,
          });
        }
      }

      return NextResponse.json(
        { error: `Checkout failed (ref: ${refCode})` },
        { status: 500 }
      );
    }

    // Update order with razorpayOrderId
    try {
      await prisma.order.update({
        where: { id: createdOrder.id },
        data: {
          razorpayOrderId: rzpOrder.id,
        },
      });
    } catch (updateRzpErr: any) {
      console.error("[checkout:db_update_rzp_id] Error storing razorpayOrderId on order", {
        message: updateRzpErr?.message,
        code: updateRzpErr?.code,
        orderId: createdOrder.id,
        razorpayOrderId: rzpOrder.id,
        step: "update_razorpay_order_id",
      });
    }

    return NextResponse.json({
      success: true,
      orderId: createdOrder.id,
      orderNumber: createdOrder.orderNumber,
      total: grandTotal,
      currency: "INR",
      paymentMethod: "RAZORPAY",
      razorpayOrderId: rzpOrder.id,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
    });
  } catch (error: any) {
    console.error("[checkout:unhandled_exception] Unexpected error in checkout route", {
      message: error?.message,
      code: error?.code,
      step: "unhandled_root_exception",
    });

    return NextResponse.json(
      { error: "Failed to process checkout. Please try again." },
      { status: 500 }
    );
  }
}
