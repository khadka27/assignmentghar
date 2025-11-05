# Email OTP Setup Guide

## ✅ Current Status

Your email OTP system is fully configured! Here's what's set up:

### 1. Email Library (`src/lib/email.ts`)

- ✅ `generateOTP()` - Generates 6-digit OTP codes
- ✅ `sendOTPEmail()` - Sends verification emails with OTP
- ✅ `sendWelcomeEmail()` - Sends welcome email after verification
- ✅ `sendPasswordResetEmail()` - Sends password reset emails

### 2. API Routes

- ✅ `/api/auth/register` - Creates user and sends OTP
- ✅ `/api/auth/verify-otp` - Verifies OTP and activates account
- ✅ `/api/auth/resend-otp` - Resends OTP if expired
- ✅ `/api/auth/check-email` - Validates email availability
- ✅ `/api/auth/check-username` - Validates username availability

### 3. Environment Variables

Your `.env` file has been updated with the correct email configuration:

```properties
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="assignmentghar1@gmail.com"
EMAIL_SERVER_PASSWORD="hlkvjbnmnwhfcssl"  # App Password (spaces removed)
EMAIL_FROM="AssignmentGhar <assignmentghar1@gmail.com>"
```

## 🚀 How It Works

### Registration Flow:

1. **User fills registration form** (Step 1: Name, Username, Email, Gender)
2. **User sets password** (Step 2: Password with strength validation)
3. **Backend creates user** with `isVerified: false`
4. **OTP is generated** (6-digit random number)
5. **OTP email is sent** via Gmail SMTP
6. **User enters OTP** (Step 3: Verification)
7. **Account is activated** and user can login

### Email Features:

- 📧 Beautiful HTML email templates with gradient design
- ⏰ OTP expires in 10 minutes
- 🔄 Resend OTP functionality with 60-second cooldown
- 🎨 Responsive email design
- 📝 Plain text fallback for email clients that don't support HTML

## 🔧 Troubleshooting

### If OTP emails are not being sent:

#### 1. Verify Gmail App Password

The password in your `.env` should be a Gmail App Password, not your regular Gmail password.

**To create a Gmail App Password:**

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security**
3. Enable **2-Step Verification** (if not already enabled)
4. Search for "App passwords"
5. Generate a new app password for "Mail"
6. Copy the 16-character password (without spaces)
7. Update `EMAIL_SERVER_PASSWORD` in `.env`

#### 2. Check Email Server Connection

Run the test script to verify email configuration:

```bash
node scripts/test-email.js
```

#### 3. Check Console Logs

When registering, check your terminal for:

- ✅ "OTP email sent: [messageId]" - Email sent successfully
- ❌ "Failed to send OTP email: [error]" - Email failed

#### 4. Check Spam Folder

Sometimes Gmail marks automated emails as spam. Ask users to check their spam/junk folder.

#### 5. Verify Environment Variables

Make sure your dev server is using the updated `.env` file:

```bash
# Stop current server (Ctrl+C)
pnpm dev
```

### Common Issues:

**"Invalid login: 535-5.7.8 Username and Password not accepted"**

- Solution: Create a Gmail App Password (see step 1 above)

**"Failed to send OTP email: getaddrinfo ENOTFOUND smtp.gmail.com"**

- Solution: Check internet connection
- Alternative: Try using a different SMTP server

**"Email sent but not received"**

- Check spam/junk folder
- Verify email address is correct
- Check Gmail account hasn't blocked the sending address

**"OTP expired"**

- OTP is valid for 10 minutes
- Use "Resend Code" button to get a new OTP

## 🧪 Testing

### Manual Test:

1. Go to http://localhost:3000/register
2. Fill in the registration form with your real email
3. Complete both steps (info + password)
4. Check your email inbox (and spam folder)
5. You should receive an email with a 6-digit code
6. Enter the code on the verification page
7. You should be redirected to login

### Test Email Script:

```bash
node scripts/test-email.js
```

This will send a test OTP email to verify your configuration.

## 📧 Email Templates

### OTP Email Includes:

- 🎓 AssignmentGhar branding
- 🔢 Large, easy-to-read OTP code
- ⏰ Expiration warning (10 minutes)
- 🔒 Security tips
- 📱 Responsive design

### Welcome Email Includes:

- 🎉 Welcome message
- ✨ Account features
- 🔗 "Get Started" button
- 💬 Support information

## 🔐 Security Features

- ✅ OTP expires after 10 minutes
- ✅ OTP is single-use only
- ✅ User account deleted if email send fails
- ✅ Resend cooldown (60 seconds)
- ✅ Email validation before registration
- ✅ Username availability check
- ✅ Password strength validation

## 📝 Next Steps

1. **Test the registration flow** with a real email address
2. **Check spam folder** if email doesn't arrive in inbox
3. **Update Gmail App Password** if needed
4. **Configure email allowlist** in Gmail settings (optional)
5. **Set up custom domain email** for production (optional)

## 🆘 Support

If you're still experiencing issues:

1. Check the browser console for errors
2. Check the server terminal for error logs
3. Verify all environment variables are set correctly
4. Ensure the dev server was restarted after updating `.env`
5. Try with a different email address
6. Check Gmail account security settings

## 🎯 Production Checklist

Before deploying to production:

- [ ] Use a custom domain email (e.g., noreply@assignmentghar.com)
- [ ] Consider using a transactional email service (SendGrid, AWS SES, Mailgun)
- [ ] Update `NEXT_PUBLIC_APP_URL` in `.env`
- [ ] Test with multiple email providers (Gmail, Outlook, Yahoo, etc.)
- [ ] Monitor email delivery rates
- [ ] Set up email bounce handling
- [ ] Configure SPF, DKIM, and DMARC records

---

**Your OTP email system is ready to use!** 🎉
