import { Check, CheckCheck } from "lucide-react"

interface ChatBubbleProps {
  from: "student" | "admin"
  text: string
  timestamp: string
  seen: boolean
  file?: { name: string; size: string }
}

export function ChatBubble({ from, text, timestamp, seen, file }: ChatBubbleProps) {
  const isStudent = from === "student"

  return (
    <div className={`flex ${isStudent ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
          isStudent
            ? "bg-emerald-600 text-white rounded-br-none"
            : "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-bl-none"
        }`}
      >
        <p className="text-sm">{text}</p>
        {file && (
          <div className="mt-2 p-2 bg-black/10 rounded text-xs">
            📎 {file.name} ({file.size})
          </div>
        )}
        <div
          className={`flex items-center gap-1 mt-2 text-xs ${isStudent ? "text-emerald-100" : "text-slate-600 dark:text-slate-400"}`}
        >
          <span>{timestamp}</span>
          {isStudent && (seen ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
        </div>
      </div>
    </div>
  )
}
