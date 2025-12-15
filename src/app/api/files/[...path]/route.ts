import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { path: filePath } = await params;
    const fileName = filePath.join("/");
    const fullPath = path.join(process.cwd(), "public", "assignment", fileName);

    // Check if file exists
    try {
      const fileStats = await stat(fullPath);
      if (!fileStats.isFile()) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read file
    const fileBuffer = await readFile(fullPath);

    // Determine content type based on file extension
    const ext = path.extname(fileName).toLowerCase();
    const contentTypes: Record<string, string> = {
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xls": "application/vnd.ms-excel",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".ppt": "application/vnd.ms-powerpoint",
      ".pptx":
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ".txt": "text/plain",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".zip": "application/zip",
      ".rar": "application/x-rar-compressed",
    };

    const contentType = contentTypes[ext] || "application/octet-stream";

    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${path.basename(fileName)}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("File fetch error:", error);
    return NextResponse.json(
      { error: "File not found or error reading file" },
      { status: 500 }
    );
  }
}
