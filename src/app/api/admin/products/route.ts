import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        variants: true,
        images: {
          orderBy: { position: "asc" },
        },
        categories: {
          include: { category: true },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const formattedProducts = products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      hasSurpriseGift: p.hasSurpriseGift,
      giftTier: p.giftTier,
      giftDescriptionInternal: p.giftDescriptionInternal,
      giftStock: p.giftStock,
      giftStockHer: p.giftStockHer,
      giftStockHim: p.giftStockHim,
      giftStockAnyone: p.giftStockAnyone,
      giftItemsHer: p.giftItemsHer,
      giftItemsHim: p.giftItemsHim,
      giftItemsAnyone: p.giftItemsAnyone,
      categories: p.categories.map((c) => c.category.name),
      variants: p.variants.map((v) => ({
        id: v.id,
        name: v.name,
        sku: v.sku,
        price: v.price,
        compareAt: v.compareAt,
        stock: v.stock,
      })),
      images: p.images.map((img) => ({
        url: img.url,
        alt: img.alt || p.name,
      })),
    }));

    return NextResponse.json({ success: true, products: formattedProducts });
  } catch (error: any) {
    console.error("Failed to fetch admin products:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      slug,
      hasSurpriseGift,
      giftTier,
      giftStock,
      giftStockHer,
      giftStockHim,
      giftStockAnyone,
      giftItemsHer,
      giftItemsHim,
      giftItemsAnyone,
      giftDescriptionInternal,
    } = body;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Product slug is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { slug },
      data: {
        hasSurpriseGift: Boolean(hasSurpriseGift),
        giftTier: giftTier || null,
        giftStock: typeof giftStock === "number" ? Math.max(0, giftStock) : 0,
        giftStockHer: typeof giftStockHer === "number" ? Math.max(0, giftStockHer) : undefined,
        giftStockHim: typeof giftStockHim === "number" ? Math.max(0, giftStockHim) : undefined,
        giftStockAnyone: typeof giftStockAnyone === "number" ? Math.max(0, giftStockAnyone) : undefined,
        giftItemsHer: giftItemsHer !== undefined ? giftItemsHer : undefined,
        giftItemsHim: giftItemsHim !== undefined ? giftItemsHim : undefined,
        giftItemsAnyone: giftItemsAnyone !== undefined ? giftItemsAnyone : undefined,
        giftDescriptionInternal: giftDescriptionInternal || null,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

