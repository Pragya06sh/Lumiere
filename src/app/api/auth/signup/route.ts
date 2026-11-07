import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/authValidators";
import { checkRateLimit } from "@/lib/rateLimit";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rateCheck = checkRateLimit(`signup:${ip}`, 5, 15 * 60);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many sign-up attempts. Please wait ${rateCheck.resetInSeconds} seconds.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid input data";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, phone, password } = parsed.data;

    // Check existing email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please log in." },
        { status: 409 }
      );
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const isAdminEmail =
      email.toLowerCase() === (process.env.ADMIN_EMAIL || "admin@wickandwish.in").toLowerCase() ||
      email.toLowerCase() === "pragya.shree.tech@gmail.com" ||
      email.toLowerCase() === "ps333mahi@gmail.com";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role: isAdminEmail ? "ADMIN" : "CUSTOMER",
        emailVerified: !siteConfig.auth.emailVerificationEnabled ? new Date() : null,
      },
    });

    // Auto-link past orders matching email
    try {
      await prisma.order.updateMany({
        where: {
          guestEmail: email,
          userId: null,
        },
        data: {
          userId: user.id,
        },
      });
    } catch (e) {
      console.error("Order linking error on signup:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during account creation. Please try again." },
      { status: 500 }
    );
  }
}

