# 🧪 Registration Workflow Testing Guide

**AssignmentGhar - User Registration & OTP Verification**  
Last Updated: October 22, 2025

---

## 📋 Quick Test Checklist

### ✅ Pre-Testing Setup

- [ ] Server running on `http://localhost:3000`
- [ ] Database connected (PostgreSQL)
- [ ] Email service configured (SMTP credentials in `.env`)
- [ ] Test email account ready
- [ ] Browser DevTools open (Console tab)

---

## 🎯 Test Scenarios

### **Test 1: Happy Path - Successful Registration**

**Goal:** Complete full registration workflow from start to finish

**Steps:**

1. Navigate to `http://localhost:3000/register`
2. Fill in registration form:
   - **Name:** John Doe
   - **Email:** your-test-email@gmail.com
   - **Password:** Test@12345
   - **Confirm Password:** Test@12345
3. Click **"Create Account"** button
4. **Expected:**
   - ✅ Toast: "✅ Account Created Successfully!"
   - ✅ Page transitions to OTP verification step
   - ✅ Email sent to inbox within 30 seconds
5. Check email inbox:
   - **Subject:** Your AssignmentGhar Verification Code
   - **Body:** Contains 6-digit code (e.g., 123456)
6. Enter OTP code in verification form
7. Click **"Verify Email"** button
8. **Expected:**
   - ✅ Toast: "Email Verified! Redirecting..."
   - ✅ Auto-redirect to `/login` after 1.5 seconds
9. Login with new credentials:
   - **Email:** your-test-email@gmail.com
   - **Password:** Test@12345
10. **Expected:**
    - ✅ Successfully logged in
    - ✅ Redirected to dashboard/home page

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 2: Password Strength Indicator**

**Goal:** Verify password strength visual feedback

**Steps:**

1. Navigate to registration page
2. Click in password field
3. Type slowly: `weak`
   - **Expected:**
     - ❌ 1 red bar active
     - ❌ Text: "Weak password"
     - ❌ Helper text visible
4. Type: `Medium8`
   - **Expected:**
     - ⚠️ 2 yellow bars active
     - ⚠️ Text: "Medium strength password"
5. Type: `Strong@Pass123`
   - **Expected:**
     - ✅ 3 green bars active
     - ✅ Text: "Strong password! ✓"

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 3: Email Validation Feedback**

**Goal:** Real-time email format validation

**Steps:**

1. Navigate to registration page
2. Click in email field
3. Type: `invalid-email`
   - **Expected:**
     - ❌ Red border
     - ❌ Red X icon
     - ❌ Error text: "Please enter a valid email address"
4. Type: `test@example`
   - **Expected:**
     - ❌ Still invalid (missing TLD)
5. Type: `test@example.com`
   - **Expected:**
     - ✅ Green border
     - ✅ Green checkmark icon
     - ✅ No error text

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 4: Password Mismatch Validation**

**Goal:** Verify password confirmation works

**Steps:**

1. Fill registration form:
   - **Name:** Test User
   - **Email:** test@example.com
   - **Password:** Password123
   - **Confirm Password:** Password456
2. Click **"Create Account"**
3. **Expected:**
   - ❌ Toast error: "Passwords do not match"
   - ❌ Form not submitted
   - ❌ Still on registration page

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 5: Email Already Registered**

**Goal:** Handle duplicate email registration

**Steps:**

1. Use email that's already registered and verified
2. Fill registration form with existing email
3. Click **"Create Account"**
4. **Expected:**
   - ❌ Toast error: "Email Already Registered"
   - ❌ Message: "This email is already registered. Please login or use a different email."
   - ❌ Form not submitted

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 6: Invalid OTP Code**

**Goal:** Verify OTP validation works

**Steps:**

1. Complete registration (receive OTP email)
2. On OTP verification page, enter: `000000`
3. Click **"Verify Email"**
4. **Expected:**
   - ❌ Toast error: "Verification Failed"
   - ❌ Message: "Invalid verification code"
   - ❌ OTP input cleared or highlighted
5. Enter correct OTP
6. **Expected:**
   - ✅ Verification succeeds

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 7: OTP Expiry (10 Minutes)**

**Goal:** Verify OTP expires after 10 minutes

**Steps:**

1. Complete registration
2. Wait 10+ minutes (or manually change `otpExpiry` in database)
3. Enter OTP code
4. Click **"Verify Email"**
5. **Expected:**
   - ❌ Toast error: "Verification code has expired"
   - ❌ Prompt to resend OTP

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 8: Resend OTP Functionality**

**Goal:** Verify resend OTP works with cooldown

**Steps:**

1. Complete registration (receive OTP)
2. On verification page, click **"Resend OTP"** immediately
3. **Expected:**
   - ❌ Button disabled
   - ⏱️ Shows countdown: "Resend in 60s"
4. Wait for countdown to reach 0
5. Click **"Resend OTP"** again
6. **Expected:**
   - ✅ Toast: "OTP Resent!"
   - ✅ New email sent
   - ⏱️ Countdown resets to 60s
7. Check email for new OTP
8. Verify with new OTP code

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 9: Unverified Email Re-registration**

**Goal:** Allow re-registration for unverified accounts

**Steps:**

1. Register with email: test-unverified@example.com
2. **DON'T verify** - close browser
3. Later, try registering again with same email
4. **Expected:**
   - ✅ Allows re-registration
   - ✅ Updates user data
   - ✅ Sends new OTP
   - ✅ Toast: "Verification required. A new code has been sent..."

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 10: Google Sign In**

**Goal:** Alternative registration method

**Steps:**

1. Navigate to registration page
2. Click **"Sign up with Google"** button
3. **Expected:**
   - 🔄 Redirects to Google OAuth
   - 📧 Select Google account
   - ✅ Auto-creates verified account
   - ✅ Redirects to dashboard (no OTP needed)

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 11: Change Email During Verification**

**Goal:** Allow user to fix wrong email

**Steps:**

1. Register with email: wrong@example.com
2. Reach OTP verification page
3. Click **"← Change email address"**
4. **Expected:**
   - ✅ Returns to registration form
   - ✅ Email field still filled
   - ✅ Can edit email
5. Change email to: correct@example.com
6. Submit form again
7. **Expected:**
   - ✅ New OTP sent to correct email

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 12: Browser Refresh During OTP Step**

**Goal:** Verify workflow survives page refresh

**Steps:**

1. Complete registration
2. On OTP verification page, refresh browser (F5)
3. **Expected:**
   - ❌ Loses state (returns to registration page)
   - ❌ This is expected behavior (state in component)
4. Register again with same email
5. **Expected:**
   - ✅ Allows re-registration for unverified email
   - ✅ Sends new OTP

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 13: Email Delivery & Formatting**

**Goal:** Verify email arrives correctly formatted

**Checks:**

- [ ] Email arrives within 30 seconds
- [ ] Subject line correct
- [ ] HTML formatting displays properly
- [ ] OTP code is bold and centered
- [ ] AssignmentGhar logo/branding present
- [ ] Expiry warning visible (10 minutes)
- [ ] Security tips included
- [ ] Footer with company info

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 14: Welcome Email After Verification**

**Goal:** Confirm welcome email sent

**Steps:**

1. Complete registration
2. Verify OTP successfully
3. Check email inbox
4. **Expected:**
   - ✅ Second email received
   - **Subject:** Welcome to AssignmentGhar!
   - **Body:** Welcome message, next steps
   - ✅ Professional formatting

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 15: Mobile Responsiveness**

**Goal:** Ensure registration works on mobile

**Steps:**

1. Open DevTools (F12)
2. Toggle device toolbar (mobile view)
3. Select: iPhone 12 Pro
4. Navigate to registration page
5. **Check:**
   - [ ] Form fits screen width
   - [ ] All fields accessible
   - [ ] Buttons properly sized
   - [ ] OTP input works with numeric keyboard
   - [ ] Animations smooth
   - [ ] No horizontal scroll

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 16: Accessibility (a11y)**

**Goal:** Verify screen reader compatibility

**Checks:**

- [ ] All form fields have labels
- [ ] Proper ARIA attributes
- [ ] Keyboard navigation works (Tab key)
- [ ] Error messages announced
- [ ] Success messages announced
- [ ] Focus states visible

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 17: Dark Mode Support**

**Goal:** Test dark theme appearance

**Steps:**

1. Enable dark mode in browser/OS
2. Navigate to registration page
3. **Check:**
   - [ ] Form readable in dark mode
   - [ ] Proper contrast ratios
   - [ ] Icons visible
   - [ ] Toast notifications styled correctly

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 18: Error Recovery**

**Goal:** Handle network/server errors gracefully

**Steps:**

1. Stop the server
2. Try to submit registration form
3. **Expected:**
   - ❌ Toast error: "Something went wrong"
   - ❌ Form not cleared
   - ❌ User can retry
4. Restart server
5. Submit form again
6. **Expected:**
   - ✅ Works normally

**Result:** ✅ PASS / ❌ FAIL

---

## 🔍 Browser Console Checks

### Registration Submission

**Expected Console Output:**

```
// No errors
// Successful API call:
POST /api/auth/register 201 (Created)
```

### OTP Verification

**Expected Console Output:**

```
// No errors
// Successful API call:
POST /api/auth/verify-otp 200 (OK)
```

### Resend OTP

**Expected Console Output:**

```
// No errors
POST /api/auth/resend-otp 200 (OK)
```

**Check for:**

- ❌ No JavaScript errors
- ❌ No 404 errors
- ❌ No failed network requests
- ✅ All API calls return proper status codes

---

## 📧 Email Service Testing

### Gmail Setup (if using Gmail)

1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Generate App Password
4. Use in `.env`:
   ```env
   EMAIL_SERVER_USER=your-email@gmail.com
   EMAIL_SERVER_PASSWORD=your-app-password
   ```

### Email Delivery Checks

**Test email delivery:**

```bash
# Check server logs for email sending
# Should see: "OTP email sent: <messageId>"
```

**If emails not arriving:**

1. Check spam/junk folder
2. Verify SMTP credentials
3. Check email service logs
4. Test with different email provider

---

## 🗄️ Database Verification

### Check User Created

```sql
-- Open your database client
SELECT id, name, email, isVerified, otp, otpExpiry, createdAt
FROM "User"
WHERE email = 'your-test-email@gmail.com';
```

**Before Verification:**

```
isVerified: false
otp: "123456" (6 digits)
otpExpiry: 2025-10-22T10:10:00.000Z (10 min in future)
emailVerified: null
```

**After Verification:**

```
isVerified: true
otp: null (cleared)
otpExpiry: null (cleared)
emailVerified: 2025-10-22T10:05:00.000Z (timestamp)
```

---

## 🚨 Common Issues & Solutions

### Issue 1: OTP Email Not Received

**Symptoms:**

- Registration succeeds
- No email arrives
- Server logs show no errors

**Solutions:**

1. Check spam/junk folder
2. Verify email credentials in `.env`
3. Check server logs: `"OTP email sent:"`
4. Test with different email provider
5. Check SMTP settings (port, host)

---

### Issue 2: "Email Already Registered" Error

**Symptoms:**

- Can't register with email
- Error says email taken
- Used for testing before

**Solutions:**

1. Delete test user from database:
   ```sql
   DELETE FROM "User" WHERE email = 'test@example.com';
   ```
2. Or use different test email
3. Or verify existing account and login

---

### Issue 3: OTP Verification Fails

**Symptoms:**

- Correct OTP entered
- Says "Invalid verification code"

**Solutions:**

1. Check database - verify OTP matches
2. Ensure OTP not expired (< 10 min)
3. Check for extra spaces in input
4. Verify email matches exactly
5. Try resending OTP

---

### Issue 4: Redirect Not Working

**Symptoms:**

- Verification succeeds
- Doesn't redirect to login
- Stays on verification page

**Solutions:**

1. Check browser console for errors
2. Verify `/login` route exists
3. Clear browser cache
4. Check router configuration

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________
Browser: ___________
Device: ___________

Test 1 (Happy Path): ✅ PASS / ❌ FAIL
Test 2 (Password Strength): ✅ PASS / ❌ FAIL
Test 3 (Email Validation): ✅ PASS / ❌ FAIL
Test 4 (Password Mismatch): ✅ PASS / ❌ FAIL
Test 5 (Duplicate Email): ✅ PASS / ❌ FAIL
Test 6 (Invalid OTP): ✅ PASS / ❌ FAIL
Test 7 (OTP Expiry): ✅ PASS / ❌ FAIL
Test 8 (Resend OTP): ✅ PASS / ❌ FAIL
Test 9 (Re-registration): ✅ PASS / ❌ FAIL
Test 10 (Google Sign In): ✅ PASS / ❌ FAIL
Test 11 (Change Email): ✅ PASS / ❌ FAIL
Test 12 (Refresh): ✅ PASS / ❌ FAIL
Test 13 (Email Delivery): ✅ PASS / ❌ FAIL
Test 14 (Welcome Email): ✅ PASS / ❌ FAIL
Test 15 (Mobile): ✅ PASS / ❌ FAIL
Test 16 (Accessibility): ✅ PASS / ❌ FAIL
Test 17 (Dark Mode): ✅ PASS / ❌ FAIL
Test 18 (Error Recovery): ✅ PASS / ❌ FAIL

Overall Result: _____ / 18 tests passed

Notes:
_________________________________
_________________________________
_________________________________
```

---

## 🎯 Performance Benchmarks

**Target Metrics:**

- **Registration API:** < 500ms response time
- **OTP Email Delivery:** < 30 seconds
- **OTP Verification API:** < 300ms response time
- **Page Load Time:** < 2 seconds
- **Form Validation:** Instant (< 100ms)
- **Redirect After Verification:** 1.5 seconds

**Measure with:**

```javascript
// In browser console
console.time("Registration");
// ... submit form ...
console.timeEnd("Registration");
```

---

## ✅ Final Checklist

Before deploying to production:

- [ ] All 18 test scenarios passing
- [ ] Email delivery working (Gmail, Yahoo, Outlook)
- [ ] Database properly configured
- [ ] Error messages clear and helpful
- [ ] Mobile responsive
- [ ] Accessibility compliant
- [ ] Dark mode support
- [ ] Password strength indicator working
- [ ] Email validation feedback working
- [ ] OTP resend with cooldown working
- [ ] Security best practices followed
- [ ] Environment variables set in production
- [ ] Email templates professional
- [ ] Error logging configured
- [ ] Performance benchmarks met

---

**Ready to test? Start with Test 1 (Happy Path) and work through the list!** 🚀
