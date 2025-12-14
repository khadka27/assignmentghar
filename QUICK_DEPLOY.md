# 🚀 Quick Deployment Checklist - Hostinger VPS + Coolify

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Ready

```env
DATABASE_URL=postgres://postgres:assignmentghardb%4020251212@e0wckskk00oww88wc8w08c00:5432/postgres?sslmode=require
NEXTAUTH_SECRET=[GENERATE NEW - see below]
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

**Generate NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

### 2. Code Changes Made ✅

- ✅ `server.js` - Updated for production (hostname: 0.0.0.0, port: 3001)
- ✅ `server.js` - CORS configured for assignmentghar.com
- ✅ `.env` - All URLs updated to https://assignmentghar.com
- ✅ `Dockerfile` - Created for optimized deployment
- ✅ `.dockerignore` - Created to reduce image size

---

## 📋 Deployment Steps

### Step 1: Hostinger DNS Configuration (5 min)

1. Login to Hostinger Dashboard
2. Go to Domains → assignmentghar.com → DNS/Name Servers
3. Add A Record:
   ```
   Type: A
   Name: @
   Value: [Your VPS IP]
   TTL: 3600
   ```
4. Save and wait 5-30 minutes

### Step 2: Google OAuth Update (2 min)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials → Edit OAuth Client
3. Add origins: `https://assignmentghar.com`
4. Add redirect: `https://assignmentghar.com/api/google/oauth/callback`
5. Save

### Step 3: Coolify Application Setup (10 min)

**In Coolify Dashboard:**

1. **Create New Application**

   - Click "+ New" → "Application"
   - Type: Public Repository
   - URL: `https://github.com/khadka27/assignmentghar`
   - Branch: `main`

2. **Build Settings**

   - Build Pack: Dockerfile (or Node.js)
   - Port: 3001

   **If using Node.js build pack:**

   - Install: `npm install -g pnpm && pnpm install`
   - Build: `npx prisma generate && npx prisma migrate deploy && pnpm build`
   - Start: `node server.js`

3. **Environment Variables**

   - Copy all variables from checklist above
   - Paste in Coolify Environment Variables section
   - **Don't forget to generate new NEXTAUTH_SECRET!**

4. **Domain Configuration**

   - Go to Domains tab
   - Add: `assignmentghar.com`
   - Enable SSL (Let's Encrypt)
   - Save

5. **Persistent Storage**

   - Go to Volumes tab
   - Add volume:
     - Source: `/app/public/assignment`
     - Mount: `/app/public/assignment`
   - Save

6. **Deploy**
   - Click "Deploy" button
   - Watch logs
   - Wait for "Running" status

---

## 🧪 Testing Checklist (After Deployment)

Visit: https://assignmentghar.com

- [ ] Homepage loads with HTTPS
- [ ] Register new user
- [ ] Login works
- [ ] Google OAuth login
- [ ] Navigate to chat page
- [ ] Send chat message (real-time)
- [ ] Upload image in chat
- [ ] Upload PDF in chat
- [ ] Download uploaded file
- [ ] Image preview modal works
- [ ] Submit assignment
- [ ] Admin login
- [ ] Admin chat works
- [ ] Dark mode toggle
- [ ] Mobile responsive
- [ ] Check browser console for errors

---

## 🐛 Common Issues & Solutions

### Issue: Build Failed

**Solution:**

```bash
# In Coolify, check logs
# Common fixes:
1. Clear cache and redeploy
2. Check all env variables are set
3. Verify DATABASE_URL is accessible
4. Check Node.js version (should be 20+)
```

### Issue: Database Connection Error

**Solution:**

```bash
# Verify DATABASE_URL format
# Test from VPS:
psql "postgres://postgres:assignmentghardb%4020251212@e0wckskk00oww88wc8w08c00:5432/postgres?sslmode=require"

# Check firewall rules allow database access
```

### Issue: Socket.IO Not Working

**Solution:**

```bash
# Check browser console for WebSocket errors
# Verify CORS in server.js includes your domain
# Ensure WebSocket not blocked by firewall
# Check Coolify allows WebSocket connections
```

### Issue: Google OAuth Error

**Solution:**

```bash
# Verify redirect URI matches exactly:
https://assignmentghar.com/api/google/oauth/callback

# Check NEXTAUTH_URL has no trailing slash
# Clear browser cookies and retry
```

### Issue: File Uploads Not Saving

**Solution:**

```bash
# Verify persistent volume is mounted
# Check folder permissions
# SSH to container:
docker exec -it [container-id] sh
cd /app/public/assignment
ls -la

# Fix permissions if needed:
chmod 755 /app/public/assignment
```

### Issue: SSL Certificate Not Working

**Solution:**

```bash
# In Coolify, regenerate SSL certificate
# Verify DNS points to correct VPS IP
# Check ports 80 and 443 are open
# Wait for DNS propagation (up to 48h)
```

---

## 📊 Monitoring Commands

### View Logs (Coolify Dashboard)

1. Go to Application
2. Click "Logs" tab
3. Real-time logs appear

### SSH Monitoring

```bash
# Connect to VPS
ssh root@your-vps-ip

# View running containers
docker ps

# View specific container logs
docker logs [container-name] -f

# Check resources
htop

# Check disk space
df -h

# Check network connections
netstat -tulpn | grep 3001

# Check if app is responding
curl http://localhost:3001
```

---

## 🔄 Updating Application

### Auto-Deploy (Recommended)

1. In Coolify, enable "Auto Deploy on Push"
2. Push changes to GitHub main branch
3. Coolify automatically deploys

### Manual Deploy

1. Push changes to GitHub
2. Go to Coolify Dashboard
3. Click "Redeploy"
4. Watch logs
5. Test after deployment

---

## 🔒 Security Checklist

- [ ] New NEXTAUTH_SECRET generated
- [ ] Coolify firewall enabled
- [ ] Database backups scheduled
- [ ] fail2ban installed on VPS
- [ ] SSH keys only (no password login)
- [ ] System packages updated
- [ ] Monitoring set up
- [ ] Rate limiting configured
- [ ] HTTPS enforced
- [ ] Environment variables secured

---

## 📞 Quick Reference

**Production URL:** https://assignmentghar.com  
**Admin Email:** assignmentghar1@gmail.com  
**Platform:** Hostinger VPS + Coolify  
**Database:** PostgreSQL (Production)  
**Port:** 3001  
**SSL:** Let's Encrypt (Auto-renewal)  
**Node Version:** 20+  
**Package Manager:** pnpm

---

## 🎯 Next Steps After Deployment

1. **Set up monitoring** (Uptime Robot, Better Stack, etc.)
2. **Configure backups** (Database + Files)
3. **Set up error tracking** (Sentry)
4. **Add analytics** (Google Analytics, Plausible)
5. **Performance monitoring** (New Relic, DataDog)
6. **CDN for static assets** (Cloudflare)
7. **Email monitoring** (Track delivery rates)
8. **User feedback system**

---

## 📚 Documentation Files

- `COOLIFY_DEPLOYMENT.md` - Full deployment guide
- `DEPLOYMENT_GUIDE.md` - General deployment info
- `README.md` - Project overview
- `docs/` - Additional documentation

---

## ✅ Deployment Complete!

Your application should now be live at:

## 🌐 https://assignmentghar.com

Test all features and monitor for 24-48 hours to ensure stability.

**Good luck! 🚀**
