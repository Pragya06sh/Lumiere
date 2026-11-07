import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const totalPaidOrders = await prisma.order.count({
      where: { paymentStatus: "PAID" },
    });

    // Only show Bestseller badge if there are at least 10 real paid orders
    if (totalPaidOrders < 10) {
      return NextResponse.json({ bestsellerSlugs: [] });
    }

    // Aggregate paid order items by productId
    const topItems = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      where: {
        order: { paymentStatus: "PAID" },
      },
      orderBy: {
        _sum: { quantity: "desc" },
      },
      take: 3,
    });

    const bestsellerSlugs = topItems
      .map((item) => item.productId)
      .filter(Boolean);

    return NextResponse.json({ bestsellerSlugs });
  } catch (error) {
    console.error("Bestsellers fetch error:", error);
    return NextResponse.json({ bestsellerSlugs: [] });
  }
}

