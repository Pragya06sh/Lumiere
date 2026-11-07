import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import { sendContactNotificationEmail } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  orderNumber: z.string().trim().max(50).optional().nullable(),
  message: z.string().trim().min(5, "Message must be at least 5 characters").max(2000),
});

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous";
    const rateCheck = checkRateLimit(`contact:${ip}`, 5, 10 * 60);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many messages sent. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid input data";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { name, phone, orderNumber, message } = parsed.data;

    const savedMessage = await prisma.contactMessage.create({
      data: {
        name,
        phone,
        orderNumber: orderNumber || null,
        message,
      },
    });

    // Notify staff inbox asynchronously (failsafe)
    try {
      await sendContactNotificationEmail({
        name,
        phone,
        orderNumber,
        message,
      });
    } catch (emailErr) {
      console.error("[Contact Email Notification Failed]", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been received.",
      id: savedMessage.id,
    });
  } catch (error: any) {
    console.error("[Contact API Error]", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again shortly." },
      { status: 500 }
    );
  }
}

