# Deployment Guide for assignmentghar.com

## 🚀 Deploying on Hostinger VPS with Coolify

## ✅ Prerequisites Checklist

- ✅ Hostinger VPS (minimum 2GB RAM recommended)
- ✅ Coolify installed on your VPS
- ✅ Domain `assignmentghar.com` pointed to your VPS IP
- ✅ SSH access to your VPS
- ✅ PostgreSQL database ready

---

## 📋 Step-by-Step Deployment

### 1. Prepare Your Coolify Instance

**Login to your Coolify dashboard:**

- URL: `https://your-vps-ip:8000` or your Coolify domain
- Access your Coolify panel

### 2. Create a New Application

1. Click **"+ New"** → **"Application"**
2. Choose **"Public Repository"** or connect your private GitHub repo
3. Repository: `https://github.com/khadka27/assignmentghar`
4. Branch: `main`
5. Build Pack: Select **"Node.js"** or **"Dockerfile"** (if you have one)

### 3. Configure Build Settings

In Coolify Application Settings:

**Build Command:**

```bash
pnpm install && npx prisma generate && pnpm build
```

**Start Command:**

```bash
node server.js
```

**Port:** `3001`

**Install Command (if needed):**

```bash
npm install -g pnpm
```

### 4. Add Environment Variables in Coolify

Go to **Environment Variables** section and add:

```env
DATABASE_URL=postgres://postgres:assignmentghardb%4020251212@e0wckskk00oww88wc8w08c00:5432/postgres?sslmode=require

NEXTAUTH_SECRET=<generate-new-secret-here>
NEXTAUTH_URL=https://assignmentghar.com

GOOGLE_CLIENT_ID=380246129941-bjplp5lk2i5d5lu2s6dcipld7dvrjv2n.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_OAUTH_REDIRECT_URI=https://assignmentghar.com/api/google/oauth/callback

EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=assignmentghar1@gmail.com
EMAIL_SERVER_PASSWORD=hlkvjbnmnwhfcssl
EMAIL_FROM=AssignmentGhar <assignmentghar1@gmail.com>

EMAIL_USER=assignmentghar1@gmail.com
EMAIL_PASSWORD=hlkvjbnmnwhfcssl

NEXT_PUBLIC_APP_URL=https://assignmentghar.com
NODE_ENV=production
```

**⚠️ Generate New NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

### 5. Configure Domain in Coolify

1. Go to **Domains** section
2. Add: `assignmentghar.com`
3. Enable **SSL/TLS** (Let's Encrypt automatic)
4. Coolify will handle HTTPS certificate automatically

### 6. Configure PostgreSQL Database

**Option A: Use Coolify's PostgreSQL**

1. Create new PostgreSQL service in Coolify
2. Copy the connection string
3. Update `DATABASE_URL` environment variable

**Option B: Use External Database**

- Keep your current database URL
- Ensure your VPS can connect to it (check firewall rules)

### 4. Environment Variables Checklist

Make sure these are set in your deployment platform:

- ✅ `DATABASE_URL` - Your production PostgreSQL connection
- ✅ `NEXTAUTH_SECRET` - Generate a new secure secret
- ✅ `NEXTAUTH_URL` - https://assignmentghar.com
- ✅ `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
- ✅ `GOOGLE_CLIENT_SECRET` - Your Google OAuth secret
- ✅ `GOOGLE_OAUTH_REDIRECT_URI` - https://assignmentghar.com/api/google/oauth/callback
- ✅ `EMAIL_SERVER_HOST` - smtp.gmail.com
- ✅ `EMAIL_SERVER_PORT` - 587
- ✅ `EMAIL_SERVER_USER` - assignmentghar1@gmail.com
- ✅ `EMAIL_SERVER_PASSWORD` - Your Gmail app password
- ✅ `EMAIL_FROM` - AssignmentGhar <assignmentghar1@gmail.com>
- ✅ `EMAIL_USER` - assignmentghar1@gmail.com
- ✅ `EMAIL_PASSWORD` - Your Gmail app password
- ✅ `NEXT_PUBLIC_APP_URL` - https://assignmentghar.com

### 5. Database Migration

Before deploying, ensure your production database is ready:

```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### 6. Build Test

Test your build locally before deploying:

```bash
pnpm build
pnpm start
```

### 7. Domain Configuration

Configure your domain DNS:

- Point A record to your hosting provider's IP
- Or add CNAME record as per provider instructions
- Wait for DNS propagation (can take up to 48 hours)

### 8. SSL Certificate

Most platforms (Vercel, Netlify, Railway) automatically provide SSL certificates.
Ensure HTTPS is enabled after deployment.

### 9. Socket.IO Production

For Socket.IO to work in production, ensure:

- WebSocket connections are allowed
- CORS is properly configured in `server.js`
- Your hosting platform supports WebSocket connections

### 10. Post-Deployment Checks

- ✅ Test login/registration
- ✅ Test Google OAuth
- ✅ Test chat functionality
- ✅ Test file uploads
- ✅ Test email sending
- ✅ Check all pages load correctly
- ✅ Verify responsive design on mobile
- ✅ Test dark mode

## 🔒 Security Recommendations

1. **Generate a new NEXTAUTH_SECRET** for production
2. **Don't commit `.env` file** to version control
3. **Use environment variables** in your deployment platform
4. **Enable rate limiting** for API routes
5. **Set up monitoring** and error tracking (e.g., Sentry)

## 📝 Quick Deploy Commands

### Vercel

```bash
vercel --prod
```

### Build for Production

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

---

**Your production URL:** https://assignmentghar.com
**Database:** Production PostgreSQL ready
**Email:** Gmail SMTP configured
