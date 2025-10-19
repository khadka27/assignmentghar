"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { ToastContainer } from "@/components/ui/toast"

export default function RecoverPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const { toasts, addToast } = useToast()
  const [displayedToasts, setDisplayedToasts] = useState(toasts)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError("Email is required")
      return
    }
    addToast("Demo mode: Recovery email sent", "success")
    setDisplayedToasts([...toasts])
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
          <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError("")
                }}
                error={error}
              />

              <Button type="submit" className="w-full">
                Send Recovery Link
              </Button>
            </form>
          ) : (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-6">
              <p className="text-emerald-900 dark:text-emerald-100">
                ✓ Recovery link sent to <strong>{email}</strong>. Check your inbox.
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Demo:</strong> This is a static form. Recovery functionality is simulated.
          </p>
        </div>
      </div>

      <ToastContainer
        toasts={displayedToasts}
        onRemove={(id) => setDisplayedToasts(displayedToasts.filter((t) => t.id !== id))}
      />
    </div>
  )
}
