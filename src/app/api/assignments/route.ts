import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/lib/s3";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// Ensure this route runs on the Node.js runtime (AWS SDK requires Node, not Edge)
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

    // Ensure AWS S3 is configured
    if (
      !process.env.AWS_REGION ||
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY
    ) {
      return NextResponse.json(
        {
          error:
            "AWS S3 is not configured. Set AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY in .env",
        },
        { status: 500 }
      );
    }
    if (!process.env.AWS_S3_BUCKET_NAME) {
      return NextResponse.json(
        {
          error: "AWS_S3_BUCKET_NAME is not configured. Set it in .env",
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

    // Upload file to S3
    const fileExtension = ext || path.extname(originalName);
    const safeName =
      name?.toString().replace(/[^a-z0-9_-]+/gi, "_") || "assignment";
    const uniqueFilename = `${safeName}_${uuidv4()}${fileExtension}`;

    let s3FileKey: string;
    let fileUrl: string;

    try {
      const uploadResult = await uploadToS3(file, uniqueFilename);
      s3FileKey = uploadResult.fileKey;
      fileUrl = uploadResult.fileUrl; // S3 file URL

      console.log("File uploaded to S3:", {
        fileKey: s3FileKey,
        fileName: uniqueFilename,
        fileUrl,
      });
    } catch (uploadError: any) {
      console.error("S3 upload error:", uploadError);
      const message = uploadError?.message || "Failed to upload file to S3";
      return NextResponse.json({ error: message }, { status: 500 });
    }

    // Create assignment in database with S3 file URL
    const assignment = await prisma.assignment.create({
      data: {
        title: name,
        description: message || "No additional message",
        course: course,
        subject: subject || course,
        deadline: new Date(deadline),
        fileUrl: fileUrl, // Store S3 file URL
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
        s3FileKey,
        fileUrl,
        message: "Assignment submitted successfully and uploaded to S3!",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating assignment:", error);
    const message = error?.message || "Failed to submit assignment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
