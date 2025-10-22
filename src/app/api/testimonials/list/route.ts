import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/testimonials/list?page=1&limit=10
 *
 * Fetch approved testimonials with pagination.
 *
 * Query params:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 50)
 *
 * Response:
 * - 200: { testimonials: [...], total, page, totalPages }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        {
          code: "INVALID_PARAMS",
          message: "Page and limit must be positive numbers",
        },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Get total count of approved testimonials
    const total = await prisma.testimonial.count({
      where: { isApproved: true },
    });

    // Fetch approved testimonials
    const testimonials = await prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        displayName: true,
        isAnonymous: true,
        rating: true,
        message: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    // Format testimonials for display
    const formattedTestimonials = testimonials.map((t) => ({
      id: t.id,
      authorName: t.isAnonymous
        ? "Anonymous"
        : t.displayName || t.user?.name || "User",
      authorImage: t.isAnonymous ? null : t.user?.image || null,
      rating: t.rating,
      message: t.message,
      date: t.createdAt,
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        testimonials: formattedTestimonials,
        total,
        page,
        limit,
        totalPages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch testimonials error:", error);
    return NextResponse.json(
      {
        code: "SERVER_ERROR",
        message: "An error occurred while fetching testimonials",
      },
      { status: 500 }
    );
  }
}
