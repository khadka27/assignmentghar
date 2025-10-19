"use client"

import { useState } from "react"
import Link from "next/link"
import { students, employees, assignments } from "@/data/people"
import { AdminStats } from "@/components/admin-stats"
import { AdminTable } from "@/components/admin-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { ToastContainer } from "@/components/ui/toast"
import { Eye, EyeOff } from "lucide-react"

export default function AdminPage() {
  const [testimonials, setTestimonials] = useState([
    { id: 1, student: "A.K.", course: "BSc IT", text: "Clear guidance and on-time delivery.", approved: true },
    { id: 2, student: "J.P.", course: "MBA", text: "Quick feedback and neat formatting.", approved: true },
    { id: 3, student: "Anonymous", course: "BAcc", text: "Confidential and responsive.", approved: false },
  ])

  const { toasts, addToast } = useToast()
  const [displayedToasts, setDisplayedToasts] = useState(toasts)

  const handleAction = (action: string) => {
    addToast(`Demo: ${action} action executed`, "info")
    setDisplayedToasts([...toasts])
  }

  const toggleTestimonial = (id: number) => {
    setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, approved: !t.approved } : t)))
  }

  const getStatusVariant = (status: string) => {
    if (status === "Completed") return "success"
    if (status === "In Progress") return "warning"
    if (status === "Awaiting Payment") return "default"
    return "default"
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage students, employees, and assignments</p>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <AdminStats />
        </div>

        {/* Tables */}
        <div className="space-y-8">
          {/* Students Table */}
          <AdminTable
            title="Students"
            columns={[
              { key: "name", label: "Name", sortable: true },
              { key: "email", label: "Email", sortable: true },
              { key: "course", label: "Course", sortable: true },
              { key: "status", label: "Status", sortable: true },
            ]}
            data={students}
            renderCell={(key, value) => {
              if (key === "status") {
                return <Badge variant={value === "Active" ? "success" : "default"}>{value}</Badge>
              }
              return value
            }}
          />

          {/* Employees Table */}
          <AdminTable
            title="Employees"
            columns={[
              { key: "name", label: "Name", sortable: true },
              { key: "email", label: "Email", sortable: true },
              { key: "role", label: "Role", sortable: true },
              { key: "status", label: "Status", sortable: true },
            ]}
            data={employees}
            renderCell={(key, value) => {
              if (key === "status") {
                return <Badge variant="success">{value}</Badge>
              }
              return value
            }}
          />

          {/* Assignments Table */}
          <AdminTable
            title="Assignments"
            columns={[
              { key: "student", label: "Student", sortable: true },
              { key: "title", label: "Title", sortable: true },
              { key: "course", label: "Course", sortable: true },
              { key: "deadline", label: "Deadline", sortable: true },
              { key: "status", label: "Status", sortable: true },
            ]}
            data={assignments}
            renderCell={(key, value) => {
              if (key === "status") {
                return <Badge variant={getStatusVariant(value)}>{value}</Badge>
              }
              return value
            }}
          />

          {/* Testimonials Moderation */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Testimonials Moderation</h3>
            <div className="space-y-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium">{testimonial.student}</p>
                      <Badge variant="default">{testimonial.course}</Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">"{testimonial.text}"</p>
                  </div>
                  <button
                    onClick={() => toggleTestimonial(testimonial.id)}
                    className="ml-4 p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    aria-label={testimonial.approved ? "Hide testimonial" : "Approve testimonial"}
                  >
                    {testimonial.approved ? (
                      <Eye className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => handleAction("Send message")} variant="secondary">
                Send Message
              </Button>
              <Button onClick={() => handleAction("Export data")} variant="secondary">
                Export Data
              </Button>
              <Button onClick={() => handleAction("View payment proofs")} variant="secondary">
                Payment Proofs
              </Button>
              <Link href="/chat">
                <Button variant="secondary">View Chat</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Demo Mode:</strong> This dashboard displays mock data. Tables are sortable by clicking column
            headers. Testimonial visibility can be toggled with the eye icon.
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
