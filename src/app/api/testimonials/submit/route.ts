import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * POST /api/testimonials/submit
 *
 * Submit a new testimonial/review.
 * If user is logged in, uses their name from database.
 * If not logged in, can submit anonymously or with custom name.
 *
 * Input: { displayName?, isAnonymous, rating, message }
 *
 * Responses:
 * - 201: Testimonial submitted successfully
 * - 400: Validation error
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { displayName, isAnonymous, rating, message } = body;

    // Get current user session (optional - can be logged in or not)
    const session = await auth();

    // Validation
    if (typeof isAnonymous !== "boolean") {
      return NextResponse.json(
        {
          code: "MISSING_FIELDS",
          message: "isAnonymous field is required",
        },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          code: "INVALID_RATING",
          message: "Rating must be between 1 and 5",
        },
        { status: 400 }
      );
    }

    if (!message || message.trim().length < 10) {
      return NextResponse.json(
        {
          code: "INVALID_MESSAGE",
          message: "Message must be at least 10 characters long",
        },
        { status: 400 }
      );
    }

    if (message.trim().length > 1000) {
      return NextResponse.json(
        {
          code: "MESSAGE_TOO_LONG",
          message: "Message must be less than 1000 characters",
        },
        { status: 400 }
      );
    }

    // Determine display name based on authentication and anonymous status
    let finalDisplayName: string | null = null;

    if (!isAnonymous) {
      if (session?.user) {
        // If logged in, use the user's name from the database
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { name: true },
        });
        finalDisplayName = user?.name || null;
      } else {
        // If not logged in, require displayName
        if (!displayName?.trim()) {
          return NextResponse.json(
            {
              code: "MISSING_NAME",
              message:
                "Display name is required when not logged in and not submitting anonymously",
            },
            { status: 400 }
          );
        }
        finalDisplayName = displayName.trim();
      }
    }

    // Create testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        userId: session?.user?.id || null,
        displayName: finalDisplayName,
        isAnonymous,
        rating,
        message: message.trim(),
        isApproved: false, // Requires admin approval
      },
    });

    return NextResponse.json(
      {
        message:
          "Thank you for your feedback! Your testimonial has been submitted and is pending approval.",
        testimonialId: testimonial.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Testimonial submission error:", error);
    return NextResponse.json(
      {
        code: "SERVER_ERROR",
        message: "An error occurred while submitting your testimonial",
      },
      { status: 500 }
    );
  }
}
