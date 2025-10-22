import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import TestimonialsManagement from "@/components/admin/TestimonialsManagement";

export default async function TestimonialsPage() {
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
          Testimonials Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Approve, hide, or reject student testimonials
        </p>
      </div>
      <TestimonialsManagement />
    </div>
  );
}
