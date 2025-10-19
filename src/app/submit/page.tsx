"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { ToastContainer } from "@/components/ui/toast"

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    deadline: "",
    message: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const { toasts, addToast } = useToast()
  const [displayedToasts, setDisplayedToasts] = useState(toasts)

  const courses = [
    { value: "it", label: "IT & Computer Science" },
    { value: "business", label: "Business & Management" },
    { value: "finance", label: "Finance & Accounting" },
    { value: "hospitality", label: "Hospitality & Tourism" },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.course) newErrors.course = "Course is required"
    if (!formData.deadline) newErrors.deadline = "Deadline is required"
    if (!file) newErrors.file = "Module guide file is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    addToast("Assignment submitted successfully! Redirecting to chat...", "success")
    setDisplayedToasts([...toasts])
    setSubmitted(true)

    setTimeout(() => {
      window.location.href = "/chat"
    }, 2000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors({ ...errors, [name]: undefined })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (
        ![
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(selectedFile.type)
      ) {
        setErrors({ ...errors, file: "Only PDF and Word documents are allowed" })
        return
      }
      setFile(selectedFile)
      if (errors.file) setErrors({ ...errors, file: undefined })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit Your Assignment</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Submit your assignment guide for help. Our experts will review and get back to you.
          </p>
        </div>

        {!submitted ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Course"
                  name="course"
                  options={courses}
                  value={formData.course}
                  onChange={handleChange}
                  error={errors.course}
                />

                <Input
                  label="Deadline"
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  error={errors.deadline}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Module Guide (PDF or Word)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm cursor-pointer"
                />
                {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
                {file && (
                  <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                    <p className="text-sm text-emerald-900 dark:text-emerald-100">✓ {file.name} selected</p>
                  </div>
                )}
              </div>

              <Textarea
                label="Additional Message (Optional)"
                placeholder="Tell us more about your assignment or any specific requirements..."
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
              />

              <Button type="submit" className="w-full">
                Submit Assignment
              </Button>
            </form>
          </div>
        ) : (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">Submission Successful!</h2>
            <p className="text-emerald-800 dark:text-emerald-200 mb-4">
              Your assignment has been submitted. You'll be redirected to the chat shortly.
            </p>
            <Link href="/chat">
              <Button>Go to Chat Now</Button>
            </Link>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Demo:</strong> Submit your assignment guide for help. Our experts will review and get back to you.
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
