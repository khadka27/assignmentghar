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

interface ChatListItem {
  user: User;
  conversation: Conversation | null;
  lastMessage: Message | null;
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

  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const userRole = session?.user?.role;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchChatList();
    }
  }, [session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket || !selectedChat?.conversation) return;

    // Listen for new messages - for BOTH sender and receiver
    const handleNewMessage = (message: Message) => {
      console.log("📨 New message received:", message);

      // Only add if it's for the current conversation
      if (message.conversationId === selectedChat.conversation!.id) {
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
      // Update chat list with online status
      setChatList((prev) =>
        prev.map((chat) =>
          chat.user.id === userId
            ? { ...chat, user: { ...chat.user, isOnline } }
            : chat
        )
      );
    });

    // Listen for messages read receipts
    socket.on("messages_read", ({ conversationId, userId }) => {
      console.log("✅ Messages read:", conversationId, userId);
      if (selectedChat.conversation?.id === conversationId) {
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
  }, [socket, selectedChat, session, toast]);

  const fetchChatList = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/chat/list");
      setChatList(response.data.chatList);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load chat list",
      });
    } finally {
      setIsLoading(false);
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

  const selectChat = async (chatItem: ChatListItem) => {
    // If conversation exists, load it
    if (chatItem.conversation) {
      setSelectedChat(chatItem);
      fetchMessages(chatItem.conversation.id);
      if (socket && session?.user?.id) {
        socket.emit("join_conversation", {
          conversationId: chatItem.conversation.id,
          userId: session.user.id,
        });
      }
    } else {
      // Create new conversation
      await startNewConversation(chatItem.user.id, chatItem);
    }
  };

  const startNewConversation = async (
    userId: string,
    chatItem: ChatListItem
  ) => {
    try {
      console.log("Starting conversation with user:", userId);
      if (!userId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid user selected",
        });
        return;
      }

      const response = await axios.post("/api/chat/conversations", {
        participantId: userId,
      });
      const newConversation = response.data.conversation;

      // Update the chat item with the new conversation
      const updatedChatItem = {
        ...chatItem,
        conversation: newConversation,
      };

      setChatList((prev) =>
        prev.map((item) => (item.user.id === userId ? updatedChatItem : item))
      );

      setSelectedChat(updatedChatItem);
      fetchMessages(newConversation.id);

      if (socket && session?.user?.id) {
        socket.emit("join_conversation", {
          conversationId: newConversation.id,
          userId: session.user.id,
        });
      }
    } catch (error: any) {
      console.error("Failed to start conversation:", error);
      console.error("Error response:", error.response?.data);
      const errorData = error.response?.data;
      const errorMessage = errorData?.error || "Failed to start conversation";
      const errorDetails = errorData?.details || "";

      toast({
        variant: "destructive",
        title: "Error",
        description: errorDetails
          ? `${errorMessage}: ${errorDetails}`
          : errorMessage,
      });
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedChat?.conversation || isSending)
      return;

    const tempMessage = messageInput;
    setMessageInput(""); // Clear input immediately for better UX

    try {
      setIsSending(true);

      // Emit via Socket.IO for real-time delivery
      if (socket && isConnected) {
        socket.emit("send_message", {
          conversationId: selectedChat.conversation.id,
          senderId: session?.user?.id,
          receiverId: selectedChat.user.id,
          content: tempMessage,
          messageType: "TEXT",
        });
      }

      // Also save to database via API (fallback if socket fails)
      await axios.post(
        `/api/chat/conversations/${selectedChat.conversation.id}/messages`,
        {
          content: tempMessage,
          receiverId: selectedChat.user.id,
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
    if (!file || !selectedChat?.conversation) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("receiverId", selectedChat.user.id);

      const response = await axios.post(
        `/api/chat/conversations/${selectedChat.conversation.id}/upload`,
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
    if (socket && selectedChat?.conversation) {
      socket.emit("typing", {
        conversationId: selectedChat.conversation.id,
        userId: session?.user?.id,
        isTyping: true,
      });

      setTimeout(() => {
        socket.emit("typing", {
          conversationId: selectedChat.conversation!.id,
          userId: session?.user?.id,
          isTyping: false,
        });
      }, 2000);
    }
  };

  const playNotificationSound = () => {
    try {
      // Use the existing notification.wav file
      const audio = new Audio("/sounds/notification.wav");
      audio.volume = 0.5; // Set volume to 50% for better UX
      audio.play().catch((error) => {
        // Browser may block autoplay, this is expected behavior
        console.log("Notification sound blocked:", error.message);
      });
    } catch (error) {
      // Silent fail if audio not available
      console.log("Audio not available");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-black">
      <div className="w-full md:w-96 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              Messages
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-blue-600" : "bg-gray-400"
              }`}
            ></div>
            <span className="text-gray-500 dark:text-gray-400">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading && chatList.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          ) : chatList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userRole === "ADMIN"
                  ? "No students available"
                  : "No admins available"}
              </p>
            </div>
          ) : (
            chatList.map((chatItem) => {
              const lastMessage = chatItem.lastMessage;
              const isSelected = selectedChat?.user.id === chatItem.user.id;

              return (
                <button
                  key={chatItem.user.id}
                  onClick={() => selectChat(chatItem)}
                  className={`w-full p-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${
                    isSelected
                      ? "bg-gray-50 dark:bg-gray-900 border-l-2 border-l-blue-600"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={chatItem.user.image} />
                      <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                        {chatItem.user.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left overflow-hidden">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                          {chatItem.user.name}
                        </p>
                        {lastMessage && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(lastMessage.createdAt), "p")}
                          </span>
                        )}
                      </div>
                      {lastMessage ? (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {lastMessage.content}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Click to start chatting
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

      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-950">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedChat.user.image} />
                  <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                    {selectedChat.user.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                    {selectedChat.user.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isTyping ? (
                      <span className="text-blue-600 dark:text-blue-500">
                        Typing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            isConnected ? "bg-blue-600" : "bg-gray-400"
                          }`}
                        ></div>
                        {isConnected ? "Online" : "Offline"}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-950">
              {messages.map((message) => {
                const isOwn = message.sender.id === session?.user?.id;
                const isSystem = message.messageType === "SYSTEM";

                if (isSystem) {
                  return (
                    <div key={message.id} className="flex justify-center my-4">
                      <div className="bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
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
                          ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800"
                      } rounded-lg p-3`}
                    >
                      {message.attachments.length > 0 && (
                        <div className="mb-2 space-y-2">
                          {message.attachments.map((attachment) => {
                            const isImage =
                              attachment.fileType.startsWith("image/");
                            return (
                              <div
                                key={attachment.id}
                                className={`${
                                  isOwn
                                    ? "bg-blue-700"
                                    : "bg-gray-100 dark:bg-gray-800"
                                } rounded-lg p-2`}
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
                                    className="flex items-center gap-2 hover:underline text-xs"
                                  >
                                    <FileText className="w-4 h-4" />
                                    <span className="truncate">
                                      {attachment.fileName}
                                    </span>
                                    <Download className="w-3 h-3 ml-auto flex-shrink-0" />
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
                          isOwn
                            ? "text-blue-100"
                            : "text-gray-500 dark:text-gray-400"
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

            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
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
                    className="flex-shrink-0 h-11 w-11 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
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
                  className="flex-1 h-11 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />

                <Button
                  onClick={sendMessage}
                  disabled={!messageInput.trim() || isSending}
                  className="bg-blue-600 hover:bg-blue-700 flex-shrink-0 h-11 w-11 p-0"
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
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-black">
            <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Chat
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
              Select {userRole === "ADMIN" ? "a student" : "an admin"} from the
              sidebar to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
