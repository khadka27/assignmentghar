import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking for users with EXPERT role...");

  // Update all EXPERT users to STUDENT
  const result = await prisma.user.updateMany({
    where: {
      role: "EXPERT" as any, // Using 'as any' since EXPERT will be removed
    },
    data: {
      role: "STUDENT",
    },
  });

  console.log(`✅ Updated ${result.count} EXPERT users to STUDENT role`);
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
