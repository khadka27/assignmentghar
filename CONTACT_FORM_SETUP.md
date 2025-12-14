# Contact Form Email Setup

The contact form uses **Nodemailer** with Gmail to send emails. Follow these steps to configure it:

## 📧 Gmail App Password Setup

### Step 1: Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click on "2-Step Verification"
3. Follow the prompts to enable 2-Step Verification (if not already enabled)

### Step 2: Generate App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. In the "Select app" dropdown, choose **Mail**
3. In the "Select device" dropdown, choose **Other (Custom name)**
4. Enter a name like "AssignmentGhar Contact Form"
5. Click **Generate**
6. Copy the 16-character password (it will look like: `xxxx xxxx xxxx xxxx`)
7. **Remove the spaces** - it should be: `xxxxxxxxxxxxxxxx`

### Step 3: Add to Environment Variables

Add these two variables to your `.env` file:

```env
EMAIL_USER="assignmentghar1@gmail.com"
EMAIL_PASSWORD="your-16-character-app-password"
```

## 🚀 Features

The contact form includes:

### Admin Email

- **To**: assignmentghar1@gmail.com
- **Contains**:
  - Sender's name
  - Sender's email
  - Subject (optional)
  - Message content
  - Timestamp

### User Confirmation Email

- **To**: User's provided email
- **Contains**:
  - Thank you message
  - Copy of their submitted message
  - Contact information
  - Expected response time (24-48 hours)

## 🔒 Security Features

- ✅ Server-side validation (name, email format, message length)
- ✅ Client-side validation with error messages
- ✅ Email format validation with regex
- ✅ Message length limits (10-5000 characters)
- ✅ Loading states to prevent duplicate submissions
- ✅ Environment variable protection (never exposed to client)

## 📝 API Endpoint

**POST** `/api/contact/send`

### Request Body

```json
{
  "name": "Your Name",
  "email": "john@example.com",
  "subject": "Question about services" (optional),
  "message": "Your message here..."
}
```

### Validation Rules

- **Name**: Minimum 2 characters
- **Email**: Valid email format
- **Message**: 10-5000 characters
- **Subject**: Optional

### Response

```json
{
  "message": "Your message has been sent successfully! We'll get back to you soon."
}
```

## 🧪 Testing

1. Make sure your `.env` file has the correct credentials
2. Restart the dev server: `pnpm dev`
3. Navigate to `/contact`
4. Fill out and submit the form
5. Check both:
   - **Admin inbox**: assignmentghar1@gmail.com
   - **User inbox**: The email you entered in the form

## ⚠️ Troubleshooting

### "Email service is not configured"

- Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are set in `.env`
- Restart the development server

### "Failed to send email"

- **Check App Password**: Make sure you're using an App Password, not your regular Gmail password
- **2-Step Verification**: Must be enabled for App Passwords to work
- **Spaces in Password**: Remove all spaces from the 16-character App Password
- **Gmail SMTP**: Gmail may temporarily block if too many emails are sent quickly

### Emails not arriving

- Check spam/junk folders
- Verify the email address is correct
- Check Gmail account for any security alerts

## 🔗 Gmail Less Secure Apps (No Longer Supported)

Gmail has disabled "Less Secure Apps" access. You **must** use App Passwords with 2-Step Verification. Regular Gmail passwords will not work.

## 📚 Alternative Email Providers

If you want to use a different email service:

1. Update the transporter configuration in `/api/contact/send/route.ts`:

```typescript
const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

2. Popular alternatives:
   - **SendGrid**: High deliverability, generous free tier
   - **Mailgun**: Developer-friendly, good API
   - **AWS SES**: Cost-effective for high volume
   - **Outlook/Office 365**: `smtp.office365.com`, port 587

## 📦 Dependencies

Already installed:

- `nodemailer@^7.0.9`
- `@types/nodemailer@^6.x.x`

## 🎨 UI Features

- Beautiful HTML email templates
- Loading spinner during submission
- Success/error toast notifications
- Form field validation with error messages
- Disabled state during submission
- Confirmation message showing user's email
- Responsive design (mobile-friendly)

## 📞 Support

If you encounter any issues, check:

1. Environment variables are set correctly
2. App Password is valid and has no spaces
3. 2-Step Verification is enabled on Gmail account
4. Development server has been restarted after adding env vars

For more help, email: assignmentghar1@gmail.com
