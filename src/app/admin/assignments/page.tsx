import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AssignmentsManagement from "@/components/admin/AssignmentsManagement";

export default async function AssignmentsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Assignments Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View and manage all student assignments
        </p>
      </div>
      <AssignmentsManagement />
    </div>
  );
}
