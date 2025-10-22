import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import TestimonialsManagement from "@/components/admin/TestimonialsManagement";

export default async function AdminTestimonialsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <AdminLayout>
      <TestimonialsManagement />
    </AdminLayout>
  );
}
