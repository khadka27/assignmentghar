# 🔐 Google OAuth Setup Guide

Complete guide to enable **Google Sign-In** in AssignmentGhar.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Google Cloud Console Setup](#google-cloud-console-setup)
4. [Environment Configuration](#environment-configuration)
5. [Database Migration](#database-migration)
6. [Testing](#testing)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This application now supports **Google OAuth 2.0** authentication, allowing users to:

- ✅ Sign in with their Google account
- ✅ Skip email verification (Google already verified it)
- ✅ Automatic account linking if email exists
- ✅ Role-based access (defaults to STUDENT for new OAuth users)
- ✅ Seamless integration with existing credential-based auth

### Architecture

```
User clicks "Sign in with Google"
    ↓
Redirects to Google OAuth consent screen
    ↓
User authorizes application
    ↓
Google redirects back with authorization code
    ↓
NextAuth exchanges code for user info
    ↓
Check if user exists in database
    ↓
┌─────────────────────┬──────────────────────┐
│ User Exists         │ New User             │
├─────────────────────┼──────────────────────┤
│ • Link Google       │ • Create new user    │
│   account           │ • Set role: STUDENT  │
│ • Update info       │ • Mark verified      │
│ • Mark verified     │ • Create Account     │
│ • Sign in           │ • Sign in            │
└─────────────────────┴──────────────────────┘
```

---

## ✅ Prerequisites

Before setting up Google OAuth, ensure you have:

- ✅ Google account (Gmail)
- ✅ Access to [Google Cloud Console](https://console.cloud.google.com/)
- ✅ PostgreSQL database running
- ✅ NextAuth configured with `@auth/prisma-adapter`
- ✅ Environment variables setup

---

## 🛠️ Google Cloud Console Setup

### Step 1: Create or Select a Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
   - **Project Name**: `AssignmentGhar` (or your preferred name)
   - **Organization**: Leave as-is or select your org
4. Click **"Create"**
5. Wait for project creation (takes ~30 seconds)

### Step 2: Enable Google+ API (Optional but Recommended)

1. In the left sidebar, go to **"APIs & Services"** > **"Library"**
2. Search for **"Google+ API"**
3. Click on it and press **"Enable"**
4. This allows fetching additional user profile information

### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** > **"OAuth consent screen"**
2. Choose **"External"** (unless you have a Google Workspace)
3. Click **"Create"**

**App Information:**

- **App name**: `AssignmentGhar`
- **User support email**: Your email address
- **App logo**: Upload your logo (optional)
- **Application home page**: `http://localhost:3000` (for development)
- **Application privacy policy**: `http://localhost:3000/privacy` (or your privacy page URL)
- **Application terms of service**: `http://localhost:3000/terms` (optional)

**Developer Contact Information:**

- **Email addresses**: Your email address

4. Click **"Save and Continue"**

**Scopes:**

- Click **"Add or Remove Scopes"**
- Select these scopes:
  - ✅ `.../auth/userinfo.email`
  - ✅ `.../auth/userinfo.profile`
  - ✅ `openid`
- Click **"Update"**
- Click **"Save and Continue"**

**Test Users** (for development):

- Add your test Gmail accounts
- Click **"Add Users"**
- Enter email addresses (e.g., `testuser@gmail.com`)
- Click **"Save and Continue"**

5. Review and click **"Back to Dashboard"**

### Step 4: Create OAuth 2.0 Client ID

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"+ Create Credentials"** > **"OAuth client ID"**
3. If prompted to configure consent screen, do Step 3 first

**Application Type:**

- Select **"Web application"**

**Name:**

- Enter: `AssignmentGhar Web Client`

**Authorized JavaScript origins:**

- Click **"+ Add URI"**
- Add: `http://localhost:3000`
- For production, also add: `https://yourdomain.com`

**Authorized redirect URIs:**

- Click **"+ Add URI"**
- Add: `http://localhost:3000/api/auth/callback/google`
- For production, also add: `https://yourdomain.com/api/auth/callback/google`

4. Click **"Create"**
5. A popup will show your **Client ID** and **Client Secret**

**⚠️ IMPORTANT: Copy these immediately!**

```
Client ID: 1234567890-abcdefghijk.apps.googleusercontent.com
Client Secret: GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ
```

6. Click **"OK"**

---

## 🔧 Environment Configuration

### Step 1: Update `.env` File

Copy your `.env.example` to `.env` if you haven't:

```bash
cp .env.example .env
```

### Step 2: Add Google OAuth Credentials

Edit `.env` and add your Google credentials:

```bash
# Google OAuth (Required for Google Sign-In)
GOOGLE_CLIENT_ID="1234567890-abcdefghijk.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ"
```

**Full `.env` Example:**

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/assignmentghar"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-minimum-32-characters-long"

# Google OAuth
GOOGLE_CLIENT_ID="1234567890-abcdefghijk.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ"
```

### Step 3: Generate NEXTAUTH_SECRET (if not done)

```bash
# Using OpenSSL
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🗄️ Database Migration

Your Prisma schema already includes the required `Account` model for OAuth.

### Verify Schema

Check `prisma/schema.prisma` has:

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}
```

### Run Migration

```bash
# Generate Prisma Client
pnpm prisma generate

# Push changes to database (development)
pnpm prisma db push

# Or create and run migration (production)
pnpm prisma migrate dev --name add_google_oauth
```

---

## 🧪 Testing

### Step 1: Start Development Server

```bash
pnpm dev
```

Server should start on `http://localhost:3000`

### Step 2: Test Google Sign-In

1. Open browser and go to: `http://localhost:3000/login`
2. You should see:
   - Email/Password form
   - **"Or continue with"** separator
   - **"Sign in with Google"** button with Google logo
3. Click **"Sign in with Google"**
4. You'll be redirected to Google's consent screen
5. Select a Google account
6. Grant permissions (if first time)
7. You'll be redirected back to the app
8. Check:
   - ✅ You're logged in
   - ✅ User profile shows Google info
   - ✅ Database has user and account records

### Step 3: Verify Database

Check that records were created:

```sql
-- Check user was created
SELECT id, email, name, image, "emailVerified", "isVerified", role
FROM users
WHERE email = 'your-google-email@gmail.com';

-- Check Google account was linked
SELECT id, "userId", provider, "providerAccountId"
FROM accounts
WHERE provider = 'google';
```

### Step 4: Test Account Linking

1. Create a user with credentials (email/password)
2. Log out
3. Sign in with Google using the **same email**
4. Should:
   - ✅ Link Google account to existing user
   - ✅ Update user info (name, image)
   - ✅ Mark account as verified
   - ✅ Maintain existing role

---

## 🚀 Production Deployment

### Step 1: Update Google Cloud Console

1. Go to **"APIs & Services"** > **"Credentials"**
2. Edit your OAuth client
3. Add production URLs:

**Authorized JavaScript origins:**

```
https://yourdomain.com
https://www.yourdomain.com
```

**Authorized redirect URIs:**

```
https://yourdomain.com/api/auth/callback/google
https://www.yourdomain.com/api/auth/callback/google
```

### Step 2: Update Environment Variables

Set on your hosting platform (Vercel, Railway, etc.):

```bash
NEXTAUTH_URL="https://yourdomain.com"
GOOGLE_CLIENT_ID="your-production-client-id"
GOOGLE_CLIENT_SECRET="your-production-client-secret"
```

### Step 3: Publish OAuth App

1. Go to **"OAuth consent screen"**
2. Click **"Publish App"**
3. Submit for verification (optional, required for >100 users)

---

## 🐛 Troubleshooting

### Issue: "Redirect URI mismatch" Error

**Cause:** The redirect URI doesn't match what's configured in Google Cloud Console.

**Solution:**

1. Check the error message for the exact URI being used
2. Go to Google Cloud Console > Credentials
3. Add the exact URI to "Authorized redirect URIs"
4. Common mistakes:
   - ❌ `http://localhost:3000/api/auth/google`
   - ✅ `http://localhost:3000/api/auth/callback/google`
   - ❌ Missing `/api/auth/callback/google`
   - ❌ Using `https` instead of `http` for localhost

---

### Issue: "Access blocked: This app's request is invalid"

**Cause:** OAuth consent screen not configured properly.

**Solution:**

1. Complete all required fields in OAuth consent screen
2. Add at least one test user (for External apps)
3. Ensure scopes include email and profile
4. Verify app is not suspended

---

### Issue: User Created but Role is NULL

**Cause:** Database doesn't have default role set.

**Solution:**
Check your Prisma schema has:

```prisma
model User {
  role UserRole @default(STUDENT)
  // ...
}
```

Run migration:

```bash
pnpm prisma migrate dev
```

---

### Issue: "Error: adapter is not assignable to type Adapter"

**Cause:** Missing or incorrect `@auth/prisma-adapter` installation.

**Solution:**

```bash
pnpm install @auth/prisma-adapter
```

Verify `auth.ts` has:

```typescript
import { PrismaAdapter } from "@auth/prisma-adapter";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  // ...
};
```

---

### Issue: Google Sign-In Button Not Showing

**Cause:** Frontend code not updated or component error.

**Solution:**

1. Check browser console for errors
2. Verify `auth-form.tsx` has the Google button
3. Check that `Separator` component is imported
4. Clear browser cache and restart dev server

---

### Issue: "Cannot read property 'password' of null"

**Cause:** Prisma schema requires `password` field but OAuth users don't have one.

**Solution:**
Update Prisma schema to make password optional:

```prisma
model User {
  password String?  // Add ? to make optional
  // ...
}
```

Or set empty password for OAuth users (already done in code):

```typescript
password: "", // OAuth users don't have passwords
```

---

### Issue: Session Shows Wrong Role

**Cause:** JWT token doesn't fetch role from database.

**Solution:**
Ensure `jwt` callback in `auth.ts` fetches user from database:

```typescript
async jwt({ token, user }) {
  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    });
    if (dbUser) {
      token.role = dbUser.role;
    }
  }
  return token;
}
```

---

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Prisma Adapter Documentation](https://authjs.dev/reference/adapter/prisma)
- [Google Cloud Console](https://console.cloud.google.com/)

---

## 🎨 UI/UX Features

### Google Button Styling

The button follows your Blue/Purple (नीलो/बैजनी) theme:

```tsx
<Button
  variant="outline"
  className="w-full border-gray-300 dark:border-gray-700 
             hover:bg-gray-50 dark:hover:bg-gray-900"
>
  <GoogleIcon /> Sign in with Google
</Button>
```

### Responsive Design

- ✅ Mobile-optimized separator
- ✅ Icon scales with viewport
- ✅ Touch-friendly button size
- ✅ Dark mode support

---

## 🔒 Security Best Practices

1. ✅ **Never commit `.env`** - Add to `.gitignore`
2. ✅ **Use environment variables** - Not hardcoded secrets
3. ✅ **Enable HTTPS** - Required for production OAuth
4. ✅ **Rotate secrets regularly** - Update NEXTAUTH_SECRET quarterly
5. ✅ **Limit OAuth scopes** - Only request email and profile
6. ✅ **Verify email from Google** - Mark as verified automatically
7. ✅ **Account linking** - Prevent duplicate accounts with same email

---

## 📝 Summary

✅ **Google OAuth is now configured!**

Users can:

- Sign in with Google
- Sign up with Google
- Link Google to existing accounts
- Skip email verification
- Enjoy seamless authentication

Next steps:

- Add more OAuth providers (GitHub, Facebook, etc.)
- Implement social profile enrichment
- Add OAuth account management UI
- Enable multi-provider linking

---

**Questions or issues?** Check the troubleshooting section or open an issue on GitHub.

🎉 **Happy Coding!**
