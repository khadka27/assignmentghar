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
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

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

  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

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

  const startNewConversation = async (userId: string, chatItem: ChatListItem) => {
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
        prev.map((item) =>
          item.user.id === userId ? updatedChatItem : item
        )
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
    if (!messageInput.trim() || !selectedChat?.conversation || isSending) return;

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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Chat with Students
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Communicate with students in real-time
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex overflow-hidden">
          {/* Students List Sidebar */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <Button
                onClick={() => setShowStudentList(!showStudentList)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Users className="w-4 h-4 mr-2" />
                New Conversation
              </Button>
            </div>

            {showStudentList && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                  Select a Student
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => startNewConversation(student.id)}
                      className="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Avatar>
                        <AvatarImage src={student.image} />
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                          {student.name?.[0] || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {student.email}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30">
                        Student
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversations List */}
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
                    onClick={() => setShowStudentList(true)}
                    variant="outline"
                  >
                    Start First Chat
                  </Button>
                </div>
              ) : (
                conversations.map((conversation) => {
                  const other = getOtherParticipant(conversation);
                  const lastMessage = conversation.messages?.[0];

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
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                            {other?.name?.[0] || "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left overflow-hidden">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                              {other?.name || "Unknown Student"}
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

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={getOtherParticipant(selectedConversation)?.image}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                        {getOtherParticipant(selectedConversation)?.name?.[0] ||
                          "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {getOtherParticipant(selectedConversation)?.name ||
                          "Unknown Student"}
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
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                  {messages.map((message) => {
                    const isOwn = message.sender.id === session?.user?.id;
                    const isSystem = message.messageType === "SYSTEM";

                    if (isSystem) {
                      return (
                        <div
                          key={message.id}
                          className="flex justify-center my-6"
                        >
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

                          <p className="text-sm break-words">
                            {message.content}
                          </p>

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

                {/* Message Input */}
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
                  Select a Student to Chat
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                  Choose a conversation from the sidebar or start a new one with
                  a student
                </p>
                <Button
                  onClick={() => setShowStudentList(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Start New Chat
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
