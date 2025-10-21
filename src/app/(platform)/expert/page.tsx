"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  DollarSign,
  LogOut,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";

export default function ExpertDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    activeAssignments: 12,
    completedAssignments: 45,
    totalEarnings: 12500,
    avgRating: 4.8,
    pendingReviews: 3,
    responseTime: "2.5 hrs",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "EXPERT") {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e0e7ff] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#1e1b4b]">
        <Spinner className="w-8 h-8 text-[#7c3aed]" />
      </div>
    );
  }

  if (!session || session.user.role !== "EXPERT") {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e0e7ff] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#1e1b4b]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#e2e8f0] dark:border-[#334155] bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center text-white font-bold text-xl">
                  E
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] bg-clip-text text-transparent">
                    Expert Dashboard
                  </h1>
                  <p className="text-xs text-[#475569] dark:text-[#cbd5e1]">
                    Welcome back, {session.user.name}!
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-800"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                Welcome, Expert {session.user.name}! 🎓
              </h2>
              <p className="text-purple-100 text-sm sm:text-base">
                You have {stats.activeAssignments} active assignments and{" "}
                {stats.pendingReviews} pending reviews
              </p>
            </div>
            <Badge className="mt-4 sm:mt-0 bg-white/20 hover:bg-white/30 text-white border-white/30 px-4 py-2">
              ⭐ {stats.avgRating} Rating
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Active Assignments */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#0f172a] dark:text-[#f1f5f9] text-base sm:text-lg">
                  Active Assignments
                </CardTitle>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] bg-clip-text text-transparent">
                {stats.activeAssignments}
              </p>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1] mt-2">
                In progress
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10b981] to-[#34d399] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl sm:text-4xl font-bold text-[#10b981]">
                {stats.completedAssignments}
              </p>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1] mt-2">
                Total assignments
              </p>
            </CardContent>
          </Card>

          {/* Total Earnings */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#0f172a] dark:text-[#f1f5f9] text-base sm:text-lg">
                  Total Earnings
                </CardTitle>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl sm:text-4xl font-bold text-[#f59e0b]">
                NPR {stats.totalEarnings.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1] mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% this month
              </p>
            </CardContent>
          </Card>

          {/* Avg Response Time */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#0f172a] dark:text-[#f1f5f9] text-base sm:text-lg">
                  Avg Response
                </CardTitle>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl sm:text-4xl font-bold text-[#3b82f6]">
                {stats.responseTime}
              </p>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1] mt-2">
                Response time
              </p>
            </CardContent>
          </Card>

          {/* Pending Reviews */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#0f172a] dark:text-[#f1f5f9] text-base sm:text-lg">
                  Pending Reviews
                </CardTitle>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ef4444] to-[#f87171] flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl sm:text-4xl font-bold text-[#ef4444]">
                {stats.pendingReviews}
              </p>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1] mt-2">
                Needs attention
              </p>
            </CardContent>
          </Card>

          {/* Average Rating */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#0f172a] dark:text-[#f1f5f9] text-base sm:text-lg">
                  Expert Rating
                </CardTitle>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center">
                  <span className="text-white text-xl">⭐</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] bg-clip-text text-transparent">
                {stats.avgRating}/5.0
              </p>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1] mt-2">
                Based on 45 reviews
              </p>
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
              Your latest assignments and interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Physics Assignment - Quantum Mechanics",
                  status: "In Progress",
                  time: "2 hours ago",
                  color: "text-[#7c3aed]",
                },
                {
                  title: "Mathematics - Calculus Problem Set",
                  status: "Completed",
                  time: "1 day ago",
                  color: "text-[#10b981]",
                },
                {
                  title: "Chemistry Lab Report Review",
                  status: "Pending",
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
                      {activity.title}
                    </p>
                    <p className="text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1]">
                      {activity.time}
                    </p>
                  </div>
                  <Badge
                    className={`${activity.color} bg-transparent border w-fit`}
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
