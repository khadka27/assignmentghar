"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useTheme } from "@/hooks/use-theme";
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

export default function AdminChatWithStudentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { socket, isConnected } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Brand colors
  const themeColors = {
    primary: "#0E52AC",
    primaryHover: "#0A3D7F",
    text1: isDark ? "#FFFFFF" : "#111E2F",
    text2: isDark ? "#CBD5E1" : "#284366",
    text3: isDark ? "#94A3B8" : "#64748B",
    bg1: isDark ? "#0A0F1E" : "#FFFFFF",
    bg2: isDark ? "#1E293B" : "#F8FBFF",
    cardBg: isDark ? "#1E293B" : "#FFFFFF",
    border: isDark ? "#475569" : "#E0EDFD",
    inputBg: isDark ? "#0F172A" : "#F8FBFF",
    messageBg: isDark ? "#334155" : "#FFFFFF",
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.id && session?.user?.role === "ADMIN") {
      fetchChatList();
    }
  }, [session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket || !selectedChat?.conversation) return;

    const handleNewMessage = (message: Message) => {
      if (message.conversationId === selectedChat.conversation!.id) {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === message.id);
          if (exists) return prev;
          return [...prev, message];
        });

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

    socket.on("user_typing", ({ userId, isTyping: typing }) => {
      if (userId !== session?.user?.id) {
        setIsTyping(typing);
      }
    });

    socket.on("user_status_changed", ({ userId, isOnline }) => {
      setChatList((prev) =>
        prev.map((chat) =>
          chat.user.id === userId
            ? { ...chat, user: { ...chat.user, isOnline } }
            : chat
        )
      );
    });

    socket.on("messages_read", ({ conversationId, userId }) => {
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

    socket.on("notification", ({ type, conversationId, message }) => {
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
      console.log("Starting conversation with student:", userId);
      if (!userId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid student selected",
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
    setMessageInput("");

    try {
      setIsSending(true);

      if (socket && isConnected) {
        socket.emit("send_message", {
          conversationId: selectedChat.conversation.id,
          senderId: session?.user?.id,
          receiverId: selectedChat.user.id,
          content: tempMessage,
          messageType: "TEXT",
        });
      }

      await axios.post(
        `/api/chat/conversations/${selectedChat.conversation.id}/messages`,
        {
          content: tempMessage,
          receiverId: selectedChat.user.id,
        }
      );
    } catch (error) {
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
      const audio = new Audio("/sounds/notification.wav");
      audio.volume = 0.5;
      audio.play().catch((error) => {
        console.log("Notification sound blocked:", error.message);
      });
    } catch (error) {
      console.log("Audio not available");
    }
  };

  if (status === "loading") {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: themeColors.bg1 }}
      >
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: themeColors.primary }}
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-screen overflow-hidden transition-colors"
      style={{ backgroundColor: themeColors.bg2 }}
    >
      {/* Sticky Top Navbar - Only on Mobile */}
      <div
        className="lg:hidden sticky top-0 z-30 px-4 py-3 border-b flex items-center justify-between"
        style={{
          backgroundColor: themeColors.bg1,
          borderColor: themeColors.border,
        }}
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            style={{ color: themeColors.text1 }}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1
            className="text-lg font-bold"
            style={{ color: themeColors.text1 }}
          >
            Admin Chat
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: isConnected
                ? themeColors.primary
                : themeColors.text3,
            }}
          ></div>
          <span style={{ color: themeColors.text3 }}>
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
          } lg:flex lg:relative lg:w-96 border-r flex-col transition-all shadow-2xl lg:shadow-none`}
          style={{
            backgroundColor: themeColors.bg1,
            borderColor: themeColors.border,
          }}
        >
          {/* Sidebar Header */}
          <div
            className="p-4 md:p-6 border-b flex items-center justify-between flex-shrink-0"
            style={{ borderColor: themeColors.border }}
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-lg md:text-xl font-bold flex items-center gap-2 transition-colors"
                  style={{ color: themeColors.text1 }}
                >
                  <MessageSquare
                    className="w-5 h-5"
                    style={{ color: themeColors.primary }}
                  />
                  Students
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileSidebar(false)}
                  className="lg:hidden"
                  style={{ color: themeColors.text1 }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <div
                  className={`w-2 h-2 rounded-full transition-colors`}
                  style={{
                    backgroundColor: isConnected
                      ? themeColors.primary
                      : themeColors.text3,
                  }}
                ></div>
                <span
                  className="transition-colors"
                  style={{ color: themeColors.text3 }}
                >
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable Chat List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading && chatList.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <Loader2
                  className="w-5 h-5 animate-spin"
                  style={{ color: themeColors.primary }}
                />
              </div>
            ) : chatList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 md:p-8 text-center">
                <MessageSquare
                  className="w-12 h-12 mb-3 transition-colors"
                  style={{ color: themeColors.border }}
                />
                <p
                  className="text-sm transition-colors"
                  style={{ color: themeColors.text3 }}
                >
                  No students available
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
                      isSelected ? "border-l-4" : ""
                    }`}
                    style={{
                      backgroundColor: isSelected
                        ? themeColors.bg2
                        : "transparent",
                      borderColor: themeColors.border,
                      borderLeftColor: isSelected
                        ? themeColors.primary
                        : "transparent",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10 md:w-12 md:h-12">
                          <AvatarImage src={chatItem.user.image} />
                          <AvatarFallback
                            className="text-white text-sm font-medium"
                            style={{ backgroundColor: themeColors.primary }}
                          >
                            {chatItem.user.name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        {isConnected && (
                          <div
                            className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                            style={{
                              backgroundColor: themeColors.primary,
                              borderColor: themeColors.bg1,
                            }}
                          ></div>
                        )}
                      </div>
                      <div className="flex-1 text-left overflow-hidden">
                        <div className="flex items-center justify-between mb-1">
                          <p
                            className="font-semibold truncate text-sm md:text-base transition-colors"
                            style={{ color: themeColors.text1 }}
                          >
                            {chatItem.user.name}
                          </p>
                          {lastMessage && (
                            <span
                              className="text-xs transition-colors"
                              style={{ color: themeColors.text3 }}
                            >
                              {format(new Date(lastMessage.createdAt), "p")}
                            </span>
                          )}
                        </div>
                        {lastMessage ? (
                          <p
                            className="text-xs truncate transition-colors"
                            style={{ color: themeColors.text3 }}
                          >
                            {lastMessage.content}
                          </p>
                        ) : (
                          <p
                            className="text-xs transition-colors"
                            style={{ color: themeColors.text3 }}
                          >
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
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{ backgroundColor: themeColors.bg2 }}
        >
          {selectedChat ? (
            <>
              {/* Chat Header - Fixed */}
              <div
                className="flex-shrink-0 p-2 border-b flex items-center gap-2"
                style={{
                  backgroundColor: themeColors.bg1,
                  borderColor: themeColors.border,
                }}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={selectedChat.user.image} />
                  <AvatarFallback
                    className="text-white text-sm font-medium"
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    {selectedChat.user.name?.[0] || "S"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3
                    className="font-semibold text-sm md:text-base transition-colors"
                    style={{ color: themeColors.text1 }}
                  >
                    {selectedChat.user.name}
                  </h3>
                  <p
                    className="text-xs transition-colors"
                    style={{ color: themeColors.text3 }}
                  >
                    {isTyping ? (
                      <span style={{ color: themeColors.primary }}>
                        Typing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <div
                          className={`w-1.5 h-1.5 rounded-full`}
                          style={{
                            backgroundColor: isConnected
                              ? themeColors.primary
                              : themeColors.text3,
                          }}
                        ></div>
                        {isConnected ? "Online" : "Offline"}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Messages Area - Scrollable with flex-1 */}
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
                        <div
                          className="px-4 py-2 rounded-full"
                          style={{ backgroundColor: themeColors.border }}
                        >
                          <p
                            className="text-xs transition-colors"
                            style={{ color: themeColors.text3 }}
                          >
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
                      } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-md rounded-2xl p-2 md:p-3 shadow-sm ${
                          isOwn ? "rounded-br-sm" : "rounded-bl-sm"
                        }`}
                        style={{
                          backgroundColor: isOwn
                            ? themeColors.primary
                            : themeColors.messageBg,
                          color: isOwn ? "#FFFFFF" : themeColors.text1,
                          border: isOwn
                            ? "none"
                            : `1px solid ${themeColors.border}`,
                        }}
                      >
                        {message.attachments.length > 0 && (
                          <div className="mb-3 space-y-2">
                            {message.attachments.map((attachment) => {
                              const isImage =
                                attachment.fileType.startsWith("image/");
                              return (
                                <div
                                  key={attachment.id}
                                  className="rounded-lg overflow-hidden"
                                  style={{
                                    backgroundColor: isOwn
                                      ? "rgba(255,255,255,0.1)"
                                      : themeColors.bg2,
                                  }}
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

                        <p className="text-sm md:text-base break-words leading-relaxed">
                          {message.content}
                        </p>

                        <div className="flex items-center justify-end gap-1 mt-2">
                          <p
                            className="text-xs"
                            style={{
                              color: isOwn
                                ? "rgba(255,255,255,0.8)"
                                : themeColors.text3,
                            }}
                          >
                            {format(new Date(message.createdAt), "p")}
                          </p>
                          {isOwn &&
                            message.readReceipts &&
                            message.readReceipts.length > 0 && (
                              <CheckCheck
                                className="w-3 h-3"
                                style={{ color: "rgba(255,255,255,0.8)" }}
                              />
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input - Fixed at Bottom */}
              <div
                className="flex-shrink-0 p-2 border-t"
                style={{
                  backgroundColor: themeColors.bg1,
                  borderColor: themeColors.border,
                }}
              >
                <div className="flex items-end gap-2 md:gap-2">
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
                      className="flex-shrink-0 h-9 w-9 md:h-9 md:w-9 border transition-all hover:opacity-80"
                      style={{
                        borderColor: themeColors.border,
                        backgroundColor: themeColors.inputBg,
                        color: themeColors.text2,
                      }}
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 h-9 rounded-xl border transition-all focus:ring-2"
                    style={{
                      backgroundColor: themeColors.inputBg,
                      borderColor: themeColors.border,
                      color: themeColors.text1,
                    }}
                  />

                  <Button
                    onClick={sendMessage}
                    disabled={!messageInput.trim() || isSending}
                    className="flex-shrink-0 h-9 w-9 p-0 rounded-xl transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: themeColors.primary }}
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
              <div
                className="rounded-full p-6 mb-4"
                style={{ backgroundColor: themeColors.bg1 }}
              >
                <MessageSquare
                  className="w-16 h-16 md:w-20 md:h-20"
                  style={{ color: themeColors.primary }}
                />
              </div>
              <h3
                className="text-xl md:text-2xl font-bold mb-2 transition-colors"
                style={{ color: themeColors.text1 }}
              >
                Select a Student to Chat
              </h3>
              <p
                className="text-sm md:text-base max-w-md transition-colors"
                style={{ color: themeColors.text3 }}
              >
                Click on any student from the sidebar to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
