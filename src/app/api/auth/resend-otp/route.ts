import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOTP, sendOTPEmail } from "@/lib/email";

/**
 * POST /api/auth/resend-otp
 *
 * Resends OTP to unverified user's email.
 *
 * Input: { email }
 *
 * Responses:
 * - 200: OTP sent (or already verified) → { message, next? }
 * - 404: User not found → { code: "USER_NOT_FOUND", message }
 * - 500: Server error → { code: "SERVER_ERROR", message }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

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

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        {
          code: "USER_NOT_FOUND",
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.isVerified) {
      return NextResponse.json(
        {
          message: "Already verified. You can login now.",
          next: "/login",
        },
        { status: 200 }
      );
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp,
        otpExpiry,
      },
    });

    // Send OTP email
    try {
      await sendOTPEmail(normalizedEmail, otp, user.name || undefined);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      return NextResponse.json(
        {
          code: "EMAIL_SEND_FAILED",
          message: "Failed to send verification code. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "OTP sent. Please check your email.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      {
        code: "SERVER_ERROR",
        message: "Failed to resend verification code",
      },
      { status: 500 }
    );
  }
}
