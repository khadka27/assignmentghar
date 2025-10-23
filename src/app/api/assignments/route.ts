import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadToGoogleDrive } from "@/lib/google-drive";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// GET - Fetch all assignments for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
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
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
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

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF and Word documents are allowed" },
        { status: 400 }
      );
    }

    // Upload file to Google Drive
    const fileExtension = path.extname(file.name);
    const uniqueFilename = `${name}_${uuidv4()}${fileExtension}`;
    
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
    } catch (uploadError) {
      console.error("Google Drive upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file to Google Drive" },
        { status: 500 }
      );
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
        message: "Assignment submitted successfully and uploaded to Google Drive!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating assignment:", error);
    return NextResponse.json(
      { error: "Failed to submit assignment" },
      { status: 500 }
    );
  }
}
