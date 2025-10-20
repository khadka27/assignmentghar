# 🚀 Quick Start Guide - Role-Based Authentication

## ✨ What's New?

Your AssignmentGhar platform now has **complete role-based authentication** with:

- 👑 **Admin Dashboard** at `/admin`
- 🎓 **Expert Dashboard** at `/expert`
- 📚 **Student Access** at `/` (main website)
- 🔒 **Route Protection** with middleware
- 🍞 **Toast Notifications** for all actions
- 📱 **Mobile Responsive** design
- 🎨 **Blue/Purple Theme** (नीलो/बैजनी)

---

## 🏃 How to Start

### 1. **Start the Development Server**

```bash
pnpm dev
```

Server will run at: **http://localhost:3000**

---

## 🧪 Test Different User Roles

### 👑 **Test Admin Dashboard**

**Login Credentials:**

```
Email: admin@assignmentghar.com
Password: Admin@123
```

**Expected Behavior:**

1. Go to http://localhost:3000/login
2. Enter admin credentials
3. Click "Sign In"
4. See toast: "Welcome Admin! 👑"
5. **Automatically redirects to** `/admin`
6. See admin dashboard with:
   - Total Users: 156
   - Active Assignments: 45
   - Revenue: NPR 256,000
   - Quick Actions buttons
   - Recent Activity feed

---

### 🎓 **Test Expert Dashboard**

**First, Create an Expert Account:**

Option 1: Register new user and update role in database

```sql
-- Update existing user to EXPERT
UPDATE users
SET role = 'EXPERT'
WHERE email = 'your-email@example.com';
```

Option 2: Use seed script to create expert

```typescript
// Add to prisma/seed.ts
await prisma.user.create({
  data: {
    name: "Expert Prakash",
    username: "expertprakash",
    email: "expert@assignmentghar.com",
    password: await bcrypt.hash("Expert@123", 12),
    role: "EXPERT",
    isVerified: true,
  },
});
```

Then run: `npx prisma db seed`

**Expected Behavior:**

1. Login with expert credentials
2. See toast: "Welcome Expert! 🎓"
3. **Automatically redirects to** `/expert`
4. See expert dashboard with:
   - Active Assignments: 12
   - Completed: 45
   - Earnings: NPR 12,500
   - Rating: 4.8/5.0
   - Recent assignments

---

### 📚 **Test Student Access**

**Option 1: Register New Student**

1. Go to http://localhost:3000/login
2. Click "Create Account" tab
3. Fill registration form:
   - Name: Your Name
   - Username: yourusername
   - Email: your@email.com
   - Password: YourPass@123
4. Click "Create Account"
5. Get OTP in email
6. Verify OTP
7. Login with credentials

**Expected Behavior:**

1. Login successful
2. See toast: "Welcome Student! 📚"
3. **Automatically redirects to** `/` (homepage)
4. Access main website features

**Option 2: Use Existing Student**

- Any user without ADMIN or EXPERT role
- Redirects to homepage after login

---

## 🔒 Test Route Protection

### **Try Accessing Protected Routes Without Login:**

1. **Visit Admin Dashboard** (not logged in):

   ```
   http://localhost:3000/admin
   ```

   **Expected:** Redirects to `/login?callbackUrl=/admin`

2. **Visit Expert Dashboard** (not logged in):
   ```
   http://localhost:3000/expert
   ```
   **Expected:** Redirects to `/login?callbackUrl=/expert`

### **Try Accessing Wrong Dashboard (Logged In):**

1. **Student tries Admin Dashboard:**

   - Login as student
   - Visit: http://localhost:3000/admin
   - **Expected:** Redirects to `/` (homepage)
   - Toast: "Access Denied"

2. **Student tries Expert Dashboard:**

   - Login as student
   - Visit: http://localhost:3000/expert
   - **Expected:** Redirects to `/` (homepage)
   - Toast: "Access Denied"

3. **Expert tries Admin Dashboard:**
   - Login as expert
   - Visit: http://localhost:3000/admin
   - **Expected:** Redirects to `/` (homepage)
   - Toast: "Access Denied"

### **Already Logged In, Try Login Page:**

1. **Admin visits login page:**

   - Already logged in as admin
   - Visit: http://localhost:3000/login
   - **Expected:** Auto-redirects to `/admin`

2. **Expert visits login page:**

   - Already logged in as expert
   - Visit: http://localhost:3000/login
   - **Expected:** Auto-redirects to `/expert`

3. **Student visits login page:**
   - Already logged in as student
   - Visit: http://localhost:3000/login
   - **Expected:** Auto-redirects to `/`

---

## 📱 Test Mobile Responsiveness

### **Desktop View** (> 1024px):

- Open dashboard in full screen
- See 4-column grid layout
- All stats visible side by side
- Wide cards with full text

### **Tablet View** (640-1024px):

- Resize browser to tablet size
- See 2-column grid layout
- Compact but readable
- Some text abbreviated

### **Mobile View** (< 640px):

- Resize to phone width or use DevTools
- See 1-column stacked layout
- Large touch-friendly buttons
- Compact header
- "Settings" text hidden, only icon shown
- Bottom spacing for keyboard

**Test on Real Devices:**

```bash
# Your dev server is also available at:
http://192.168.100.7:3000

# Open this on your phone/tablet connected to same WiFi
```

---

## 🍞 Test Toast Notifications

### **Login Toasts:**

1. **Successful Login:**

   - Admin: "Welcome Admin! 👑"
   - Expert: "Welcome Expert! 🎓"
   - Student: "Welcome Student! 📚"

2. **Login Errors:**
   - Wrong password: "Login Failed - Invalid credentials"
   - Email not verified: "Login Failed - Please verify your email first"
   - Empty fields: Form validation errors

### **Access Control Toasts:**

1. **Unauthorized Access:**
   - Student tries /admin
   - Toast: "Access Denied - You don't have permission to access this page"

### **Registration Toasts:**

1. **Username taken:**
   - Real-time: Red X with "Username is already taken"
2. **Email taken:**
   - Real-time: Red X with "Email is already registered"
3. **Username available:**
   - Real-time: Green ✓ with "Username is available"

---

## 🎨 Test Theme Features

### **Test Dark Mode:**

1. Look for theme toggle in navbar
2. Switch between light/dark modes
3. **Check dashboards adapt:**
   - Background gradients change
   - Text colors invert
   - Cards remain readable
   - All icons visible

### **Test Hover Effects:**

1. **Cards:**

   - Hover over stat cards
   - Should lift up (-translateY-1)
   - Shadow increases

2. **Buttons:**

   - Hover over action buttons
   - Background darkens
   - Smooth 300ms transition

3. **Activity Items:**
   - Hover over recent activity
   - Background lightens
   - Cursor changes to pointer

---

## 🐛 Common Issues & Solutions

### **Issue: Can't access admin dashboard**

**Solution:**

```sql
-- Check user role in database
SELECT email, role FROM users WHERE email = 'admin@assignmentghar.com';

-- If role is not ADMIN, update it:
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@assignmentghar.com';
```

### **Issue: Middleware not working**

**Solution:**

```bash
# Restart dev server
# Stop with Ctrl+C, then:
pnpm dev
```

### **Issue: Toast not showing**

**Solution:**

- Check if `<Toaster />` is in `src/app/layout.tsx`
- Check browser console for errors
- Try clearing browser cache

### **Issue: Session not persisting**

**Solution:**

```bash
# Check .env file has:
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### **Issue: Email OTP not sending**

**Solution:**

- Update email credentials in `.env`
- Or skip OTP for testing:

```sql
UPDATE users SET isVerified = true WHERE email = 'your@email.com';
```

---

## 📊 Dashboard Features Breakdown

### **Admin Dashboard Features:**

- 📊 4 main stat cards
- 📈 Growth percentage indicator
- ⚡ 3 quick action buttons
- ⚠️ Pending items alerts (2 types)
- 🕒 Recent activity feed (4 items)
- 🎨 Blue/Purple gradient theme
- 🔓 Logout button
- ⚙️ Settings button
- 👑 Admin badge in header

### **Expert Dashboard Features:**

- 📊 6 detailed stat cards
- ⭐ Rating badge in header
- 💰 Earnings tracking
- ⏱️ Response time metric
- 📝 Pending reviews counter
- 🕒 Recent activity feed
- 🎨 Purple-focused theme
- 🔓 Logout button
- ⚙️ Settings button
- 🎓 Expert badge

---

## 🔑 Default Credentials Summary

```plaintext
┌──────────────────────────────────────────────┐
│           AssignmentGhar Accounts            │
├──────────────────────────────────────────────┤
│ ADMIN ACCOUNT                                │
│ Email:    admin@assignmentghar.com          │
│ Password: Admin@123                          │
│ Role:     ADMIN                              │
│ Access:   /admin dashboard                   │
├──────────────────────────────────────────────┤
│ EXPERT ACCOUNT (Create manually)             │
│ Email:    expert@assignmentghar.com         │
│ Password: Expert@123                         │
│ Role:     EXPERT                             │
│ Access:   /expert dashboard                  │
├──────────────────────────────────────────────┤
│ STUDENT ACCOUNT (Register on site)          │
│ Email:    your@email.com                    │
│ Password: YourPass@123                       │
│ Role:     STUDENT (default)                  │
│ Access:   / (main website)                   │
└──────────────────────────────────────────────┘
```

---

## ✅ Success Checklist

Test all these scenarios:

- [ ] Admin login redirects to `/admin`
- [ ] Expert login redirects to `/expert`
- [ ] Student login redirects to `/`
- [ ] Can't access `/admin` without ADMIN role
- [ ] Can't access `/expert` without EXPERT role
- [ ] Already logged in user redirects from `/login`
- [ ] Toast shows on successful login
- [ ] Toast shows on failed login
- [ ] Toast shows on access denied
- [ ] Mobile view shows 1 column
- [ ] Tablet view shows 2 columns
- [ ] Desktop view shows 4 columns
- [ ] Hover effects work on cards
- [ ] Logout button works
- [ ] Dark mode works
- [ ] All icons load properly
- [ ] Statistics display correctly
- [ ] Recent activity shows

---

## 🎯 Next: Start Testing!

```bash
# 1. Start server
pnpm dev

# 2. Open browser
http://localhost:3000/login

# 3. Login as admin
admin@assignmentghar.com / Admin@123

# 4. Explore admin dashboard

# 5. Logout and test expert

# 6. Register as student and test

# 7. Try accessing wrong dashboards

# 8. Test on mobile device
```

---

## 📚 Documentation Files

- `ROLE_BASED_AUTH.md` - Complete implementation guide
- `AUTH_SETUP.md` - Authentication system details
- `THEME_DOCUMENTATION.md` - Color scheme & UI guide
- `DATABASE_SETUP.md` - Database & Prisma setup
- `QUICK_START.md` - This file!

---

**🎉 Everything is ready! Start testing now!**

**Built with 💙💜 - Blue (नीलो) + Purple (बैजनी) = AssignmentGhar Magic!**
