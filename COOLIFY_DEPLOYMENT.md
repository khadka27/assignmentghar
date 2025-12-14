# Coolify Deployment Guide - assignmentghar.com

## 🚀 Deploying Next.js App on Hostinger VPS with Coolify

---

## 📋 Prerequisites

- ✅ Hostinger VPS (minimum 2GB RAM)
- ✅ Coolify installed and running
- ✅ Domain `assignmentghar.com`
- ✅ SSH access to VPS
- ✅ PostgreSQL database ready

---

## Step 1: Access Coolify Dashboard

Login to your Coolify instance:

- URL: `https://your-coolify-domain.com` or `http://your-vps-ip:8000`
- Enter your Coolify credentials

---

## Step 2: Create New Application

1. Click **"+ New"** → **"Application"**
2. Choose **"Public Repository"** or connect GitHub
3. **Repository URL:** `https://github.com/khadka27/assignmentghar`
4. **Branch:** `main`
5. **Build Pack:** Select **"Node.js"**

---

## Step 3: Configure Build Settings

### Build Configuration:

**Install Command:**

```bash
npm install -g pnpm && pnpm install
```

**Build Command:**

```bash
npx prisma generate && npx prisma migrate deploy && pnpm build
```

**Start Command:**

```bash
node server.js
```

**Port:** `3001`

**Base Directory:** `/` (root)

---

## Step 4: Add Environment Variables

In Coolify, go to **Environment Variables** and add:

```env
# Database
DATABASE_URL=postgres://postgres:assignmentghardb%4020251212@e0wckskk00oww88wc8w08c00:5432/postgres?sslmode=require

# NextAuth
NEXTAUTH_SECRET=GENERATE_NEW_SECRET_HERE
NEXTAUTH_URL=https://assignmentghar.com

# Google OAuth
GOOGLE_CLIENT_ID=380246129941-bjplp5lk2i5d5lu2s6dcipld7dvrjv2n.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_OAUTH_REDIRECT_URI=https://assignmentghar.com/api/google/oauth/callback

# Email (Gmail)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=assignmentghar1@gmail.com
EMAIL_SERVER_PASSWORD=hlkvjbnmnwhfcssl
EMAIL_FROM=AssignmentGhar <assignmentghar1@gmail.com>
EMAIL_USER=assignmentghar1@gmail.com
EMAIL_PASSWORD=hlkvjbnmnwhfcssl

# Next.js
NEXT_PUBLIC_APP_URL=https://assignmentghar.com
NODE_ENV=production
```

### ⚠️ Generate New NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

Replace `GENERATE_NEW_SECRET_HERE` with the output.

---

## Step 5: Configure Domain

1. In Coolify, go to **Domains** tab
2. Click **"Add Domain"**
3. Enter: `assignmentghar.com`
4. Enable **"Generate SSL Certificate"** (Let's Encrypt)
5. Save

Coolify will automatically:

- Generate SSL certificate
- Configure HTTPS
- Set up auto-renewal

---

## Step 6: Configure DNS (Hostinger)

1. Login to **Hostinger Dashboard**
2. Go to **Domains** → `assignmentghar.com`
3. Click **"DNS / Name Servers"**
4. Add/Update records:

**A Record:**

```
Type: A
Name: @
Value: [Your VPS IP Address]
TTL: 3600
```

**WWW Subdomain (optional):**

```
Type: CNAME
Name: www
Value: assignmentghar.com
TTL: 3600
```

5. Save changes
6. Wait 5-30 minutes for DNS propagation

---

## Step 7: Configure Persistent Storage

For file uploads to persist across deployments:

1. In Coolify, go to **Volumes** tab
2. Click **"Add Volume"**
3. Configure:
   - **Source Path:** `/app/public/assignment`
   - **Mount Path:** `/app/public/assignment`
   - **Type:** Persistent
4. Save

---

## Step 8: Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate: **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client
4. Add **Authorized JavaScript origins:**
   - `https://assignmentghar.com`
5. Add **Authorized redirect URIs:**
   - `https://assignmentghar.com/api/google/oauth/callback`
6. Save changes

---

## Step 9: Deploy Application

1. Click **"Deploy"** button in Coolify
2. Watch the deployment logs
3. Wait for:
   - ✅ Dependencies installation
   - ✅ Prisma generation & migration
   - ✅ Build completion
   - ✅ Application start
4. Status should show **"Running"**

---

## Step 10: Verify Socket.IO Configuration

Check your `server.js` has proper CORS:

```javascript
const io = new Server(server, {
  cors: {
    origin: ["https://assignmentghar.com"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});
```

---

## ✅ Post-Deployment Checklist

Test everything:

- [ ] Visit `https://assignmentghar.com` (HTTPS working)
- [ ] User registration works
- [ ] User login works
- [ ] Google OAuth login works
- [ ] Chat messages send in real-time
- [ ] File uploads work (images, PDFs, Word docs)
- [ ] Email notifications working
- [ ] Assignment submissions work
- [ ] Admin panel accessible
- [ ] Mobile responsive design
- [ ] Dark mode works
- [ ] Socket.IO connection (check browser console)

---

## 🐛 Troubleshooting

### Build Failed

```bash
# Check Coolify build logs
# Common fixes:
1. Clear build cache and redeploy
2. Ensure all dependencies in package.json
3. Check Node.js version compatibility
4. Verify DATABASE_URL is accessible
```

### Application Not Starting

```bash
# Check if port 3001 is correct
# Verify server.js exists
# Check application logs in Coolify
# Ensure all env variables are set
```

### Database Connection Error

```bash
# Verify DATABASE_URL format
# Check if database is accessible from VPS
# Test connection: psql "your-database-url"
# Ensure SSL mode is correct
```

### Socket.IO Not Connecting

```bash
# Check CORS configuration
# Verify WebSocket not blocked by firewall
# Check browser console for errors
# Ensure correct domain in CORS origin
```

### File Uploads Failing

```bash
# Check persistent volume is mounted
# Verify public/assignment folder exists
# Check folder permissions: chmod 755
# Ensure 5MB file size limit respected
```

### SSL Certificate Issues

```bash
# Regenerate certificate in Coolify
# Check domain DNS points to correct IP
# Verify port 80 and 443 are open
# Wait for DNS propagation
```

### Google OAuth Error

```bash
# Verify callback URL matches exactly
# Check GOOGLE_CLIENT_ID is correct
# Ensure NEXTAUTH_URL has no trailing slash
# Clear browser cookies and try again
```

---

## 📊 Monitoring

### View Logs:

1. Go to application in Coolify
2. Click **"Logs"** tab
3. Real-time logs appear

### SSH Commands:

```bash
# Connect to VPS
ssh root@your-vps-ip

# View Docker containers
docker ps

# View specific container logs
docker logs <container-name> -f

# Check system resources
htop

# Check disk space
df -h

# Monitor network
netstat -tulpn
```

---

## 🔒 Security Best Practices

1. ✅ Generate strong `NEXTAUTH_SECRET`
2. ✅ Enable Coolify firewall rules
3. ✅ Set up automatic database backups
4. ✅ Install fail2ban on VPS
5. ✅ Keep system packages updated
6. ✅ Use SSH keys instead of passwords
7. ✅ Enable 2FA on Coolify
8. ✅ Monitor resource usage
9. ✅ Regular security audits
10. ✅ Keep dependencies updated

---

## 🔄 Updating Application

To deploy updates:

1. Push changes to GitHub `main` branch
2. In Coolify, click **"Redeploy"**
3. Or enable **"Auto Deploy"** for automatic deployments
4. Watch deployment logs
5. Test after deployment

---

## 📱 Quick Commands

### Generate Secret:

```bash
openssl rand -base64 32
```

### Test Build Locally:

```bash
pnpm install
pnpm build
pnpm start
```

### Database Migration:

```bash
npx prisma migrate deploy
```

### Check Port:

```bash
netstat -tulpn | grep 3001
```

---

## 📞 Support

**Production URL:** https://assignmentghar.com  
**Email:** assignmentghar1@gmail.com  
**VPS:** Hostinger  
**Platform:** Coolify  
**Database:** PostgreSQL  
**SSL:** Let's Encrypt

---

## 🎉 Deployment Complete!

Your application is now live at **https://assignmentghar.com**

Monitor your application regularly and keep backups of:

- Database
- Environment variables
- Uploaded files in `/public/assignment`

Good luck with your deployment! 🚀
