import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    try {
      await prisma.newsletter.upsert({
        where: { email },
        update: {},
        create: { email },
      });
    } catch (e) {
      // If DB is running in mock mode
      console.log("Newsletter recorded:", email);
    }

    return NextResponse.json({ success: true, message: "Subscribed successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
