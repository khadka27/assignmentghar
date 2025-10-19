"use client"

import { useState } from "react"
import { chatThread } from "@/data/chat"
import { ChatBubble } from "@/components/chat-bubble"
import { QRPanel } from "@/components/qr-panel"
import { StatusChips } from "@/components/status-chips"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Paperclip } from "lucide-react"

export default function ChatPage() {
  const [messages, setMessages] = useState(chatThread)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage = {
      id: `m${messages.length + 1}`,
      from: "student" as const,
      text: inputValue,
      ts: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      seen: false,
    }

    setMessages([...messages, newMessage])
    setInputValue("")

    // Simulate admin response
    setIsTyping(true)
    setTimeout(() => {
      const adminResponse = {
        id: `m${messages.length + 2}`,
        from: "admin" as const,
        text: "Thanks for your message. We'll review and get back to you shortly.",
        ts: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        seen: true,
      }
      setMessages((prev) => [...prev, adminResponse])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col h-[600px]">
              {/* Header */}
              <div className="border-b border-slate-200 dark:border-slate-700 p-4">
                <h2 className="font-semibold">Chat with Admin</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Database Report Assignment</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((msg) => (
                  <ChatBubble
                    key={msg.id}
                    from={msg.from}
                    text={msg.text}
                    timestamp={msg.ts}
                    seen={msg.seen}
                    file={msg.file}
                  />
                ))}
                {isTyping && (
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} size="md" className="px-4">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <button className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                  <Paperclip className="w-4 h-4" />
                  Attach File
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Payment Panel */}
            <QRPanel />

            {/* Status Chips */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <StatusChips />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Demo Mode:</strong> This is a static chat interface. Messages are simulated for demonstration
                purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
