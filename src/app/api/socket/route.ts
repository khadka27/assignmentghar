import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Socket.IO is handled by the custom server (server.js)
// This endpoint is for compatibility and health checks
export async function GET() {
  return NextResponse.json({
    status: "active",
    message:
      "Socket.IO server is running on custom server. Connect via path: /api/socket",
    timestamp: new Date().toISOString(),
  });
}
