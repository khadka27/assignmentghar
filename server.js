const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Initialize Prisma
const prisma = new PrismaClient();

app.prepare().then(() => {
    const httpServer = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error("Error occurred handling", req.url, err);
            res.statusCode = 500;
            res.end("internal server error");
        }
    });

    // Initialize Socket.IO
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.NEXTAUTH_URL || `http://${hostname}:${port}`,
            methods: ["GET", "POST"],
            credentials: true,
        },
        path: "/api/socket",
    });

    // Store online users
    const onlineUsers = new Map(); // userId -> socketId

    io.on("connection", (socket) => {
        console.log("🔌 Client connected:", socket.id);

        // User authentication
        const userId = socket.handshake.auth.userId;
        if (userId) {
            onlineUsers.set(userId, socket.id);
            console.log(`👤 User ${userId} is now online`);

            // Update user status in database (only if user exists)
            prisma.user
                .findUnique({ where: { id: userId } })
                .then((user) => {
                    if (user) {
                        return prisma.userStatus.upsert({
                            where: { userId },
                            update: { isOnline: true, lastSeen: new Date() },
                            create: { userId, isOnline: true, lastSeen: new Date() },
                        });
                    }
                })
                .catch((err) => console.error("Error updating user status:", err));

            // Broadcast user online status to all clients
            io.emit("user_status_changed", { userId, isOnline: true });
        }

        // Join conversation room
        socket.on("join_conversation", async ({ conversationId, userId }) => {
            try {
                socket.join(`conversation:${conversationId}`);
                console.log(`👥 User ${userId} joined conversation ${conversationId}`);

                // Mark messages as read
                await prisma.readReceipt.createMany({
                    data: await prisma.message
                        .findMany({
                            where: {
                                conversationId,
                                receiverId: userId,
                                readReceipts: { none: { userId } },
                            },
                            select: { id: true },
                        })
                        .then((messages) =>
                            messages.map((msg) => ({
                                messageId: msg.id,
                                userId,
                                readAt: new Date(),
                            }))
                        ),
                    skipDuplicates: true,
                });

                // Notify sender that messages were read
                socket.to(`conversation:${conversationId}`).emit("messages_read", {
                    conversationId,
                    userId,
                });
            } catch (error) {
                console.error("Error joining conversation:", error);
            }
        });

        // Leave conversation room
        socket.on("leave_conversation", ({ conversationId }) => {
            socket.leave(`conversation:${conversationId}`);
            console.log(`👋 User left conversation ${conversationId}`);
        });

        // Send message
        socket.on("send_message", async (data) => {
            try {
                const { conversationId, senderId, receiverId, content, messageType } =
                    data;

                // Create message in database
                const message = await prisma.message.create({
                    data: {
                        conversationId,
                        senderId,
                        receiverId,
                        content,
                        messageType: messageType || "TEXT",
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
                                email: true,
                                image: true,
                                role: true,
                            },
                        },
                        attachments: true,
                        readReceipts: true,
                    },
                });

                // Update conversation timestamp
                await prisma.conversation.update({
                    where: { id: conversationId },
                    data: { updatedAt: new Date() },
                });

                // Emit message to all users in the conversation room
                io.to(`conversation:${conversationId}`).emit("new_message", message);

                // Send notification to receiver if they're online
                const receiverSocketId = onlineUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("notification", {
                        type: "new_message",
                        conversationId,
                        message,
                    });
                }

                console.log(`💬 Message sent in conversation ${conversationId}`);
            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("error", { message: "Failed to send message" });
            }
        });

        // Typing indicator
        socket.on("typing", ({ conversationId, userId, isTyping }) => {
            try {
                // Update typing indicator in database
                if (isTyping) {
                    prisma.typingIndicator
                        .upsert({
                            where: {
                                conversationId_userId: { conversationId, userId },
                            },
                            update: { isTyping: true, updatedAt: new Date() },
                            create: { conversationId, userId, isTyping: true },
                        })
                        .catch((err) => console.error("Error updating typing:", err));
                } else {
                    prisma.typingIndicator
                        .delete({
                            where: {
                                conversationId_userId: { conversationId, userId },
                            },
                        })
                        .catch((err) => {
                            // Ignore error if record doesn't exist
                        });
                }

                // Broadcast typing status to other users in conversation
                socket.to(`conversation:${conversationId}`).emit("user_typing", {
                    conversationId,
                    userId,
                    isTyping,
                });
            } catch (error) {
                console.error("Error handling typing:", error);
            }
        });

        // User goes online
        socket.on("user_online", async ({ userId }) => {
            try {
                onlineUsers.set(userId, socket.id);

                await prisma.userStatus.upsert({
                    where: { userId },
                    update: { isOnline: true, lastSeen: new Date() },
                    create: { userId, isOnline: true, lastSeen: new Date() },
                });

                io.emit("user_status_changed", { userId, isOnline: true });
                console.log(`✅ User ${userId} marked online`);
            } catch (error) {
                console.error("Error setting user online:", error);
            }
        });

        // User goes offline
        socket.on("user_offline", async ({ userId }) => {
            try {
                onlineUsers.delete(userId);

                await prisma.userStatus.upsert({
                    where: { userId },
                    update: { isOnline: false, lastSeen: new Date() },
                    create: { userId, isOnline: false, lastSeen: new Date() },
                });

                io.emit("user_status_changed", { userId, isOnline: false });
                console.log(`❌ User ${userId} marked offline`);
            } catch (error) {
                console.error("Error setting user offline:", error);
            }
        });

        // Handle disconnection
        socket.on("disconnect", async () => {
            console.log("🔌 Client disconnected:", socket.id);

            // Find and remove user from online users
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);

                    // Update user status in database (only if user exists)
                    const user = await prisma.user.findUnique({ where: { id: userId } });
                    if (user) {
                        await prisma.userStatus
                            .upsert({
                                where: { userId },
                                update: { isOnline: false, lastSeen: new Date() },
                                create: { userId, isOnline: false, lastSeen: new Date() },
                            })
                            .catch((err) => console.error("Error updating user status:", err));
                    }

                    // Broadcast user offline status
                    io.emit("user_status_changed", { userId, isOnline: false });
                    console.log(`👤 User ${userId} is now offline`);
                    break;
                }
            }
        });
    });

    httpServer
        .once("error", (err) => {
            console.error("❌ Server error:", err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`✅ Server ready on http://${hostname}:${port}`);
            console.log(`🔌 Socket.IO server ready on path: /api/socket`);
        });
});

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM signal received: closing HTTP server");
    await prisma.$disconnect();
    process.exit(0);
});

process.on("SIGINT", async () => {
    console.log("SIGINT signal received: closing HTTP server");
    await prisma.$disconnect();
    process.exit(0);
});
