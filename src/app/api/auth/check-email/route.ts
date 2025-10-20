import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { available: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { available: false, message: "Invalid email format" },
        { status: 200 }
      );
    }

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { available: false, message: "Email already registered" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { available: true, message: "Email is available" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Check email error:", error);
    return NextResponse.json(
      { available: false, error: "Failed to check email availability" },
      { status: 500 }
    );
  }
}
