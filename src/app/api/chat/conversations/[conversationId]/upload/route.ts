import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await params;
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const receiverId = formData.get("receiverId") as string;

    if (!file || !receiverId) {
      return NextResponse.json(
        { error: "File and receiverId are required" },
        { status: 400 }
      );
    }

    // File size limit: 5MB
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      // Send email notification about file size limit
      try {
        const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;
        if (adminEmail && process.env.EMAIL_SERVER_HOST) {
          const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
            secure: false,
            auth: {
              user: process.env.EMAIL_SERVER_USER,
              pass: process.env.EMAIL_SERVER_PASSWORD,
            },
          });

          await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: adminEmail,
            subject: "File Size Limit Exceeded - AssignmentGhar",
            html: `
              <h2>File Upload Size Limit Exceeded</h2>
              <p><strong>User:</strong> ${
                session.user.name || session.user.email
              }</p>
              <p><strong>User Email:</strong> ${session.user.email}</p>
              <p><strong>File Name:</strong> ${file.name}</p>
              <p><strong>File Size:</strong> ${(
                file.size /
                (1024 * 1024)
              ).toFixed(2)} MB</p>
              <p><strong>Limit:</strong> 5 MB</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <p>The user attempted to upload a file that exceeds the 5MB size limit in the chat.</p>
            `,
          });
        }
      } catch (emailError) {
        console.error(
          "Failed to send file size notification email:",
          emailError
        );
      }

      return NextResponse.json(
        {
          error: `File size exceeds 5MB limit. Your file is ${(
            file.size /
            (1024 * 1024)
          ).toFixed(2)}MB. Please contact support for large files.`,
          fileSize: file.size,
          maxSize: MAX_FILE_SIZE,
        },
        { status: 400 }
      );
    }

    // Validate file type - allow images, PDFs, and Word documents
    const allowedTypes = [
      // Images
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      // PDFs
      "application/pdf",
      // Word documents
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    ];

    const fileExtension = path.extname(file.name).toLowerCase();
    const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".pdf",
      ".doc",
      ".docx",
    ];

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(fileExtension)
    ) {
      return NextResponse.json(
        {
          error:
            "Only images (JPG, PNG, GIF, WebP, SVG), PDFs, and Word documents (DOC, DOCX) are allowed",
        },
        { status: 400 }
      );
    }

    // Verify user is part of this conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Save file to public/assignment directory
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `chat_${timestamp}_${sanitizedFileName}`;
    const uploadDir = path.join(process.cwd(), "public", "assignment");
    const filePath = path.join(uploadDir, fileName);

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);

    const fileUrl = `/assignment/${fileName}`;

    // Determine message type based on file type
    let messageType = "FILE";
    let contentDescription = "a file";

    if (file.type.startsWith("image/")) {
      messageType = "IMAGE";
      contentDescription = "an image";
    } else if (file.type === "application/pdf") {
      contentDescription = "a PDF document";
    } else if (
      file.type.includes("word") ||
      fileExtension === ".doc" ||
      fileExtension === ".docx"
    ) {
      contentDescription = "a Word document";
    }

    // Create message with file attachment
    const message = await prisma.message.create({
      data: {
        content: `Shared ${contentDescription}: ${file.name}`,
        messageType: messageType as any,
        conversationId,
        senderId: session.user.id,
        receiverId,
        attachments: {
          create: {
            fileName: file.name,
            fileUrl,
            fileType: file.type,
            fileSize: file.size,
          },
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
          },
        },
        attachments: true,
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
