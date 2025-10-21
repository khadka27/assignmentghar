import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/auth/check-account-status
 *
 * Checks if an email exists and its verification status.
 * Used by missing-verification page.
 *
 * Input: { email }
 *
 * Responses:
 * - 200: Always returns 200 with status info
 *   { exists: boolean, isVerified: boolean, email?, name?, message, next? }
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Normalize email
    const normalizedEmail = email?.trim().toLowerCase();

    // Validation
    if (!normalizedEmail) {
      return NextResponse.json(
        {
          code: "MISSING_FIELDS",
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        isVerified: true,
        name: true,
      },
    });

    // User not found
    if (!user) {
      return NextResponse.json(
        {
          exists: false,
          isVerified: false,
          message: "No account found with this email",
        },
        { status: 200 }
      );
    }

    // User exists and verified
    if (user.isVerified) {
      return NextResponse.json(
        {
          exists: true,
          isVerified: true,
          email: user.email,
          name: user.name,
          message: "Account is verified",
          next: "/login",
        },
        { status: 200 }
      );
    }

    // User exists but unverified
    return NextResponse.json(
      {
        exists: true,
        isVerified: false,
        email: user.email,
        name: user.name,
        message: "Account exists but not verified",
        next: "/verify",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Check account status error:", error);
    return NextResponse.json(
      {
        code: "SERVER_ERROR",
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
