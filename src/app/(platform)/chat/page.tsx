"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useSocket } from "@/contexts/socket-context";
import {
  Send,
  Paperclip,
  FileText,
  Download,
  MessageSquare,
  Loader2,
  CheckCheck,
  Menu,
  X,
  Video,
  UserPlus,
  Heart,
  Search,
  Mic,
  Image as ImageIcon,
  Music,
  Smile,
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
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
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
      setShowMobileSidebar(false); // Hide sidebar on mobile after selection
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
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#0A0F1E]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0E52AC]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden transition-colors bg-[#F8FBFF] dark:bg-[#1E293B]">
      {/* Sticky Top Navbar - Only on Mobile */}
      <div className="lg:hidden sticky top-0 z-30 px-4 py-3 border-b flex items-center justify-between bg-white dark:bg-[#0A0F1E] border-[#E0EDFD] dark:border-[#475569]">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="text-[#111E2F] dark:text-white"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-[#111E2F] dark:text-white">
            Chat
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-[#0E52AC]" : "bg-[#64748B] dark:bg-[#94A3B8]"
            }`}
          ></div>
          <span className="text-[#64748B] dark:text-[#94A3B8]">
            {isConnected ? "Connected" : "Offline"}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay Backdrop */}
        {showMobileSidebar && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowMobileSidebar(false)}
          ></div>
        )}

        {/* Chat List Sidebar */}
        <div
          className={`${
            showMobileSidebar ? "fixed inset-y-0 left-0 z-50 w-80" : "hidden"
          } lg:flex lg:relative lg:w-96 border-r flex-col transition-all shadow-2xl lg:shadow-none bg-white dark:bg-[#0A0F1E] border-[#E0EDFD] dark:border-[#475569]`}
        >
          {/* Sidebar Header */}
          <div className="p-4 md:p-6 border-b flex items-center justify-between flex-shrink-0 border-[#E0EDFD] dark:border-[#475569]">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 transition-colors text-[#111E2F] dark:text-white">
                  <MessageSquare className="w-5 h-5 text-[#0E52AC]" />
                  Messages
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileSidebar(false)}
                  className="lg:hidden text-[#111E2F] dark:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <div
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isConnected
                      ? "bg-[#0E52AC]"
                      : "bg-[#64748B] dark:bg-[#94A3B8]"
                  }`}
                ></div>
                <span className="transition-colors text-[#64748B] dark:text-[#94A3B8]">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable Chat List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading && chatList.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-5 h-5 animate-spin text-[#0E52AC]" />
              </div>
            ) : chatList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 md:p-8 text-center">
                <MessageSquare className="w-12 h-12 mb-3 transition-colors text-[#E0EDFD] dark:text-[#475569]" />
                <p className="text-sm transition-colors text-[#64748B] dark:text-[#94A3B8]">
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
                    className={`w-full p-3 md:p-4 border-b transition-all hover:opacity-90 ${
                      isSelected
                        ? "border-l-4 bg-[#F8FBFF] dark:bg-[#1E293B] border-l-[#0E52AC]"
                        : "bg-transparent"
                    } border-[#E0EDFD] dark:border-[#475569]`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10 md:w-12 md:h-12">
                          <AvatarImage src={chatItem.user.image} />
                          <AvatarFallback className="text-white text-sm font-medium bg-[#0E52AC]">
                            {chatItem.user.name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        {isConnected && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 bg-[#0E52AC] border-white dark:border-[#0A0F1E]"></div>
                        )}
                      </div>
                      <div className="flex-1 text-left overflow-hidden">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold truncate text-sm md:text-base transition-colors text-[#111E2F] dark:text-white">
                            {chatItem.user.name}
                          </p>
                          {lastMessage && (
                            <span className="text-xs transition-colors text-[#64748B] dark:text-[#94A3B8]">
                              {format(new Date(lastMessage.createdAt), "p")}
                            </span>
                          )}
                        </div>
                        {lastMessage ? (
                          <p className="text-xs truncate transition-colors text-[#64748B] dark:text-[#94A3B8]">
                            {lastMessage.content}
                          </p>
                        ) : (
                          <p className="text-xs transition-colors text-[#64748B] dark:text-[#94A3B8]">
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

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FBFF] dark:bg-[#1E293B]">
          {selectedChat ? (
            <>
              {/* Chat Header - Fixed */}
              <div className="flex-shrink-0 px-4 py-2 border-b flex items-center justify-between bg-white dark:bg-[#0A0F1E] border-[#E0EDFD] dark:border-[#475569]">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={selectedChat.user.image} />
                    <AvatarFallback className="text-white text-sm font-medium bg-[#0E52AC]">
                      {selectedChat.user.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-base transition-colors text-[#111E2F] dark:text-white">
                      {selectedChat.user.name}
                    </h3>
                    <p className="text-xs transition-colors flex items-center gap-1.5 text-[#64748B] dark:text-[#94A3B8]">
                      {isTyping ? (
                        <span className="text-[#0E52AC]">Typing...</span>
                      ) : (
                        <>
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              isConnected
                                ? "bg-[#22C55E]"
                                : "bg-[#64748B] dark:bg-[#94A3B8]"
                            }`}
                          ></div>
                          {isConnected ? "Online" : "Offline"}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex text-[#284366] dark:text-[#CBD5E1]"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex text-[#284366] dark:text-[#CBD5E1]"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages Area - Scrollable ONLY */}
              <div
                className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
                style={{ minHeight: 0 }}
              >
                {messages.map((message) => {
                  const isOwn = message.sender.id === session?.user?.id;
                  const isSystem = message.messageType === "SYSTEM";

                  if (isSystem) {
                    return (
                      <div
                        key={message.id}
                        className="flex justify-center my-4"
                      >
                        <div className="px-4 py-2 rounded-full bg-[#E0EDFD] dark:bg-[#475569]">
                          <p className="text-xs transition-colors text-[#64748B] dark:text-[#94A3B8]">
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
                        className={`max-w-[70%] rounded-2xl px-3 py-2 shadow-sm ${
                          isOwn
                            ? "rounded-br-md bg-[#0E52AC] text-white"
                            : "rounded-bl-md bg-white dark:bg-[#334155] text-[#111E2F] dark:text-white border border-[#E0EDFD] dark:border-[#475569]"
                        }`}
                      >
                        {message.attachments.length > 0 && (
                          <div className="mb-3 space-y-2">
                            {message.attachments.map((attachment) => {
                              const isImage =
                                attachment.fileType.startsWith("image/");
                              return (
                                <div
                                  key={attachment.id}
                                  className={`rounded-lg overflow-hidden ${
                                    isOwn
                                      ? "bg-white/10"
                                      : "bg-[#F8FBFF] dark:bg-[#1E293B]"
                                  }`}
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
                                      className="flex items-center gap-2 p-2 hover:opacity-80 transition-opacity text-xs"
                                    >
                                      <FileText className="w-4 h-4 flex-shrink-0" />
                                      <span className="truncate flex-1">
                                        {attachment.fileName}
                                      </span>
                                      <Download className="w-3 h-3 flex-shrink-0" />
                                    </a>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <p className="text-sm break-words leading-relaxed">
                          {message.content}
                        </p>

                        <div className="flex items-center justify-between gap-2 mt-1">
                          <p
                            className={`text-xs ${
                              isOwn
                                ? "text-white/70"
                                : "text-[#64748B] dark:text-[#94A3B8]"
                            }`}
                          >
                            {format(new Date(message.createdAt), "p")}
                          </p>
                          {isOwn &&
                            message.readReceipts &&
                            message.readReceipts.length > 0 && (
                              <CheckCheck className="w-3.5 h-3.5 text-white/70" />
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input - Fixed at Bottom */}
              <div className="flex-shrink-0 px-4 py-2 border-t bg-white dark:bg-[#0A0F1E] border-[#E0EDFD] dark:border-[#475569]">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                  >
                    <Mic className="w-5 h-5" />
                  </Button>

                  <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-full border bg-[#F8FBFF] dark:bg-[#0F172A] border-[#E0EDFD] dark:border-[#475569]">
                    <Input
                      value={messageInput}
                      onChange={(e) => {
                        setMessageInput(e.target.value);
                        handleTyping();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Write Something..."
                      className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-9 text-sm text-[#111E2F] dark:text-white"
                    />
                    <div className="flex items-center gap-1">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          accept="image/*,.pdf,.doc,.docx,.zip"
                        />
                        <button
                          type="button"
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Paperclip className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
                        </button>
                      </label>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <ImageIcon className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Smile className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={sendMessage}
                    disabled={!messageInput.trim() || isSending}
                    className="flex-shrink-0 w-9 h-9 p-0 rounded-full transition-all hover:opacity-90 disabled:opacity-50 bg-[#0E52AC]"
                  >
                    {isSending ? (
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                    ) : (
                      <Send className="w-5 h-5 text-white" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 text-center">
              <div className="rounded-full p-6 mb-4 bg-white dark:bg-[#0A0F1E]">
                <MessageSquare className="w-16 h-16 md:w-20 md:h-20 text-[#0E52AC]" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 transition-colors text-[#111E2F] dark:text-white">
                Welcome to Chat
              </h3>
              <p className="text-sm md:text-base max-w-md transition-colors text-[#64748B] dark:text-[#94A3B8]">
                Select {userRole === "ADMIN" ? "a student" : "an admin"} from
                the sidebar to start chatting
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Profile & Actions (Desktop Only) */}
        {selectedChat && (
          <div className="hidden xl:flex w-80 border-l flex-col bg-white dark:bg-[#0A0F1E] border-[#E0EDFD] dark:border-[#475569]">
            {/* Profile Section */}
            <div className="p-6 border-b text-center border-[#E0EDFD] dark:border-[#475569]">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={selectedChat.user.image} />
                <AvatarFallback className="text-white text-2xl font-medium bg-[#0E52AC]">
                  {selectedChat.user.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-bold mb-1 text-[#111E2F] dark:text-white">
                {selectedChat.user.name}
              </h3>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                {selectedChat.user.role === "ADMIN" ? "Admin" : "Student"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-b border-[#E0EDFD] dark:border-[#475569]">
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center gap-2 p-4 rounded-lg transition-colors hover:opacity-80 bg-[#F8FBFF] dark:bg-[#1E293B]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#0E52AC]">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-[#111E2F] dark:text-white">
                    Chat
                  </span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 rounded-lg transition-colors hover:opacity-80 bg-[#F8FBFF] dark:bg-[#1E293B]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#0E52AC]">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-[#111E2F] dark:text-white">
                    Video Call
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 border-b border-[#E0EDFD] dark:border-[#475569]">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors hover:opacity-80 mb-2 bg-[#F8FBFF] dark:bg-[#1E293B]">
                <UserPlus className="w-5 h-5 text-[#0E52AC]" />
                <span className="text-sm font-medium text-[#111E2F] dark:text-white">
                  View Friends
                </span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors hover:opacity-80 bg-[#F8FBFF] dark:bg-[#1E293B]">
                <Heart className="w-5 h-5 text-[#0E52AC]" />
                <span className="text-sm font-medium text-[#111E2F] dark:text-white">
                  Add to Favorites
                </span>
              </button>
            </div>

            {/* Attachments */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h4 className="font-semibold mb-4 text-[#111E2F] dark:text-white">
                Attachments
              </h4>
              <div className="grid grid-cols-4 gap-3">
                <button className="flex flex-col items-center gap-2 p-3 rounded-lg transition-colors hover:opacity-80 bg-[#F8FBFF] dark:bg-[#1E293B]">
                  <FileText className="w-6 h-6 text-red-600" />
                  <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    PDF
                  </span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 rounded-lg transition-colors hover:opacity-80 bg-[#F8FBFF] dark:bg-[#1E293B]">
                  <Video className="w-6 h-6 text-blue-600" />
                  <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    VIDEO
                  </span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 rounded-lg transition-colors hover:opacity-80 bg-[#F8FBFF] dark:bg-[#1E293B]">
                  <Music className="w-6 h-6 text-purple-600" />
                  <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    MP3
                  </span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 rounded-lg transition-colors hover:opacity-80 bg-[#F8FBFF] dark:bg-[#1E293B]">
                  <ImageIcon className="w-6 h-6 text-green-600" />
                  <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    IMAGE
                  </span>
                </button>
              </div>
              <button className="w-full mt-4 py-2 px-4 rounded-full border text-sm font-medium transition-colors hover:opacity-80 border-[#E0EDFD] dark:border-[#475569] text-[#0E52AC]">
                View All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
