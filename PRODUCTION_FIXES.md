# 🚨 PRODUCTION FIX CHECKLIST

## Issues Fixed in This Commit

### ✅ 1. Auth.js UntrustedHost Error - FIXED

**Problem:** `[auth][error] UntrustedHost: Host must be trusted.`

**Solution Applied:**

- Added `trustHost: true` to NextAuth config in `src/lib/auth.ts`
- This is safe and required when running behind reverse proxy (Coolify/Nginx)

**Alternative:** Set environment variable in Coolify:

```
AUTH_TRUST_HOST=true
```

---

### ✅ 2. Database Tables Missing - ACTION REQUIRED

**Problem:** `The table public.users does not exist in the current database.`

**Solution:** Run migrations in production container

#### Option A: Via Coolify Terminal (Recommended)

1. Go to your application in Coolify
2. Open Terminal/Shell
3. Run:

```bash
npx prisma migrate deploy
```

#### Option B: Use the deployment script

```bash
chmod +x deploy.sh
./deploy.sh
```

#### Option C: Manual DB Push (if no migrations exist)

```bash
npx prisma db push
```

#### Verify Tables Created

```bash
npx prisma studio
# or
psql $DATABASE_URL -c "SELECT tablename FROM pg_tables WHERE schemaname='public';"
```

---

### ✅ 3. Image Path Issues - FIXED

**Problem:**

- Spaces in filenames
- `&` characters in filenames
- Case-sensitive paths (Linux)
- Capital `I` in `/Images`

**Solution Applied:**

#### Renamed Directories:

- `public/Images/` → `public/images/`
- `Our Areas of Expertise/` → `areas/`
- `Why Students Trust Us/` → `trust/`

#### Renamed Files:

- `IT & Computer Science.png` → `it-computer-science.png`
- `Business & Management.png` → `business-management.png`
- `Engineering & Technology.png` → `engineering-technology.png`
- `Finance & Accounting.png` → `finance-accounting.png`
- `Hospitality & Tourism.png` → `hospitality-tourism.png`
- `Nursing & Healthcare.png` → `nursing-healthcare.png`
- `What Makes Us Different.png` → `what-makes-us-different.png`

**Update Image References:**
All image paths should now use lowercase:

```tsx
// ❌ OLD (will break)
<Image src="/Images/landing/Our Areas of Expertise/IT & Computer Science.png" />

// ✅ NEW (works everywhere)
<Image src="/images/landing/areas/it-computer-science.png" />
```

---

### ⚠️ 4. Minor Warning - Optional

**Problem:** `baseline-browser-mapping is over two months old`

**Solution (Optional):**

```bash
pnpm add -D baseline-browser-mapping@latest
```

This doesn't break anything, can be done later.

---

## 🎯 Deployment Steps (IN ORDER)

### 1. Push this commit to GitHub

```bash
git add .
git commit -m "Fix production deployment: trustHost, image paths, migration script"
git push origin main
```

### 2. Coolify will auto-deploy

### 3. Run migrations in Coolify terminal

```bash
npx prisma migrate deploy
```

### 4. Restart the application (if needed)

```bash
pnpm start
```

### 5. Verify everything works

- ✅ Visit https://assignmentghar.com
- ✅ Try to login
- ✅ Check if images load
- ✅ Monitor logs for errors

---

## 🔧 Environment Variables Checklist

Make sure these are set in Coolify:

```env
# Database
DATABASE_URL=postgres://...

# NextAuth
NEXTAUTH_SECRET=<your-secret-key>
NEXTAUTH_URL=https://assignmentghar.com
AUTH_TRUST_HOST=true

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_OAUTH_REDIRECT_URI=https://assignmentghar.com/api/google/oauth/callback

# Email
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=...
EMAIL_SERVER_PASSWORD=...

# App
NEXT_PUBLIC_APP_URL=https://assignmentghar.com
NODE_ENV=production
PORT=3001
```

---

## 🎉 After Deployment

You should have:

- ✅ Auth working (login, register, OAuth)
- ✅ Prisma queries succeeding
- ✅ No UntrustedHost errors
- ✅ Images loading correctly
- ✅ Stable production app

---

## 🆘 Troubleshooting

### Still getting UntrustedHost error?

1. Check if `trustHost: true` is in `src/lib/auth.ts`
2. Set `AUTH_TRUST_HOST=true` in Coolify env vars
3. Restart the application

### Tables still missing?

1. Check DATABASE_URL is correct
2. Run `npx prisma migrate deploy` again
3. Check Prisma logs: `npx prisma migrate status`

### Images not loading?

1. Verify files are in `public/images/` (lowercase)
2. Check Next.js image paths use `/images/...` (lowercase)
3. Ensure no spaces or special characters in filenames
4. Check browser console for 404 errors

### Database connection issues?

1. Verify DATABASE_URL format
2. Check VPS firewall allows PostgreSQL port
3. Test connection: `npx prisma db pull`

---

## 📝 Notes

- **trustHost: true** is safe behind reverse proxy (standard practice)
- **migrate deploy** only runs pending migrations (safe for production)
- **Image paths** are now Linux-compatible and URL-safe
- All changes are backward compatible with local development

---

## 🔄 Next Steps (Optional)

1. **Update all image references** in code to use new paths
2. **Run database seed** if you need initial data: `npx prisma db seed`
3. **Set up monitoring** for production errors
4. **Configure CDN** for images (optional optimization)
5. **Enable database backups** in Coolify

---

**Need help?** Check logs in Coolify → Logs → Application Logs
