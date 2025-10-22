import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if user exists in database
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json({
      session: {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      },
      database: dbUser
        ? {
            userId: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
            match: dbUser.id === session.user.id ? "✅ MATCH" : "❌ MISMATCH",
          }
        : "❌ USER NOT FOUND IN DATABASE",
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
