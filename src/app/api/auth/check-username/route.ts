import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

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

    // Check if username exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
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
