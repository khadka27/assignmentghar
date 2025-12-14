#!/bin/bash
# Production deployment script for Coolify
# Run this after deployment to set up the database

echo "🚀 Starting deployment setup..."

# Run Prisma migrations
echo "📦 Running Prisma migrations..."
npx prisma migrate deploy

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Optional: Seed database if needed (uncomment if you want to seed)
# echo "🌱 Seeding database..."
# npx prisma db seed

echo "✅ Deployment setup complete!"
echo "🎯 You can now start the application with: pnpm start"
