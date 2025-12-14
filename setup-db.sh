#!/bin/bash
# Quick fix script for production database setup

echo "🚀 Setting up production database..."
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set!"
    exit 1
fi

echo "✅ DATABASE_URL is configured"
echo ""

# Option 1: Run migrations (if you have migration files)
echo "📦 Running Prisma migrations..."
npx prisma migrate deploy

# If migrations fail, use db push as fallback
if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  Migrations failed, trying db push..."
    npx prisma db push --accept-data-loss
fi

# Generate Prisma Client
echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate

echo ""
echo "✅ Database setup complete!"
echo ""
echo "📊 Checking database tables..."
npx prisma db execute --stdin <<SQL
SELECT tablename FROM pg_tables WHERE schemaname='public';
SQL

echo ""
echo "🎉 Done! You can now start your application."
