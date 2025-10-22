import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch all conversations for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            attachments: true,
            readReceipts: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ conversations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

// POST - Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(
      `Creating conversation. Session user: ${session.user.id} (${session.user.email})`
    );

    const { participantId } = await request.json();

    console.log(`Participant ID: ${participantId}`);

    if (!participantId) {
      return NextResponse.json(
        { error: "Participant ID is required" },
        { status: 400 }
      );
    }

    // Validate that the current user exists
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser) {
      console.error(`Current user not found. Session ID: ${session.user.id}`);
      return NextResponse.json(
        {
          error: "Current user not found in database",
          details: "Please log out and log back in",
          sessionUserId: session.user.id,
        },
        { status: 404 }
      );
    }

    // Validate that the participant user exists
    const participantUser = await prisma.user.findUnique({
      where: { id: participantId },
    });

    if (!participantUser) {
      console.error(
        `Participant user not found. Participant ID: ${participantId}`
      );
      return NextResponse.json(
        {
          error: "Participant user not found",
          details: "The selected user may have been deleted",
          participantId: participantId,
        },
        { status: 404 }
      );
    }

    // Check if conversation already exists
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: {
                userId: session.user.id,
              },
            },
          },
          {
            participants: {
              some: {
                userId: participantId,
              },
            },
          },
        ],
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (existingConversation) {
      return NextResponse.json(
        { conversation: existingConversation },
        { status: 200 }
      );
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            {
              userId: session.user.id,
            },
            {
              userId: participantId,
            },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
              },
            },
          },
        },
      },
    });

    // Send welcome message from system
    await prisma.message.create({
      data: {
        content: `Welcome ${
          currentUser.name || "Student"
        }! 👋 Thank you for choosing AssignmentGhar. Our admin is here to help you with your academic needs. Feel free to share your questions, files, or assignment details. We're excited to support your learning journey!`,
        messageType: "SYSTEM",
        conversationId: conversation.id,
        senderId: participantId, // Send from admin's side
        receiverId: session.user.id,
      },
    });

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    console.error("Error creating conversation:", error);
    console.error("Session user ID:", session?.user?.id);
    console.error("Participant ID:", participantId);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
