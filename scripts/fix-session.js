const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🔧 Fixing session mismatch issue...\n');

    // The session is looking for this user ID
    const sessionUserId = 'cmgz80m060000l5ycl50mrovo';
    const adminEmail = 'admin@assignmentghar.com';

    // Check if user with session ID exists
    const sessionUser = await prisma.user.findUnique({
        where: { id: sessionUserId },
    });

    if (sessionUser) {
        console.log('✅ User with session ID already exists!');
        return;
    }

    // Check if admin with this email exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log('Found existing admin:', existingAdmin.email);
        console.log('Current ID:', existingAdmin.id);
        console.log('Session ID:', sessionUserId);
        console.log('\n⚠️  IDs do not match!');
        console.log('\n🔄 Solution: Please log out and log back in to refresh your session.');
        console.log('   OR delete all users and re-seed the database.\n');
    } else {
        console.log('❌ No admin user found with email:', adminEmail);
        console.log('\n🔄 Creating new admin user with session ID...\n');

        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        const newAdmin = await prisma.user.create({
            data: {
                id: sessionUserId,
                email: adminEmail,
                name: 'Admin',
                password: hashedPassword,
                role: 'ADMIN',
                isVerified: true,
                emailVerified: new Date(),
            },
        });

        console.log('✅ Admin user created successfully!');
        console.log('   Email:', newAdmin.email);
        console.log('   ID:', newAdmin.id);
        console.log('\n🎉 You can now use the chat feature without logging out!');
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
