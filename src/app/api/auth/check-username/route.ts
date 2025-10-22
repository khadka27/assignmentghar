import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/auth/check-username?username=...
 *
 * Checks if a username is already taken.
 *
 * Response:
 * - 200: { available: true/false, message?: string }
 * - 400: { available: false, error: "..." }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username")?.trim();

    if (!username) {
      return NextResponse.json(
        { available: false, error: "Username is required" },
        { status: 400 }
      );
    }

    // Check if username is too short
    if (username.length < 3) {
      return NextResponse.json(
        { available: false, message: "Username must be at least 3 characters" },
        { status: 200 }
      );
    }

    // Validate username format (alphanumeric, underscore, hyphen only)
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return NextResponse.json(
        {
          available: false,
          message: "Username can only contain letters, numbers, _ and -",
        },
        { status: 200 }
      );
    }

    // Check if username exists (case-insensitive)
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { available: false, message: "Username already taken" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { available: true, message: "Username is available" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Check username error:", error);
    return NextResponse.json(
      { available: false, error: "Failed to check username availability" },
      { status: 500 }
    );
  }
}
