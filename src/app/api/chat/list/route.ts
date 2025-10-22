import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get chat list with users and their conversations
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role;

    // Get all users to chat with (based on role)
    const availableUsers = await prisma.user.findMany({
      where: {
        role: userRole === "ADMIN" ? "STUDENT" : "ADMIN",
        id: {
          not: session.user.id, // Exclude self
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });

    // Get existing conversations
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

    // Create a map of userId -> conversation
    const conversationMap = new Map();
    conversations.forEach((conv) => {
      const otherUser = conv.participants.find(
        (p) => p.user.id !== session.user.id
      )?.user;
      if (otherUser && !conversationMap.has(otherUser.id)) {
        conversationMap.set(otherUser.id, conv);
      }
    });

    // Combine users with their conversations
    const chatList = availableUsers.map((user) => ({
      user,
      conversation: conversationMap.get(user.id) || null,
      lastMessage: conversationMap.get(user.id)?.messages[0] || null,
    }));

    // Sort by last message time (users with recent messages first)
    chatList.sort((a, b) => {
      if (!a.lastMessage && !b.lastMessage) return 0;
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return (
        new Date(b.lastMessage.createdAt).getTime() -
        new Date(a.lastMessage.createdAt).getTime()
      );
    });

    return NextResponse.json({ chatList }, { status: 200 });
  } catch (error) {
    console.error("Error fetching chat list:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat list" },
      { status: 500 }
    );
  }
}
