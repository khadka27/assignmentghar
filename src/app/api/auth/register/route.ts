import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateOTP, sendOTPEmail } from "@/lib/email";

/**
 * POST /api/auth/register
 *
 * Registers a new user or re-registers an unverified user.
 *
 * Input: { name, username?, email, password }
 *
 * Responses:
 * - 201: New user created, OTP sent → { message, next: "/verify" }
 * - 200: Unverified user, new OTP sent → { message, next: "/verify" }
 * - 409: Email already verified → { code: "EMAIL_TAKEN", message }
 * - 400: Username taken or validation error → { code, message }
 * - 500: Server error → { code: "SERVER_ERROR", message }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, username, email, password } = body;

    // Normalize email
    const normalizedEmail = email?.trim().toLowerCase();

    // Validation
    if (!name || !normalizedEmail || !password) {
      return NextResponse.json(
        {
          code: "MISSING_FIELDS",
          message: "Name, email, and password are required",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        {
          code: "INVALID_EMAIL",
          message: "Please provide a valid email address",
        },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        {
          code: "WEAK_PASSWORD",
          message: "Password must be at least 8 characters",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { username: username || undefined }],
      },
    });

    if (existingUser) {
      // Email already exists and is VERIFIED
      if (existingUser.email === normalizedEmail && existingUser.isVerified) {
        return NextResponse.json(
          {
            code: "EMAIL_TAKEN",
            message: "Email already registered",
          },
          { status: 409 }
        );
      }

      // Username taken (by a different user)
      if (
        existingUser.username === username &&
        existingUser.email !== normalizedEmail
      ) {
        return NextResponse.json(
          {
            code: "USERNAME_TAKEN",
            message: "Username already taken",
          },
          { status: 400 }
        );
      }

      // Email exists but is UNVERIFIED → Regenerate OTP and resend
      if (existingUser.email === normalizedEmail && !existingUser.isVerified) {
        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Update user with new OTP and updated info
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name, // Update name in case they changed it
            username: username || existingUser.username,
            password: await bcrypt.hash(password, 12), // Update password
            otp,
            otpExpiry,
          },
        });

        // Send OTP email
        try {
          await sendOTPEmail(normalizedEmail, otp, name);
        } catch (emailError) {
          console.error("Failed to send OTP email:", emailError);
          return NextResponse.json(
            {
              code: "EMAIL_SEND_FAILED",
              message: "Failed to send verification email. Please try again.",
            },
            { status: 500 }
          );
        }

        return NextResponse.json(
          {
            message:
              "Verification required. A new code has been sent to your email.",
            next: "/verify",
          },
          { status: 200 }
        );
      }
    }

    // NEW USER → Create account
    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email: normalizedEmail,
        password: hashedPassword,
        role: "STUDENT", // Default role
        otp,
        otpExpiry,
        isVerified: false,
      },
    });

    // Send OTP email
    try {
      await sendOTPEmail(normalizedEmail, otp, name);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      // Delete user if email fails
      await prisma.user.delete({ where: { id: user.id } });
      return NextResponse.json(
        {
          code: "EMAIL_SEND_FAILED",
          message: "Failed to send verification email. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Verification required. Please check your email for the code.",
        next: "/verify",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        code: "SERVER_ERROR",
        message: "An error occurred during registration",
      },
      { status: 500 }
    );
  }
}
