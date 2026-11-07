import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/authValidators";
import { checkRateLimit } from "@/lib/rateLimit";
import { sendPasswordResetEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const { email } = parsed.data;

    // Rate limit per IP and email
    const rateCheck = checkRateLimit(`forgot:${ip}:${email}`, 3, 15 * 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many reset requests. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetExpires,
        },
      });

      await sendPasswordResetEmail(email, resetToken);
    }

    // Generic response regardless of whether email was found
    return NextResponse.json({
      success: true,
      message:
        "If an account exists with that email address, a password reset link has been dispatched.",
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Unable to process password reset request right now. Please try again." },
      { status: 500 }
    );
  }
}

