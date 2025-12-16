"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Users,
  FileText,
  Star,
  MessageSquare,
  TrendingUp,
  UserCheck,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DashboardStats {
  totalUsers: number;
  totalAssignments: number;
  totalTestimonials: number;
  pendingTestimonials: number;
  activeChats: number;
  adminUsers: number;
  completedAssignments: number;
  pendingAssignments: number;
  chartData: ChartData[];
  recentUsers: RecentUser[];
  recentAssignments: RecentAssignment[];
}

interface ChartData {
  name: string;
  users: number;
  assignments: number;
  messages: number;
}

interface RecentUser {
  name: string;
  email: string;
  createdAt: string;
  role: string;
}

interface RecentAssignment {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  user: {
    name: string;
  };
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalAssignments: 0,
    totalTestimonials: 0,
    pendingTestimonials: 0,
    activeChats: 0,
    adminUsers: 0,
    completedAssignments: 0,
    pendingAssignments: 0,
    chartData: [],
    recentUsers: [],
    recentAssignments: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Total Assignments",
      value: stats.totalAssignments,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Testimonials",
      value: stats.totalTestimonials,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      title: "Pending Reviews",
      value: stats.pendingTestimonials,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      title: "Active Chats",
      value: stats.activeChats,
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Admin Users",
      value: stats.adminUsers,
      icon: UserCheck,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      title: "Completed",
      value: stats.completedAssignments,
      icon: CheckCircle,
      color: "text-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
    },
    {
      title: "Pending Tasks",
      value: stats.pendingAssignments,
      icon: TrendingUp,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Overview of your platform statistics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="p-6 border border-gray-200 dark:border-gray-800 hover:border-blue-600 dark:hover:border-blue-600 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-14 h-14 ${stat.bgColor} rounded-lg flex items-center justify-center`}
              >
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Multi-line Growth */}
        <Card className="p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Growth Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#2563eb"
                strokeWidth={2}
                name="Users"
              />
              <Line
                type="monotone"
                dataKey="assignments"
                stroke="#16a34a"
                strokeWidth={2}
                name="Assignments"
              />
              <Line
                type="monotone"
                dataKey="messages"
                stroke="#9333ea"
                strokeWidth={2}
                name="Messages"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Chart - Monthly Comparison */}
        <Card className="p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Monthly Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#2563eb" name="Users" />
              <Bar dataKey="assignments" fill="#16a34a" name="Assignments" />
              <Bar dataKey="messages" fill="#9333ea" name="Messages" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card className="p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Recent Users
          </h3>
          <div className="space-y-4">
            {stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      }`}
                    >
                      {user.role}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No recent users
              </p>
            )}
          </div>
        </Card>

        {/* Recent Assignments */}
        <Card className="p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Recent Assignments
          </h3>
          <div className="space-y-4">
            {stats.recentAssignments.length > 0 ? (
              stats.recentAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {assignment.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      by {assignment.user.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        assignment.status === "COMPLETED"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : assignment.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }`}
                    >
                      {assignment.status.replace("_", " ")}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(assignment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No recent assignments
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Overview */}
      <Card className="p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Quick Overview
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
            <span className="text-gray-600 dark:text-gray-400">
              Total System Users
            </span>
            <span className="text-blue-600 font-semibold">
              {stats.totalUsers}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
            <span className="text-gray-600 dark:text-gray-400">
              Assignment Completion Rate
            </span>
            <span className="text-green-600 font-semibold">
              {stats.totalAssignments > 0
                ? `${(
                    (stats.completedAssignments / stats.totalAssignments) *
                    100
                  ).toFixed(1)}%`
                : "0%"}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
            <span className="text-gray-600 dark:text-gray-400">
              Active Chat Conversations
            </span>
            <span className="text-purple-600 font-semibold">
              {stats.activeChats}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-600 dark:text-gray-400">
              Pending Testimonial Reviews
            </span>
            <span className="text-orange-600 font-semibold">
              {stats.pendingTestimonials}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
