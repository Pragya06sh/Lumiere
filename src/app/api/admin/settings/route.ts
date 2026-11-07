import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: "default",
          festiveMode: true,
          announcementText:
            "Complimentary Pan-India Delivery on Qualifying Orders",
          announcementActive: true,
          freeShippingThreshold: 99900,
          codFee: 4900,
        },
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { festiveMode, announcementText, freeShippingThreshold, codFee } =
      body;

    const updated = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {
        festiveMode: typeof festiveMode === "boolean" ? festiveMode : undefined,
        announcementText:
          typeof announcementText === "string" ? announcementText : undefined,
        freeShippingThreshold:
          typeof freeShippingThreshold === "number"
            ? freeShippingThreshold
            : undefined,
        codFee: typeof codFee === "number" ? codFee : undefined,
      },
      create: {
        id: "default",
        festiveMode: festiveMode ?? true,
        announcementText: announcementText ?? "",
        freeShippingThreshold: freeShippingThreshold ?? 99900,
        codFee: codFee ?? 4900,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error("Failed to update settings:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}

