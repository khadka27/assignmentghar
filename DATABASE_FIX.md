# 🚨 URGENT: Database Tables Missing

## The Problem

Your app is deployed but the database tables don't exist yet. That's why you're seeing:

```
The table `public.users` does not exist in the current database.
```

## ✅ SOLUTION (Run this in Coolify Terminal)

### Step 1: Open Coolify Terminal

1. Go to your application in Coolify
2. Click on **Terminal** or **Shell** button
3. You should see a bash prompt inside your container

### Step 2: Run Database Setup

**Option A: Using the setup script (Recommended)**

```bash
chmod +x setup-db.sh
./setup-db.sh
```

**Option B: Manual commands**

```bash
# Run migrations
npx prisma migrate deploy

# If migrations fail, use db push
npx prisma db push --accept-data-loss

# Generate Prisma Client (just to be sure)
npx prisma generate
```

**Option C: If both fail, reset everything**

```bash
# ⚠️ WARNING: This will delete all data!
npx prisma migrate reset --force
```

### Step 3: Verify Tables Were Created

```bash
# Check tables exist
npx prisma db execute --stdin <<SQL
SELECT tablename FROM pg_tables WHERE schemaname='public';
SQL
```

You should see tables like:

- User
- Assignment
- Chat
- Message
- Session
- Account
- VerificationToken
- Testimonial

### Step 4: Restart Application

After tables are created, restart your app in Coolify:

- Click **Restart** button in Coolify dashboard

---

## 🎯 Why This Happened

When you deploy to production:

1. ✅ Code is deployed
2. ✅ Dependencies are installed
3. ✅ App is built
4. ❌ **Database migrations are NOT run automatically**

You must manually run migrations the first time.

---

## 🔧 For Future Deployments

### Add to Dockerfile (Automatic migrations)

Update your `Dockerfile` to run migrations on startup:

```dockerfile
# In the CMD section, change:
CMD ["node", "server.js"]

# To:
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
```

Or create a startup script:

**start.sh:**

```bash
#!/bin/bash
echo "Running migrations..."
npx prisma migrate deploy
echo "Starting server..."
node server.js
```

**Then in Dockerfile:**

```dockerfile
COPY start.sh .
RUN chmod +x start.sh
CMD ["./start.sh"]
```

---

## 📝 Alternative: Create Seed Admin User

After migrations run, you might want to create an admin user:

```bash
npx prisma db seed
```

Or manually via Prisma Studio:

```bash
npx prisma studio
# Then open the URL shown and create users via UI
```

---

## ⚡ Quick Command Summary

```bash
# All-in-one command to fix everything:
npx prisma migrate deploy && npx prisma generate && echo "✅ Database ready!"
```

---

## 🆘 Still Having Issues?

### Check DATABASE_URL

```bash
echo $DATABASE_URL
```

Should output:

```
postgres://postgres:assignmentghardb%4020251212@e0wckskk00oww88wc8w08c00:5432/postgres?sslmode=require
```

### Check Prisma Connection

```bash
npx prisma db pull
```

If this fails, your DATABASE_URL is wrong or the database server is unreachable.

### Check Migration Files Exist

```bash
ls -la prisma/migrations/
```

You should see folders like:

- `20251020135247_init/`
- `20251020141153_add_auth_fields/`
- etc.

If no migrations exist, run:

```bash
npx prisma db push
```

---

## 🎉 After Fix

Once tables are created, you should be able to:

- ✅ Register new users
- ✅ Login
- ✅ Use Google OAuth
- ✅ Access all features

The app will work normally!
