# 🚀 Quick Start: Google OAuth

## ⚡ 5-Minute Setup

### 1. Get Google Credentials (2 minutes)

Visit: https://console.cloud.google.com/

```
1. Create Project → "AssignmentGhar"
2. APIs & Services → Credentials
3. Create OAuth Client ID → Web Application
4. Add redirect URI: http://localhost:3000/api/auth/callback/google
5. Copy Client ID and Client Secret
```

### 2. Update Environment Variables (1 minute)

Create `.env` file:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/assignmentghar"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-client-secret"
```

### 3. Run Database Migration (1 minute)

```bash
pnpm prisma generate
pnpm prisma db push
```

### 4. Start Server (1 minute)

```bash
pnpm dev
```

Visit: http://localhost:3000/login

## ✅ What's Working

- ✅ Google sign-in button on login page
- ✅ Google sign-up button on register page
- ✅ Automatic account creation for new Google users
- ✅ Account linking for existing users
- ✅ Email verification bypass (Google verified)
- ✅ Role-based routing (defaults to STUDENT)
- ✅ Profile picture from Google
- ✅ Dark mode support

## 🎨 UI Changes

**Login Page:**

```
┌─────────────────────────┐
│  Email/Password Form    │
├─────────────────────────┤
│  Or continue with       │
├─────────────────────────┤
│  [G] Sign in with Google│
└─────────────────────────┘
```

**Register Page:**

```
┌─────────────────────────┐
│  Registration Form      │
├─────────────────────────┤
│  Or continue with       │
├─────────────────────────┤
│  [G] Sign up with Google│
└─────────────────────────┘
```

## 📝 Files Modified

1. **src/lib/auth.ts**

   - Added GoogleProvider
   - Added signIn callback for account creation/linking
   - Enhanced JWT callback to fetch role from database

2. **src/components/auth-form.tsx**

   - Added `handleGoogleSignIn()` function
   - Added Google button with icon
   - Added separator "Or continue with"
   - Imported Separator component

3. **.env.example**

   - Added GOOGLE_CLIENT_ID
   - Added GOOGLE_CLIENT_SECRET
   - Added setup instructions

4. **GOOGLE_OAUTH_SETUP.md** (NEW)
   - Comprehensive setup guide
   - Troubleshooting section
   - Production deployment guide

## 🔍 Testing Checklist

- [ ] Click "Sign in with Google"
- [ ] Redirects to Google consent screen
- [ ] Select Google account
- [ ] Redirects back to app
- [ ] User is logged in
- [ ] Check database: user and account records created
- [ ] Try logging out and back in
- [ ] Test with existing email (should link accounts)

## 🐛 Common Issues

**"Redirect URI mismatch"**

```
Solution: Add exact redirect URI to Google Console
http://localhost:3000/api/auth/callback/google
```

**"Access blocked"**

```
Solution: Configure OAuth consent screen
Add test users in Google Console
```

**"No GOOGLE_CLIENT_ID"**

```
Solution: Check .env file exists and has correct values
Restart dev server after adding
```

## 📚 Full Documentation

See `GOOGLE_OAUTH_SETUP.md` for:

- Detailed Google Cloud Console setup
- OAuth consent screen configuration
- Production deployment guide
- Security best practices
- Troubleshooting guide

## 🎉 That's It!

Your app now supports Google OAuth!

Users can sign in with their Google account in one click! 🚀
