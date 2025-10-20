import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Check if admin already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (existingAdmin) {
    console.log("✅ Admin user already exists");
    return;
  }

  // Create default admin
  const hashedPassword = await bcrypt.hash("Admin@123", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      username: "admin",
      email: "admin@assignmentghar.com",
      password: hashedPassword,
      role: "ADMIN",
      isVerified: true,
      emailVerified: new Date(),
    },
  });

  console.log("✅ Default admin created:");
  console.log("   Email: admin@assignmentghar.com");
  console.log("   Password: Admin@123");
  console.log("   ⚠️  Please change the password after first login!");
  console.log("");
  console.log("🌱 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
