"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { AuthTabs } from "@/components/auth-tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { ToastContainer } from "@/components/ui/toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const { toasts, addToast } = useToast()
  const [displayedToasts, setDisplayedToasts] = useState(toasts)

  const validateForm = () => {
    const newErrors: typeof errors = {}
    if (!email) newErrors.email = "Email is required"
    if (!password) newErrors.password = "Password is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    addToast("Demo mode: Login functionality is simulated", "info")
    setDisplayedToasts([...toasts])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">Sign in to your account</p>

          <AuthTabs>
            {(userType) => (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors({ ...errors, email: undefined })
                  }}
                  error={errors.email}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors({ ...errors, password: undefined })
                  }}
                  error={errors.password}
                />

                <div className="flex justify-end">
                  <Link
                    href="/recover"
                    className="text-sm text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full">
                  Sign In as {userType === "student" ? "Student" : "Admin"}
                </Button>

                <button
                  type="button"
                  className="w-full py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                  disabled
                >
                  Continue with Google (Demo)
                </button>
              </form>
            )}
          </AuthTabs>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Demo:</strong> Use any email/password combination to test the form validation.
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
