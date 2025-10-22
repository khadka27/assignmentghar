import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, User, Calendar, Shield } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });

  if (user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your admin account settings
        </p>
      </div>

      <Card className="p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl">
              {user.name?.[0] || "A"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {user.name}
                <Badge className="bg-blue-600">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Mail className="w-5 h-5" />
                <div>
                  <p className="text-sm">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <User className="w-5 h-5" />
                <div>
                  <p className="text-sm">User ID</p>
                  <p className="font-medium text-gray-900 dark:text-white font-mono text-xs">
                    {user.id.slice(0, 12)}...
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Calendar className="w-5 h-5" />
                <div>
                  <p className="text-sm">Member Since</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
