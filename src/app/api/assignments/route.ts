import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadToGoogleDrive } from "@/lib/google-drive";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// Ensure this route runs on the Node.js runtime (googleapis requires Node, not Edge)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET - Fetch all assignments for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assignments = await prisma.assignment.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        order: true,
      },
    });

    return NextResponse.json({ assignments });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}

// POST - Create a new assignment submission
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure Google Drive is configured (avoid opaque 500s)
    const hasDriveEmail = !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const hasDriveKey = !!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    if (!hasDriveEmail || !hasDriveKey) {
      const missing: string[] = [];
      if (!hasDriveEmail) missing.push("GOOGLE_SERVICE_ACCOUNT_EMAIL");
      if (!hasDriveKey) missing.push("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
      return NextResponse.json(
        {
          error:
            "Google Drive is not configured. Missing required environment variables.",
          details: `Missing: ${missing.join(", ")}`,
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const course = formData.get("course") as string;
    const subject = formData.get("subject") as string;
    const deadline = formData.get("deadline") as string;
    const message = formData.get("message") as string;
    const file = formData.get("file") as File;

    // Validation
    if (!name || !email || !course || !deadline) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: "Module guide file is required" },
        { status: 400 }
      );
    }

    // Validate file type by extension (more reliable across browsers/OS)
    const allowedExts = [".pdf", ".doc", ".docx"];
    const originalName = (file as any).name || "upload";
    const ext = path.extname(originalName).toLowerCase();
    if (!allowedExts.includes(ext)) {
      return NextResponse.json(
        { error: "Only PDF (.pdf) and Word (.doc, .docx) files are allowed" },
        { status: 400 }
      );
    }

    // Upload file to Google Drive
    const fileExtension = ext || path.extname(originalName);
    const safeName =
      name?.toString().replace(/[^a-z0-9_-]+/gi, "_") || "assignment";
    const uniqueFilename = `${safeName}_${uuidv4()}${fileExtension}`;

    let driveFileId: string;
    let fileUrl: string;
    let webViewLink: string;

    try {
      const uploadResult = await uploadToGoogleDrive(file, uniqueFilename);
      driveFileId = uploadResult.fileId;
      fileUrl = uploadResult.webContentLink; // Direct download link
      webViewLink = uploadResult.webViewLink; // Google Drive preview link

      console.log("File uploaded to Google Drive:", {
        fileId: driveFileId,
        fileName: uniqueFilename,
        webViewLink,
      });
    } catch (uploadError: any) {
      console.error("Google Drive upload error:", uploadError);
      const message =
        uploadError?.message || "Failed to upload file to Google Drive";
      return NextResponse.json({ error: message }, { status: 500 });
    }

    // Create assignment in database with Google Drive file URL
    const assignment = await prisma.assignment.create({
      data: {
        title: name,
        description: message || "No additional message",
        course: course,
        subject: subject || course,
        deadline: new Date(deadline),
        fileUrl: webViewLink, // Store Google Drive view link
        status: "PENDING",
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // TODO: Send notification email to admin
    // TODO: Create initial conversation with admin

    return NextResponse.json(
      {
        success: true,
        assignment,
        driveFileId,
        webViewLink,
        message:
          "Assignment submitted successfully and uploaded to Google Drive!",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating assignment:", error);
    const message = error?.message || "Failed to submit assignment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
