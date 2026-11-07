import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const codes = await prisma.revealCode.findMany({
      include: {
        orderItem: {
          include: {
            order: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedCodes = codes.map((c) => ({
      id: c.id,
      code: c.code,
      orderNumber: c.orderItem?.order?.orderNumber || null,
      giftName: c.giftName || "Surprise Keepsake",
      isUsed: Boolean(c.usedAt),
      usedAt: c.usedAt
        ? new Date(c.usedAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : null,
      createdAt: new Date(c.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      giftPhotoUrl: c.giftPhotoUrl,
    }));

    return NextResponse.json({ success: true, codes: formattedCodes });
  } catch (error: any) {
    console.error("Failed to fetch reveal codes:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch reveal codes" },
      { status: 500 }
    );
  }
}

