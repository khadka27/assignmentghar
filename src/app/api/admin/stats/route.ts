import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all stats
    const [
      totalUsers,
      totalAssignments,
      totalTestimonials,
      pendingTestimonials,
      activeChats,
      adminUsers,
      completedAssignments,
      pendingAssignments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.assignment.count(),
      prisma.testimonial.count(),
      prisma.testimonial.count({ where: { isApproved: false } }),
      prisma.message.count(),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.assignment.count({ where: { status: "COMPLETED" } }),
      prisma.assignment.count({ where: { status: "PENDING" } }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalAssignments,
      totalTestimonials,
      pendingTestimonials,
      activeChats,
      adminUsers,
      completedAssignments,
      pendingAssignments,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
