import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

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

    // Save file to public/uploads directory
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "chat");
    const filePath = path.join(uploadDir, fileName);

    // Ensure directory exists (you may need to create it manually first time)
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/chat/${fileName}`;

    // Determine message type based on file type
    let messageType = "FILE";
    if (file.type.startsWith("image/")) {
      messageType = "IMAGE";
    }

    // Create message with file attachment
    const message = await prisma.message.create({
      data: {
        content: `Shared ${
          file.type.startsWith("image/") ? "an image" : "a file"
        }: ${file.name}`,
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
