"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSocket } from "@/contexts/socket-context";
import {
  Send,
  Paperclip,
  FileText,
  Download,
  MessageSquare,
  Users,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

interface Message {
  id: string;
  conversationId: string;
  content: string;
  messageType: string;
  createdAt: string;
  sender: User;
  receiver: User;
  attachments: Attachment[];
  readReceipts: any[];
}

interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
  participants: Array<{
    id: string;
    user: User;
  }>;
  messages: Message[];
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { socket, isConnected } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [experts, setExperts] = useState<User[]>([]);
  const [showExpertList, setShowExpertList] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchConversations();
      fetchExperts();
    }
  }, [session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket || !selectedConversation) return;

    // Listen for new messages - for BOTH sender and receiver
    const handleNewMessage = (message: Message) => {
      console.log("📨 New message received:", message);

      // Only add if it's for the current conversation
      if (message.conversationId === selectedConversation.id) {
        setMessages((prev) => {
          // Check if message already exists to prevent duplicates
          const exists = prev.some((m) => m.id === message.id);
          if (exists) return prev;
          return [...prev, message];
        });

        // Show notification only if not from current user
        if (message.sender.id !== session?.user?.id) {
          playNotificationSound();
          toast({
            title: `New message from ${message.sender.name}`,
            description: message.content.substring(0, 50),
          });
        }
      }
    };

    socket.on("new_message", handleNewMessage);

    // Listen for typing indicators
    socket.on("user_typing", ({ userId, isTyping: typing }) => {
      console.log("⌨️ User typing:", userId, typing);
      if (userId !== session?.user?.id) {
        setIsTyping(typing);
      }
    });

    // Listen for user status changes
    socket.on("user_status_changed", ({ userId, isOnline }) => {
      console.log("👤 User status changed:", userId, isOnline);
      // Update conversations list with online status
      setConversations((prev) =>
        prev.map((conv) => ({
          ...conv,
          participants: conv.participants.map((p) =>
            p.user.id === userId ? { ...p, user: { ...p.user, isOnline } } : p
          ),
        }))
      );
    });

    // Listen for messages read receipts
    socket.on("messages_read", ({ conversationId, userId }) => {
      console.log("✅ Messages read:", conversationId, userId);
      if (selectedConversation?.id === conversationId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.readReceipts?.some((r: any) => r.userId === userId)
              ? msg
              : {
                  ...msg,
                  readReceipts: [
                    ...(msg.readReceipts || []),
                    { userId, readAt: new Date().toISOString() },
                  ],
                }
          )
        );
      }
    });

    // Listen for notifications
    socket.on("notification", ({ type, conversationId, message }) => {
      console.log("🔔 Notification:", type, conversationId);
      playNotificationSound();
      toast({
        title: "New Message",
        description: message.content.substring(0, 50),
      });
    });

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("user_typing");
      socket.off("user_status_changed");
      socket.off("messages_read");
      socket.off("notification");
    };
  }, [socket, selectedConversation, session, toast]);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/chat/conversations");
      setConversations(response.data.conversations);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load conversations",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExperts = async () => {
    try {
      const response = await axios.get("/api/chat/experts");
      setExperts(response.data.experts);
    } catch (error) {
      console.error("Failed to fetch experts:", error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/chat/conversations/${conversationId}/messages`
      );
      setMessages(response.data.messages);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load messages",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
    if (socket && session?.user?.id) {
      socket.emit("join_conversation", {
        conversationId: conversation.id,
        userId: session.user.id,
      });
    }
  };

  const startNewConversation = async (expertId: string) => {
    try {
      const response = await axios.post("/api/chat/conversations", {
        participantId: expertId,
      });
      const newConversation = response.data.conversation;
      setConversations((prev) => [newConversation, ...prev]);
      selectConversation(newConversation);
      setShowExpertList(false);
      toast({
        title: "Chat started!",
        description: "You can now chat with the expert",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start conversation",
      });
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || isSending) return;

    const otherParticipant = selectedConversation.participants.find(
      (p) => p.user.id !== session?.user?.id
    );
    if (!otherParticipant) return;

    const tempMessage = messageInput;
    setMessageInput(""); // Clear input immediately for better UX

    try {
      setIsSending(true);

      // Emit via Socket.IO for real-time delivery
      if (socket && isConnected) {
        socket.emit("send_message", {
          conversationId: selectedConversation.id,
          senderId: session?.user?.id,
          receiverId: otherParticipant.user.id,
          content: tempMessage,
          messageType: "TEXT",
        });
      }

      // Also save to database via API (fallback if socket fails)
      const response = await axios.post(
        `/api/chat/conversations/${selectedConversation.id}/messages`,
        {
          content: tempMessage,
          receiverId: otherParticipant.user.id,
        }
      );

      // Don't add to messages here - let the socket listener handle it
      // This prevents duplicate messages
    } catch (error) {
      // Restore message on error
      setMessageInput(tempMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !selectedConversation) return;

    const otherParticipant = selectedConversation.participants.find(
      (p) => p.user.id !== session?.user?.id
    );
    if (!otherParticipant) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("receiverId", otherParticipant.user.id);

      const response = await axios.post(
        `/api/chat/conversations/${selectedConversation.id}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const newMessage = response.data.message;
      setMessages((prev) => [...prev, newMessage]);

      // Socket.IO will broadcast automatically from server

      toast({
        title: "File uploaded!",
        description: `${file.name} was sent successfully`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload file",
      });
    }
  };

  const handleTyping = () => {
    if (socket && selectedConversation) {
      socket.emit("typing", {
        conversationId: selectedConversation.id,
        userId: session?.user?.id,
        isTyping: true,
      });

      setTimeout(() => {
        socket.emit("typing", {
          conversationId: selectedConversation.id,
          userId: session?.user?.id,
          isTyping: false,
        });
      }, 2000);
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification.mp3");
    audio.play().catch(() => {});
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(
      (p) => p.user.id !== session?.user?.id
    )?.user;
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full md:w-96 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              Messages
            </h2>
            <Button
              onClick={() => setShowExpertList(!showExpertList)}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Users className="w-4 h-4 mr-2" />
              New
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-gray-600 dark:text-gray-400">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        {showExpertList && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Select an Expert
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {experts.map((expert) => (
                <button
                  key={expert.id}
                  onClick={() => startNewConversation(expert.id)}
                  className="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Avatar>
                    <AvatarImage src={expert.image} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {expert.name?.[0] || "E"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {expert.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {expert.email}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30">
                    Expert
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {isLoading && conversations.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No conversations yet
              </p>
              <Button
                onClick={() => setShowExpertList(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Start Your First Chat
              </Button>
            </div>
          ) : (
            conversations.map((conversation) => {
              const other = getOtherParticipant(conversation);
              const lastMessage = conversation.messages[0];

              return (
                <button
                  key={conversation.id}
                  onClick={() => selectConversation(conversation)}
                  className={`w-full p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={other?.image} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {other?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left overflow-hidden">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {other?.name || "Unknown User"}
                        </p>
                        {lastMessage && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(lastMessage.createdAt), "p")}
                          </span>
                        )}
                      </div>
                      {lastMessage && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={getOtherParticipant(selectedConversation)?.image}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {getOtherParticipant(selectedConversation)?.name?.[0] ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {getOtherParticipant(selectedConversation)?.name ||
                      "Unknown User"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isTyping ? (
                      <span className="text-blue-600 dark:text-blue-400">
                        Typing...
                      </span>
                    ) : (
                      "Online"
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      isConnected
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isConnected
                          ? "bg-green-500 animate-pulse"
                          : "bg-red-500"
                      }`}
                    ></div>
                    {isConnected ? "Connected" : "Disconnected"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((message) => {
                const isOwn = message.sender.id === session?.user?.id;
                const isSystem = message.messageType === "SYSTEM";

                if (isSystem) {
                  return (
                    <div key={message.id} className="flex justify-center my-6">
                      <div className="bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-full max-w-2xl">
                        <p className="text-sm text-blue-900 dark:text-blue-200 text-center">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isOwn ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-md ${
                        isOwn
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                      } rounded-2xl p-4 shadow-sm`}
                    >
                      {message.attachments.length > 0 && (
                        <div className="mb-2 space-y-2">
                          {message.attachments.map((attachment) => {
                            const isImage =
                              attachment.fileType.startsWith("image/");
                            return (
                              <div
                                key={attachment.id}
                                className="bg-white/10 dark:bg-black/20 rounded-lg p-2"
                              >
                                {isImage ? (
                                  <img
                                    src={attachment.fileUrl}
                                    alt={attachment.fileName}
                                    className="rounded-lg max-w-full h-auto max-h-64 object-cover"
                                  />
                                ) : (
                                  <a
                                    href={attachment.fileUrl}
                                    download
                                    className="flex items-center gap-2 hover:underline"
                                  >
                                    <FileText className="w-4 h-4" />
                                    <span className="text-sm">
                                      {attachment.fileName}
                                    </span>
                                    <Download className="w-4 h-4 ml-auto" />
                                  </a>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <p className="text-sm break-words">{message.content}</p>

                      <p
                        className={`text-xs mt-1 ${
                          isOwn ? "text-white/70" : "text-gray-500"
                        }`}
                      >
                        {format(new Date(message.createdAt), "p")}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-end gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.zip"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0"
                  >
                    <Paperclip className="w-5 h-5" />
                  </Button>
                </label>

                <Input
                  value={messageInput}
                  onChange={(e) => {
                    setMessageInput(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1"
                />

                <Button
                  onClick={sendMessage}
                  disabled={!messageInput.trim() || isSending}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0"
                >
                  {isSending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <MessageSquare className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Chat
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
              Select a conversation from the sidebar to start chatting, or
              create a new conversation with an expert.
            </p>
            <Button
              onClick={() => setShowExpertList(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Users className="w-4 h-4 mr-2" />
              Start New Chat
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
