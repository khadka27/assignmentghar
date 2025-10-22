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
}

interface ChartData {
  name: string;
  users: number;
  assignments: number;
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
  });

  const [chartData, setChartData] = useState<ChartData[]>([
    { name: "Jan", users: 40, assignments: 24 },
    { name: "Feb", users: 30, assignments: 13 },
    { name: "Mar", users: 20, assignments: 38 },
    { name: "Apr", users: 27, assignments: 39 },
    { name: "May", users: 18, assignments: 48 },
    { name: "Jun", users: 23, assignments: 38 },
  ]);

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
    <div className="space-y-8">
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
        {/* Line Chart */}
        <Card className="p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            User Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
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
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Chart */}
        <Card className="p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Assignments Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="assignments" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Quick Overview
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
            <span className="text-gray-600 dark:text-gray-400">
              User Growth Rate
            </span>
            <span className="text-green-600 font-semibold">+12.5%</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
            <span className="text-gray-600 dark:text-gray-400">
              Assignment Completion Rate
            </span>
            <span className="text-blue-600 font-semibold">87.3%</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-600 dark:text-gray-400">
              Customer Satisfaction
            </span>
            <span className="text-yellow-600 font-semibold">4.8/5.0</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
