import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

/**
 * POST /api/auth/verify-otp
 *
 * Verifies the OTP code sent to user's email.
 *
 * Input: { email, otp }
 *
 * Responses:
 * - 200: OTP verified successfully → { message, next: "/login" }
 * - 400: Invalid or expired OTP → { code: "INVALID_OTP", message }
 * - 404: User not found → { code: "USER_NOT_FOUND", message }
 * - 500: Server error → { code: "SERVER_ERROR", message }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    // Normalize email
    const normalizedEmail = email?.trim().toLowerCase();

    // Validation
    if (!normalizedEmail || !otp) {
      return NextResponse.json(
        {
          code: "MISSING_FIELDS",
          message: "Email and verification code are required",
        },
        { status: 400 }
      );
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        {
          code: "INVALID_OTP",
          message: "Verification code must be 6 digits",
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
          message: "Email already verified. You can login now.",
          next: "/login",
        },
        { status: 200 }
      );
    }

    // Check if OTP exists
    if (!user.otp) {
      return NextResponse.json(
        {
          code: "INVALID_OTP",
          message: "No verification code found. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // Check OTP expiry (timing-safe comparison consideration)
    if (user.otpExpiry && user.otpExpiry < new Date()) {
      return NextResponse.json(
        {
          code: "INVALID_OTP",
          message: "Verification code has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // Verify OTP (constant-time comparison would be ideal)
    if (user.otp !== otp) {
      return NextResponse.json(
        {
          code: "INVALID_OTP",
          message: "Invalid verification code",
        },
        { status: 400 }
      );
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerified: new Date(),
        otp: null,
        otpExpiry: null,
      },
    });

    // Send welcome email (non-blocking)
    try {
      await sendWelcomeEmail(user.email, user.name || "User");
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail the verification if welcome email fails
    }

    return NextResponse.json(
      {
        message: "Verified. You can now login.",
        next: "/login",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      {
        code: "SERVER_ERROR",
        message: "An error occurred during verification",
      },
      { status: 500 }
    );
  }
}
