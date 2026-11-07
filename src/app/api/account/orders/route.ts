import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Link any unlinked past orders matching the email
    if (session.user.id) {
      await prisma.order.updateMany({
        where: {
          guestEmail: session.user.email,
          userId: null,
        },
        data: {
          userId: session.user.id,
        },
      });
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { guestEmail: session.user.email },
        ],
      },
      include: {
        items: {
          include: {
            revealCodes: true,
          },
        },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Account orders fetch error:", error);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}

