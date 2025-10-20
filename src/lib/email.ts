import nodemailer from "nodemailer";

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
export async function sendOTPEmail(email: string, otp: string, name?: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Your AssignmentGhar Verification Code",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 8px;
            }
            .logo {
              text-align: center;
              font-size: 28px;
              font-weight: bold;
              color: #667eea;
              margin-bottom: 20px;
            }
            .otp-box {
              background: #f8f9fa;
              border: 2px dashed #667eea;
              padding: 20px;
              text-align: center;
              border-radius: 8px;
              margin: 25px 0;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 12px;
              margin: 20px 0;
              border-radius: 4px;
              font-size: 14px;
            }
            .footer {
              text-align: center;
              color: #6c757d;
              font-size: 12px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e9ecef;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="logo">🎓 AssignmentGhar</div>
              <h2 style="color: #333;">Email Verification</h2>
              <p>Hello ${name || "there"},</p>
              <p>Thank you for registering with AssignmentGhar! Please use the following verification code to complete your registration:</p>
              
              <div class="otp-box">
                <div style="font-size: 14px; color: #6c757d; margin-bottom: 10px;">Your Verification Code</div>
                <div class="otp-code">${otp}</div>
              </div>
              
              <div class="warning">
                ⚠️ This code will expire in <strong>10 minutes</strong>. If you didn't request this code, please ignore this email.
              </div>
              
              <p>For security reasons:</p>
              <ul>
                <li>Never share this code with anyone</li>
                <li>AssignmentGhar staff will never ask for this code</li>
                <li>This code is valid for one-time use only</li>
              </ul>
              
              <p>If you have any questions, feel free to contact our support team.</p>
              
              <p>Best regards,<br><strong>AssignmentGhar Team</strong></p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} AssignmentGhar. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hello ${name || "there"},

Your AssignmentGhar verification code is: ${otp}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
AssignmentGhar Team
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send verification email");
  }
}

// Send welcome email
export async function sendWelcomeEmail(email: string, name: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Welcome to AssignmentGhar! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px;
              border-radius: 10px;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 8px;
            }
            .logo {
              text-align: center;
              font-size: 32px;
              font-weight: bold;
              color: #667eea;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              color: #6c757d;
              font-size: 12px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="logo">🎓 AssignmentGhar</div>
              <h2>Welcome aboard, ${name}! 🎉</h2>
              <p>Your account has been successfully verified and you're all set to get started!</p>
              
              <p><strong>What you can do now:</strong></p>
              <ul>
                <li>Submit your assignments</li>
                <li>Track your orders</li>
                <li>Get expert help</li>
                <li>Access premium resources</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL
                }" class="button">Get Started</a>
              </div>
              
              <p>If you have any questions, our support team is here to help!</p>
              
              <p>Best regards,<br><strong>AssignmentGhar Team</strong></p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} AssignmentGhar. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
}

export default transporter;
