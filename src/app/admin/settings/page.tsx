import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Database, Shield, Bell } from "lucide-react";

export default async function AdminSettingsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { role: true, name: true, email: true },
  });

  if (user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your admin settings and preferences
          </p>
        </div>

        {/* Admin Info */}
        <Card className="p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.name?.charAt(0) || user.email.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {user.name || "Admin User"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              <Badge className="mt-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                <Shield className="w-3 h-3 mr-1" />
                Administrator
              </Badge>
            </div>
          </div>
        </Card>

        {/* System Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Database
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Connected
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your database is connected and running properly.
            </p>
          </Card>

          <Card className="p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enabled
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receive notifications for important events.
            </p>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
              <span className="text-gray-700 dark:text-gray-300">
                Email Notifications
              </span>
              <Badge
                variant="outline"
                className="border-green-300 dark:border-green-700 text-green-600"
              >
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
              <span className="text-gray-700 dark:text-gray-300">
                Auto-approve Testimonials
              </span>
              <Badge
                variant="outline"
                className="border-red-300 dark:border-red-700 text-red-600"
              >
                Disabled
              </Badge>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-700 dark:text-gray-300">
                Chat Monitoring
              </span>
              <Badge
                variant="outline"
                className="border-green-300 dark:border-green-700 text-green-600"
              >
                Active
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
