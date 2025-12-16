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

    // Get chart data for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await prisma.$queryRaw<
      Array<{
        month: string;
        users: bigint;
        assignments: bigint;
        messages: bigint;
      }>
    >`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') as month,
        COUNT(DISTINCT CASE WHEN table_name = 'User' THEN id END) as users,
        COUNT(DISTINCT CASE WHEN table_name = 'Assignment' THEN id END) as assignments,
        COUNT(DISTINCT CASE WHEN table_name = 'Message' THEN id END) as messages
      FROM (
        SELECT id, "createdAt", 'User' as table_name FROM "User" WHERE "createdAt" >= ${sixMonthsAgo}
        UNION ALL
        SELECT id, "createdAt", 'Assignment' as table_name FROM "Assignment" WHERE "createdAt" >= ${sixMonthsAgo}
        UNION ALL
        SELECT id, "createdAt", 'Message' as table_name FROM "Message" WHERE "createdAt" >= ${sixMonthsAgo}
      ) combined
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt") ASC
    `;

    // Format chart data
    const chartData = monthlyData.map((row) => ({
      name: row.month,
      users: Number(row.users),
      assignments: Number(row.assignments),
      messages: Number(row.messages),
    }));

    // Get recent activity
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true,
      },
    });

    const recentAssignments = await prisma.assignment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({
      totalUsers,
      totalAssignments,
      totalTestimonials,
      pendingTestimonials,
      activeChats,
      adminUsers,
      completedAssignments,
      pendingAssignments,
      chartData:
        chartData.length > 0
          ? chartData
          : [{ name: "No Data", users: 0, assignments: 0, messages: 0 }],
      recentUsers,
      recentAssignments,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
