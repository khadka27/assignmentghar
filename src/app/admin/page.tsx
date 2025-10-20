"use client";"use client"



import { useSession, signOut } from "next-auth/react";import { useState } from "react"

import { useRouter } from "next/navigation";import Link from "next/link"

import { useEffect, useState } from "react";import { students, employees, assignments } from "@/data/people"

import {import { AdminStats } from "@/components/admin-stats"

  Card,import { AdminTable } from "@/components/admin-table"

  CardContent,import { Badge } from "@/components/ui/badge"

  CardDescription,import { Button } from "@/components/ui/button"

  CardHeader,import { useToast } from "@/components/ui/toast"

  CardTitle,import { ToastContainer } from "@/components/ui/toast"

} from "@/components/ui/card";import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button";

import { Spinner } from "@/components/ui/spinner";export default function AdminPage() {

import { Badge } from "@/components/ui/badge";  const [testimonials, setTestimonials] = useState([

import {    { id: 1, student: "A.K.", course: "BSc IT", text: "Clear guidance and on-time delivery.", approved: true },

  Users,    { id: 2, student: "J.P.", course: "MBA", text: "Quick feedback and neat formatting.", approved: true },

  BookOpen,    { id: 3, student: "Anonymous", course: "BAcc", text: "Confidential and responsive.", approved: false },

  DollarSign,  ])

  TrendingUp,

  Settings,  const { toasts, addToast } = useToast()

  LogOut,  const [displayedToasts, setDisplayedToasts] = useState(toasts)

  UserCheck,

  FileText,  const handleAction = (action: string) => {

  AlertCircle,    addToast(`Demo: ${action} action executed`, "info")

  CheckCircle2,    setDisplayedToasts([...toasts])

} from "lucide-react";  }

import { useToast } from "@/hooks/use-toast";

  const toggleTestimonial = (id: number) => {

export default function AdminDashboard() {    setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, approved: !t.approved } : t)))

  const { data: session, status } = useSession();  }

  const router = useRouter();

  const { toast } = useToast();  const getStatusVariant = (status: string) => {

  const [stats] = useState({    if (status === "Completed") return "success"

    totalUsers: 156,    if (status === "In Progress") return "warning"

    totalStudents: 120,    if (status === "Awaiting Payment") return "default"

    totalExperts: 30,    return "default"

    activeAssignments: 45,  }

    completedAssignments: 289,

    pendingAssignments: 12,  return (

    totalRevenue: 256000,    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">

    monthlyGrowth: 18.5,      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

  });        {/* Header */}

        <div className="mb-8">

  useEffect(() => {          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>

    if (status === "unauthenticated") {          <p className="text-slate-600 dark:text-slate-400">Manage students, employees, and assignments</p>

      router.push("/login");        </div>

    } else if (session?.user?.role !== "ADMIN") {

      toast({        {/* Stats */}

        title: "Access Denied",        <div className="mb-8">

        description: "You don't have permission to access this page",          <AdminStats />

        variant: "destructive",        </div>

      });

      router.push("/");        {/* Tables */}

    }        <div className="space-y-8">

  }, [status, session, router, toast]);          {/* Students Table */}

          <AdminTable

  if (status === "loading") {            title="Students"

    return (            columns={[

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#ede9fe] to-[#ddd6fe] dark:from-[#0f172a] dark:via-[#1e1b4b] dark:to-[#312e81]">              { key: "name", label: "Name", sortable: true },

        <Spinner className="w-8 h-8 text-[#2563eb]" />              { key: "email", label: "Email", sortable: true },

      </div>              { key: "course", label: "Course", sortable: true },

    );              { key: "status", label: "Status", sortable: true },

  }            ]}

            data={students}

  if (!session || session.user.role !== "ADMIN") {            renderCell={(key, value) => {

    return null;              if (key === "status") {

  }                return <Badge variant={value === "Active" ? "success" : "default"}>{value}</Badge>

              }

  const handleLogout = async () => {              return value

    await signOut({ callbackUrl: "/login" });            }}

  };          />



  return (          {/* Employees Table */}

    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#ede9fe] to-[#ddd6fe] dark:from-[#0f172a] dark:via-[#1e1b4b] dark:to-[#312e81]">          <AdminTable

      {/* Header */}            title="Employees"

      <header className="sticky top-0 z-50 border-b border-[#e2e8f0] dark:border-[#334155] bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md">            columns={[

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">              { key: "name", label: "Name", sortable: true },

          <div className="flex items-center justify-between h-16">              { key: "email", label: "Email", sortable: true },

            <div className="flex items-center space-x-4">              { key: "role", label: "Role", sortable: true },

              <div className="flex items-center space-x-2">              { key: "status", label: "Status", sortable: true },

                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2563eb] to-[#7c3aed] flex items-center justify-center text-white font-bold text-xl">            ]}

                  A            data={employees}

                </div>            renderCell={(key, value) => {

                <div>              if (key === "status") {

                  <h1 className="text-lg font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">                return <Badge variant="success">{value}</Badge>

                    Admin Dashboard              }

                  </h1>              return value

                  <p className="text-xs text-[#475569] dark:text-[#cbd5e1]">            }}

                    Welcome back, {session.user.name}!          />

                  </p>

                </div>          {/* Assignments Table */}

              </div>          <AdminTable

            </div>            title="Assignments"

            <div className="flex items-center space-x-3">            columns={[

              <Button              { key: "student", label: "Student", sortable: true },

                variant="outline"              { key: "title", label: "Title", sortable: true },

                size="sm"              { key: "course", label: "Course", sortable: true },

                className="hidden sm:flex items-center space-x-2"              { key: "deadline", label: "Deadline", sortable: true },

              >              { key: "status", label: "Status", sortable: true },

                <Settings className="w-4 h-4" />            ]}

                <span>Settings</span>            data={assignments}

              </Button>            renderCell={(key, value) => {

              <Button              if (key === "status") {

                variant="outline"                return <Badge variant={getStatusVariant(value)}>{value}</Badge>

                size="sm"              }

                onClick={handleLogout}              return value

                className="flex items-center space-x-2 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-800"            }}

              >          />

                <LogOut className="w-4 h-4" />

                <span className="hidden sm:inline">Logout</span>          {/* Testimonials Moderation */}

              </Button>          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">

            </div>            <h3 className="text-lg font-semibold mb-4">Testimonials Moderation</h3>

          </div>            <div className="space-y-3">

        </div>              {testimonials.map((testimonial) => (

      </header>                <div

                  key={testimonial.id}

      {/* Main Content */}                  className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">                >

        {/* Welcome Banner */}                  <div className="flex-1">

        <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white shadow-lg">                    <div className="flex items-center gap-2 mb-2">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">                      <p className="font-medium">{testimonial.student}</p>

            <div>                      <Badge variant="default">{testimonial.course}</Badge>

              <h2 className="text-2xl sm:text-3xl font-bold mb-2">                    </div>

                Welcome Admin {session.user.name}! 👑                    <p className="text-sm text-slate-600 dark:text-slate-400">"{testimonial.text}"</p>

              </h2>                  </div>

              <p className="text-blue-100 text-sm sm:text-base">                  <button

                You have {stats.pendingAssignments} pending assignments and{" "}                    onClick={() => toggleTestimonial(testimonial.id)}

                {stats.activeAssignments} active tasks                    className="ml-4 p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"

              </p>                    aria-label={testimonial.approved ? "Hide testimonial" : "Approve testimonial"}

            </div>                  >

            <Badge className="mt-4 sm:mt-0 bg-white/20 hover:bg-white/30 text-white border-white/30 px-4 py-2">                    {testimonial.approved ? (

              <TrendingUp className="w-4 h-4 mr-2" />                      <Eye className="w-5 h-5 text-emerald-600" />

              +{stats.monthlyGrowth}% Growth                    ) : (

            </Badge>                      <EyeOff className="w-5 h-5 text-slate-400" />

          </div>                    )}

        </div>                  </button>

                </div>

        {/* Stats Grid */}              ))}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">            </div>

          {/* Total Users */}          </div>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b]">

            <CardHeader className="pb-3">          {/* Quick Actions */}

              <div className="flex items-center justify-between">          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">

                <CardTitle className="text-[#0f172a] dark:text-[#f1f5f9] text-base sm:text-lg">            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

                  Total Users            <div className="flex flex-wrap gap-3">

                </CardTitle>              <Button onClick={() => handleAction("Send message")} variant="secondary">

                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2563eb] to-[#60a5fa] flex items-center justify-center">                Send Message

                  <Users className="w-5 h-5 text-white" />              </Button>

                </div>              <Button onClick={() => handleAction("Export data")} variant="secondary">

              </div>                Export Data

            </CardHeader>              </Button>

            <CardContent>              <Button onClick={() => handleAction("View payment proofs")} variant="secondary">

              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#2563eb] to-[#60a5fa] bg-clip-text text-transparent">                Payment Proofs

                {stats.totalUsers}              </Button>

              </p>              <Link href="/chat">

              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1] mt-2">                <Button variant="secondary">View Chat</Button>

                {stats.totalStudents} Students, {stats.totalExperts} Experts              </Link>

              </p>            </div>

            </CardContent>          </div>

          </Card>        </div>



          {/* Active Assignments */}        {/* Demo Notice */}

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b]">        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">

            <CardHeader className="pb-3">          <p className="text-sm text-blue-900 dark:text-blue-100">

              <div className="flex items-center justify-between">            <strong>Demo Mode:</strong> This dashboard displays mock data. Tables are sortable by clicking column

                <CardTitle className="text-[#0f172a] dark:text-[#f1f5f9] text-base sm:text-lg">            headers. Testimonial visibility can be toggled with the eye icon.

                  Active Tasks          </p>

                </CardTitle>        </div>

                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center">      </div>

                  <BookOpen className="w-5 h-5 text-white" />

                </div>      <ToastContainer

              </div>        toasts={displayedToasts}

            </CardHeader>        onRemove={(id) => setDisplayedToasts(displayedToasts.filter((t) => t.id !== id))}

            <CardContent>      />

              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] bg-clip-text text-transparent">    </div>

                {stats.activeAssignments}  )

              </p>}

              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1] mt-2">
                In progress
              </p>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#0f172a] dark:text-[#f1f5f9] text-base sm:text-lg">
                  Total Revenue
                </CardTitle>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10b981] to-[#34d399] flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl sm:text-4xl font-bold text-[#10b981]">
                NPR {stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1] mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{stats.monthlyGrowth}% this month
              </p>
            </CardContent>
          </Card>

          {/* Completed */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#0f172a] dark:text-[#f1f5f9] text-base sm:text-lg">
                  Completed
                </CardTitle>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#818cf8] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl sm:text-4xl font-bold text-[#6366f1]">
                {stats.completedAssignments}
              </p>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1] mt-2">
                All time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions */}
          <Card className="border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b]">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl text-[#0f172a] dark:text-[#f1f5f9]">
                Quick Actions
              </CardTitle>
              <CardDescription className="text-[#475569] dark:text-[#cbd5e1]">
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
                <UserCheck className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
              <Button className="w-full justify-start bg-[#7c3aed] hover:bg-[#6d28d9] text-white">
                <FileText className="w-4 h-4 mr-2" />
                Review Assignments
              </Button>
              <Button className="w-full justify-start bg-[#6366f1] hover:bg-[#4f46e5] text-white">
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </Button>
            </CardContent>
          </Card>

          {/* Pending Items */}
          <Card className="border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b]">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl text-[#0f172a] dark:text-[#f1f5f9]">
                Pending Items
              </CardTitle>
              <CardDescription className="text-[#475569] dark:text-[#cbd5e1]">
                Items requiring your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#fef3c7] dark:bg-[#422006] border border-[#fbbf24] dark:border-[#78350f]">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-[#f59e0b]" />
                    <div>
                      <p className="font-medium text-[#92400e] dark:text-[#fbbf24] text-sm sm:text-base">
                        Pending Approvals
                      </p>
                      <p className="text-xs text-[#78350f] dark:text-[#fcd34d]">
                        {stats.pendingAssignments} assignments
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-[#f59e0b] hover:bg-[#d97706] text-white border-0">
                    {stats.pendingAssignments}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#dbeafe] dark:bg-[#1e3a8a] border border-[#60a5fa] dark:border-[#1e40af]">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-[#2563eb]" />
                    <div>
                      <p className="font-medium text-[#1e3a8a] dark:text-[#60a5fa] text-sm sm:text-base">
                        New User Registrations
                      </p>
                      <p className="text-xs text-[#1e40af] dark:text-[#93c5fd]">
                        8 pending verification
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-0">
                    8
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b]">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl text-[#0f172a] dark:text-[#f1f5f9]">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-[#475569] dark:text-[#cbd5e1]">
              Latest platform activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  user: "Ramesh Kumar",
                  action: "submitted assignment",
                  subject: "Data Structures",
                  time: "5 minutes ago",
                  color: "text-[#2563eb]",
                },
                {
                  user: "Sita Sharma",
                  action: "registered as Student",
                  subject: "",
                  time: "1 hour ago",
                  color: "text-[#10b981]",
                },
                {
                  user: "Expert Prakash",
                  action: "completed assignment",
                  subject: "Physics Lab Report",
                  time: "2 hours ago",
                  color: "text-[#7c3aed]",
                },
                {
                  user: "Maya Thapa",
                  action: "made payment",
                  subject: "NPR 1500",
                  time: "3 hours ago",
                  color: "text-[#f59e0b]",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-[#f8fafc] dark:bg-[#0f172a] hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b] transition-colors"
                >
                  <div className="flex-1 mb-2 sm:mb-0">
                    <p className="font-medium text-[#0f172a] dark:text-[#f1f5f9] text-sm sm:text-base">
                      <span className={activity.color}>{activity.user}</span>{" "}
                      {activity.action}
                      {activity.subject && (
                        <span className="font-normal text-[#475569] dark:text-[#cbd5e1]">
                          {" "}
                          - {activity.subject}
                        </span>
                      )}
                    </p>
                    <p className="text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1]">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
