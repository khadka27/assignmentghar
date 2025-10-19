"use client"

import type React from "react"

import { useState } from "react"

interface AuthTabsProps {
  children: (userType: "student" | "admin") => React.ReactNode
}

export function AuthTabs({ children }: AuthTabsProps) {
  const [userType, setUserType] = useState<"student" | "admin">("student")

  return (
    <div>
      <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setUserType("student")}
          className={`pb-3 px-2 font-medium transition-colors ${
            userType === "student"
              ? "text-emerald-600 border-b-2 border-emerald-600"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          Student
        </button>
        <button
          onClick={() => setUserType("admin")}
          className={`pb-3 px-2 font-medium transition-colors ${
            userType === "admin"
              ? "text-emerald-600 border-b-2 border-emerald-600"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          Admin
        </button>
      </div>
      {children(userType)}
    </div>
  )
}
