# Missing Verification Page - Testing Checklist

## Quick Test Guide

### Prerequisites

- ✅ Database is running (PostgreSQL)
- ✅ Email service configured (.env has SMTP settings)
- ✅ Next.js dev server running (`pnpm dev`)

---

## Test Scenarios

### 🧪 **Test 1: Account Not Found**

**Steps:**

1. Go to: `http://localhost:3000/missing-verification`
2. Enter email: `nonexistent@example.com`
3. Click "Check Account Status"

**Expected Result:**

- ❌ Red UserX icon appears
- "Account Not Found" message displayed
- Shows email address
- Two buttons appear:
  - "Yes, Create Account"
  - "No, Go to Login"

**Actions to Test:**

- [ ] Click "Yes, Create Account" → Should redirect to `/register`
- [ ] Click "No, Go to Login" → Should redirect to `/login`
- [ ] Click "Back to Login" link → Should redirect to `/login`

---

### 🧪 **Test 2: Unverified Account - Fresh Registration**

**Setup Steps:**

1. Register a new account:
   - Go to `/register`
   - Email: `testunverified@example.com`
   - Password: `Test123!@#`
   - **DON'T verify the OTP** - close the page or click back

**Test Steps:** 2. Go to: `http://localhost:3000/missing-verification` 3. Enter email: `testunverified@example.com` 4. Click "Check Account Status"

**Expected Result:**

- ⚠️ Yellow AlertCircle icon appears
- "Email Not Verified" message displayed
- Shows email address
- "Send Verification Code" button appears

**Actions to Test:**

- [ ] Email is displayed correctly
- [ ] Button is clickable and not disabled
- [ ] Toast notification shows "Sending verification code..."

---

### 🧪 **Test 3: OTP Send and Verify Flow**

**Continuing from Test 2:**

**Steps:**

1. Click "Send Verification Code" button
2. Wait for toast: "Verification Code Sent"

**Expected Result:**

- 📧 Blue Mail icon appears
- "Verify Your Email" heading
- Shows email address
- 6-digit OTP input field appears
- "Verify Email" button appears
- "Resend Code" button appears (with timer)
- "Back" button appears

**Actions to Test:**

- [ ] Check email inbox for OTP (6-digit code)
- [ ] OTP input only accepts numbers (try typing letters)
- [ ] OTP input max length is 6 digits
- [ ] "Verify Email" button is disabled until 6 digits entered
- [ ] Resend button shows "Resend in 60s" countdown
- [ ] Resend button is disabled during countdown

**Verification Steps:** 3. Get OTP from email 4. Enter the 6-digit code 5. Click "Verify Email"

**Expected Result:**

- ✅ Toast: "Email Verified Successfully!"
- "Redirecting to login..." message
- Auto-redirect to `/login` after 2 seconds
- Green CheckCircle icon briefly shown

**Post-Verification Test:** 6. Go back to `/missing-verification` 7. Enter same email: `testunverified@example.com` 8. Click "Check Account Status"

**Expected Result:**

- ✅ Green CheckCircle icon
- "Account Already Verified!" message
- Auto-redirect to `/login` after 2 seconds

---

### 🧪 **Test 4: Wrong OTP**

**Steps:**

1. Create another unverified account or use existing
2. Go to `/missing-verification`
3. Check account status
4. Click "Send Verification Code"
5. Enter wrong code: `123456`
6. Click "Verify Email"

**Expected Result:**

- ❌ Toast with error: "Verification Failed"
- Description: "Invalid or expired verification code"
- OTP input remains
- Can try again with correct code

**Actions to Test:**

- [ ] Error message is clear
- [ ] OTP input is not cleared
- [ ] Can enter new code without resending
- [ ] Can resend OTP if needed

---

### 🧪 **Test 5: OTP Resend Timer**

**Steps:**

1. Send OTP to unverified account
2. Check "Resend Code" button

**Expected Result:**

- Button shows "Resend in 60s" with Clock icon
- Button is disabled (opacity 50%)
- Count down: 60 → 59 → 58 → ... → 1 → 0
- After reaching 0: Button shows "Resend Code"
- Button becomes enabled

**Actions to Test:**

- [ ] Timer counts down every second
- [ ] Button is disabled during countdown
- [ ] Button text updates each second
- [ ] Clock icon is visible
- [ ] After timer ends, button is clickable
- [ ] Clicking "Resend Code" sends new OTP
- [ ] Timer resets to 60s after resend

---

### 🧪 **Test 6: Expired OTP**

**Setup:**
Wait 10+ minutes after sending OTP (or manually expire in database)

**Steps:**

1. Send OTP to unverified account
2. Wait 10+ minutes (OTP expiry time)
3. Enter the old OTP code
4. Click "Verify Email"

**Expected Result:**

- ❌ Error: "Invalid or expired verification code"
- Must click "Resend Code" to get new OTP

**Actions to Test:**

- [ ] Old OTP is rejected
- [ ] Clear error message about expiration
- [ ] Resend functionality works
- [ ] New OTP verifies successfully

---

### 🧪 **Test 7: URL Parameter Integration**

**Steps:**

1. Go to: `http://localhost:3000/missing-verification?email=test@example.com`

**Expected Result:**

- Email field is pre-filled with `test@example.com`
- Automatically checks account status
- Shows appropriate screen based on status:
  - Not found → Account Not Found screen
  - Unverified → Email Not Verified screen
  - Verified → Already Verified screen + redirect

**Actions to Test:**

- [ ] URL parameter is correctly parsed
- [ ] Email is decoded properly (handles + and special chars)
- [ ] Auto-check happens on page load
- [ ] No manual "Check" button click needed

---

### 🧪 **Test 8: Login Page Integration (Current - Inline OTP)**

**Steps:**

1. Try to login with unverified account:
   - Email: `testunverified@example.com`
   - Password: (correct password)
2. Click "Sign in"

**Expected Result:**

- Login fails with verification error
- Toast: "Email Not Verified"
- Toast: "Sending verification code..."
- OTP section appears inline on login page
- No redirect to missing-verification page

**Actions to Test:**

- [ ] Login detects unverified status
- [ ] OTP is automatically sent
- [ ] OTP input section appears on same page
- [ ] Can verify without leaving login page
- [ ] After verification, can login immediately

---

### 🧪 **Test 9: Login Page Integration (Alternative - Redirect)**

**To test redirect behavior:**

**Setup:**

1. Open `src/app/login/page.tsx`
2. Find line ~161 (in handleSubmit function)
3. Comment out inline OTP code:

```typescript
// if (result.error.includes("verify your email")) {
//   setUnverifiedEmail(formData.email);
//   toast({
//     title: "Email Not Verified",
//     description: "Sending verification code to your email...",
//   });
//   await handleSendOTP(formData.email);
// }
```

4. Uncomment redirect code:

```typescript
if (result.error.includes("verify your email")) {
  router.push(
    `/missing-verification?email=${encodeURIComponent(formData.email)}`
  );
}
```

**Test Steps:** 5. Try to login with unverified account 6. Click "Sign in"

**Expected Result:**

- Redirects to `/missing-verification?email=...`
- Email is pre-filled
- Shows "Email Not Verified" screen
- Can verify from dedicated page

**Actions to Test:**

- [ ] Redirect happens automatically
- [ ] Email is passed via URL
- [ ] Verification works on dedicated page
- [ ] After verification, can go back and login

**Restore:** 7. Undo changes to keep inline OTP behavior (current default)

---

### 🧪 **Test 10: Back Button Navigation**

**Steps:**

1. Go through unverified account flow
2. Click "Send Verification Code"
3. OTP input appears
4. Click "Back" button

**Expected Result:**

- Returns to "Email Not Verified" screen
- OTP input is hidden
- Can click "Send Verification Code" again
- OTP field is cleared

**Actions to Test:**

- [ ] Back button is visible
- [ ] Clicking back doesn't lose email
- [ ] Can restart verification flow
- [ ] No errors in console

---

### 🧪 **Test 11: Multiple Accounts Test**

**Setup:**
Create 3 test accounts:

- `verified@test.com` - Complete registration and verify
- `unverified@test.com` - Register but don't verify
- `nonexistent@test.com` - Don't register at all

**Test Steps:**
Test each account through missing-verification page

**Expected Results:**

- `verified@test.com`:
  - [ ] Shows "Already Verified"
  - [ ] Auto-redirects to login
- `unverified@test.com`:
  - [ ] Shows "Email Not Verified"
  - [ ] Can send OTP and verify
- `nonexistent@test.com`:
  - [ ] Shows "Account Not Found"
  - [ ] Offers to create account

---

### 🧪 **Test 12: Dark Mode Compatibility**

**Steps:**

1. Toggle dark mode in your app
2. Go through all missing-verification screens

**Expected Result:**

- All text is readable
- Icons are visible
- Buttons have proper contrast
- Gradients work in dark mode
- No white/black blobs
- Smooth transitions

**Actions to Test:**

- [ ] Check each state in dark mode
- [ ] Icons change color appropriately
- [ ] Backgrounds have correct opacity
- [ ] Text is readable everywhere
- [ ] Buttons are visible and styled

---

### 🧪 **Test 13: Mobile Responsiveness**

**Steps:**

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different screen sizes:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Desktop (1920px)

**Expected Result:**

- Layout adapts to screen size
- Text is readable
- Buttons are tappable (min 44x44px)
- No horizontal scroll
- Icons scale appropriately
- Form inputs are not cut off

**Actions to Test:**

- [ ] 375px width (mobile)
- [ ] 768px width (tablet)
- [ ] 1920px width (desktop)
- [ ] Rotate to landscape
- [ ] Touch targets are adequate
- [ ] Zoom in/out works

---

### 🧪 **Test 14: Performance & Loading States**

**Test Slow Network:**

1. Open DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Go through verification flow

**Expected Result:**

- Loading spinners appear
- Buttons show "Loading..." state
- No UI jumps or shifts
- Toast notifications still work
- User can't double-submit

**Actions to Test:**

- [ ] Check account status with slow network
- [ ] Send OTP with slow network
- [ ] Verify OTP with slow network
- [ ] Loading states are clear
- [ ] Can't double-click during loading

---

### 🧪 **Test 15: Error Recovery**

**Scenario A: Network Fails During Check**

1. Disconnect internet
2. Try to check account status
3. Should show error toast
4. Reconnect internet
5. Try again

**Scenario B: API Returns 500 Error**

1. Temporarily break API endpoint
2. Try to check account
3. Should show error message
4. Fix API
5. Try again

**Expected Result:**

- Clear error messages
- User can retry
- No app crash
- Console shows useful logs

**Actions to Test:**

- [ ] Network error handling
- [ ] API error handling
- [ ] Retry functionality
- [ ] Error messages are helpful

---

## Automated Testing Script

```javascript
// tests/missing-verification.test.js

describe("Missing Verification Page", () => {
  test("shows account not found for non-existent email", async () => {
    // Test implementation
  });

  test("shows unverified status for unverified account", async () => {
    // Test implementation
  });

  test("sends OTP when requested", async () => {
    // Test implementation
  });

  test("verifies OTP successfully", async () => {
    // Test implementation
  });

  test("rejects invalid OTP", async () => {
    // Test implementation
  });

  test("resend timer works correctly", async () => {
    // Test implementation
  });

  test("redirects verified accounts", async () => {
    // Test implementation
  });
});
```

---

## Database Verification Queries

```sql
-- Check user verification status
SELECT
  email,
  "isVerified",
  "emailVerified",
  otp,
  "otpExpiry"
FROM "User"
WHERE email = 'test@example.com';

-- Find all unverified users
SELECT email, "createdAt"
FROM "User"
WHERE "isVerified" = false
ORDER BY "createdAt" DESC;

-- Check recent OTPs
SELECT
  email,
  otp,
  "otpExpiry",
  ("otpExpiry" > NOW()) as is_valid
FROM "User"
WHERE otp IS NOT NULL;
```

---

## Browser Console Checks

Open browser console (F12) and check for:

- ❌ No errors in console
- ❌ No 404 errors for API routes
- ❌ No React warnings
- ✅ API calls return 200 status
- ✅ State updates are logged (if debug mode on)

---

## Email Verification

Check email inbox for:

- ✅ Email is received within 5 seconds
- ✅ OTP is exactly 6 digits
- ✅ Email has nice formatting
- ✅ Email shows correct recipient
- ✅ No spam folder placement

---

## Success Criteria

### ✅ **All Tests Must Pass:**

- [ ] Account not found scenario works
- [ ] Unverified account scenario works
- [ ] OTP send functionality works
- [ ] OTP verification works
- [ ] Resend timer works
- [ ] Wrong OTP shows error
- [ ] Expired OTP shows error
- [ ] URL parameter works
- [ ] Login integration works
- [ ] Back navigation works
- [ ] Dark mode looks good
- [ ] Mobile responsive
- [ ] Loading states work
- [ ] Error handling works
- [ ] Database updates correctly

### 🎯 **Quality Checklist:**

- [ ] No console errors
- [ ] Fast loading (< 2 seconds)
- [ ] Clear user feedback
- [ ] Accessible (keyboard navigation)
- [ ] Works on all major browsers
- [ ] Email delivery reliable
- [ ] Security measures in place

---

## Bug Reporting Template

If you find a bug, use this template:

```
**Bug Title:** [Brief description]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1.
2.
3.

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots:**
[Attach screenshots if applicable]

**Environment:**
- Browser:
- OS:
- Screen size:
- Dark mode: Yes/No

**Console Errors:**
[Paste any console errors]

**Database State:**
[SQL query result if relevant]
```

---

## Final Checklist

Before marking as complete:

- [ ] All 15 test scenarios passed
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile device (real device, not just emulator)
- [ ] Database queries return expected results
- [ ] Email delivery is reliable
- [ ] No security vulnerabilities
- [ ] Code is clean and commented
- [ ] Documentation is up to date
- [ ] Todo list is updated

---

**Happy Testing! 🧪✅**
