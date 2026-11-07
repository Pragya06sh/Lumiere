import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    console.error("[Admin Messages GET Error]", error);
    return NextResponse.json(
      { error: "Failed to load messages" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isRead } = body;

    if (!id || typeof isRead !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { isRead },
    });

    return NextResponse.json({ success: true, message: updated });
  } catch (error: any) {
    console.error("[Admin Messages PATCH Error]", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing message id" }, { status: 400 });
    }

    await prisma.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Admin Messages DELETE Error]", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}

