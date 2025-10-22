const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Checking database users...\n');

    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });

    console.log(`Total users: ${users.length}\n`);

    if (users.length === 0) {
        console.log('❌ No users found in database!');
        console.log('Run: npx prisma db seed\n');
    } else {
        console.log('Users:');
        users.forEach(user => {
            console.log(`  - ${user.role}: ${user.name} (${user.email})`);
            console.log(`    ID: ${user.id}`);
        });
    }

    const admins = users.filter(u => u.role === 'ADMIN');
    const students = users.filter(u => u.role === 'STUDENT');

    console.log(`\n📊 Summary:`);
    console.log(`  Admins: ${admins.length}`);
    console.log(`  Students: ${students.length}`);

    if (admins.length === 0) {
        console.log('\n⚠️  No admin users found! Students cannot chat.');
    }
    if (students.length === 0) {
        console.log('\n⚠️  No student users found! Admins cannot chat.');
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
