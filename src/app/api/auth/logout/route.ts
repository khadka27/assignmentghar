import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Logout API Endpoint
 * Handles user logout with NextAuth
 */
export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Log the logout action
    console.log(`User ${session.user?.email} logging out at ${new Date().toISOString()}`);

    // Return success response
    // The actual sign out is handled by NextAuth on the client side
    return NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      {
        error: "Logout failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (optional, for debugging)
export async function GET() {
  return NextResponse.json(
    {
      message: "Use POST method to logout",
    },
    { status: 405 }
  );
}
