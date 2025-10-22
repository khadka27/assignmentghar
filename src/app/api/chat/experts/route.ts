import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get available users to chat with (role-based)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role;

    let users;

    if (userRole === "ADMIN") {
      // Admin can see all students
      users = await prisma.user.findMany({
        where: {
          role: "STUDENT",
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      });
    } else {
      // Students can only see admins
      users = await prisma.user.findMany({
        where: {
          role: "ADMIN",
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      });
    }

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
