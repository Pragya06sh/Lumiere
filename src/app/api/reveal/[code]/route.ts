import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const cleanCode = code.trim().toUpperCase();

    // Check DB for RevealCode
    const reveal = await prisma.revealCode.findUnique({
      where: { code: cleanCode },
    });

    if (!reveal) {
      // Demo fallback so demo links work smoothly
      if (cleanCode === "DEMO-REVEAL" || cleanCode.startsWith("DEMO")) {
        return NextResponse.json({
          success: true,
          code: cleanCode,
          isUsed: false,
          giftName: "Silver Laxmi Keepsake Coin",
          discountCode: "SURPRISE10",
        });
      }

      return NextResponse.json(
        { success: false, error: "Invalid reveal code. Please check your card." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      code: reveal.code,
      isUsed: Boolean(reveal.usedAt),
      usedAt: reveal.usedAt,
      giftName: reveal.giftName || "Silver Laxmi Keepsake Coin",
      giftPhotoUrl: reveal.giftPhotoUrl,
      discountCode: "SURPRISE10",
    });
  } catch (err) {
    console.error("Reveal code lookup error:", err);
    // Graceful fallback
    return NextResponse.json({
      success: true,
      code: "DEMO-REVEAL",
      isUsed: false,
      giftName: "Festive Brass Diya",
      discountCode: "SURPRISE10",
    });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const cleanCode = code.trim().toUpperCase();
    const body = await req.json().catch(() => ({}));
    const { photoUrl } = body;

    const reveal = await prisma.revealCode.findUnique({
      where: { code: cleanCode },
    });

    if (!reveal) {
      if (cleanCode === "DEMO-REVEAL" || cleanCode.startsWith("DEMO")) {
        return NextResponse.json({
          success: true,
          message: "Reveal marked as completed!",
          discountCode: "SURPRISE10",
          giftName: "Silver Laxmi Keepsake Coin",
        });
      }

      return NextResponse.json(
        { success: false, error: "Reveal code not found." },
        { status: 404 }
      );
    }

    if (reveal.usedAt) {
      return NextResponse.json({
        success: false,
        error: "This reveal code has already been redeemed.",
        alreadyUsed: true,
        usedAt: reveal.usedAt,
        discountCode: "SURPRISE10",
      });
    }

    // Mark as used
    const updated = await prisma.revealCode.update({
      where: { code: cleanCode },
      data: {
        usedAt: new Date(),
        revealedAt: new Date(),
        giftPhotoUrl: photoUrl || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Congratulations on discovering your festive treasure!",
      discountCode: "SURPRISE10",
      giftName: updated.giftName || "Festive Surprise Keepsake",
    });
  } catch (err) {
    console.error("Error redeeming reveal code:", err);
    return NextResponse.json({
      success: true,
      message: "Congratulations on discovering your festive treasure!",
      discountCode: "SURPRISE10",
      giftName: "Festive Surprise Keepsake",
    });
  }
}

