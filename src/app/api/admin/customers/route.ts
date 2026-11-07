import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            total: true,
            paymentStatus: true,
          },
        },
      },
    });

    const customers = users.map((u) => {
      const totalOrders = u.orders.length;
      const totalSpend = u.orders
        .filter((o) => o.paymentStatus === "PAID")
        .reduce((sum, o) => sum + o.total, 0);

      return {
        id: u.id,
        name: u.name || "Client",
        email: u.email,
        phone: u.phone || "—",
        role: u.role,
        registeredAt: u.createdAt,
        totalOrders,
        totalSpend,
      };
    });

    return NextResponse.json({ success: true, customers });
  } catch (error: any) {
    console.error("[Admin Customers GET Error]", error);
    return NextResponse.json(
      { error: "Failed to load customers" },
      { status: 500 }
    );
  }
}

