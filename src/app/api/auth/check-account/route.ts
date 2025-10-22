import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/auth/check-account?identifier=...
 *
 * Checks if an account exists by email or username and whether it's verified.
 *
 * Response examples:
 * - 200: { exists: true, isVerified: false, email: "user@example.com", username: "john" }
 * - 200: { exists: false, isVerified: false }
 * - 400: { code: "MISSING_IDENTIFIER", message: "identifier is required" }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const identifier = searchParams.get("identifier")?.trim();

    if (!identifier) {
      return NextResponse.json(
        { code: "MISSING_IDENTIFIER", message: "identifier is required" },
        { status: 400 }
      );
    }

    const isEmail = /.+@.+\..+/.test(identifier);
    const email = isEmail ? identifier.toLowerCase() : undefined;
    const username = !isEmail ? identifier : undefined;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : undefined,
          username
            ? { username: { equals: username, mode: "insensitive" as const } }
            : undefined,
        ].filter(Boolean) as any,
      },
      select: { id: true, email: true, username: true, isVerified: true },
    });

    if (!user) {
      return NextResponse.json(
        { exists: false, isVerified: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        exists: true,
        isVerified: !!user.isVerified,
        email: user.email,
        username: user.username,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("check-account error:", error);
    return NextResponse.json(
      { code: "SERVER_ERROR", message: "Failed to check account" },
      { status: 500 }
    );
  }
}
