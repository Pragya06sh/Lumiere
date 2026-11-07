import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedOrders = orders.map((order) => {
      const address = (order.shippingAddress as Record<string, any>) || {};
      const customerName =
        address.fullName ||
        address.name ||
        order.guestEmail ||
        "Anonymous Guest";
      const phone = address.phone || order.guestPhone || "—";
      const city = address.city || "—";
      const pincode = address.pincode || "—";

      const itemsSummary = order.items.length > 0
        ? order.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")
        : "No item details";

      const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName,
        phone,
        city,
        pincode,
        itemsSummary,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
        date: dateStr,
      };
    });

    return NextResponse.json({ success: true, orders: formattedOrders });
  } catch (error: any) {
    console.error("Failed to fetch admin orders:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: "Missing orderId or status" },
        { status: 400 }
      );
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            note: `Status updated to ${status} via Admin Dashboard`,
          },
        },
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error("Failed to update order status:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}

