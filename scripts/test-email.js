/**
 * Test Email Configuration
 * 
 * This script tests your email configuration by sending a test OTP email.
 * Run: node scripts/test-email.js
 */

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Load .env file manually
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split(/\r?\n/).forEach(line => {
        // Skip comments and empty lines
        if (line.trim().startsWith('#') || !line.trim()) return;

        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();

            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }

            process.env[key] = value;
        }
    });
}

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

console.log('\n' + colors.cyan + '🧪 Testing Email Configuration...' + colors.reset + '\n');

// Check environment variables
const requiredEnvVars = [
    'EMAIL_SERVER_HOST',
    'EMAIL_SERVER_PORT',
    'EMAIL_SERVER_USER',
    'EMAIL_SERVER_PASSWORD',
    'EMAIL_FROM'
];

let missingVars = [];
requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        missingVars.push(varName);
    }
});

if (missingVars.length > 0) {
    console.log(colors.red + '❌ Missing environment variables:' + colors.reset);
    missingVars.forEach(varName => {
        console.log(colors.yellow + `   - ${varName}` + colors.reset);
    });
    console.log('\nPlease add these to your .env file.\n');
    process.exit(1);
}

console.log(colors.green + '✅ All environment variables found' + colors.reset);
console.log(colors.blue + '\nConfiguration:' + colors.reset);
console.log(`   Host: ${process.env.EMAIL_SERVER_HOST}`);
console.log(`   Port: ${process.env.EMAIL_SERVER_PORT}`);
console.log(`   User: ${process.env.EMAIL_SERVER_USER}`);
console.log(`   From: ${process.env.EMAIL_FROM}`);
console.log(`   Password: ${'*'.repeat(process.env.EMAIL_SERVER_PASSWORD.length)} (hidden)\n`);

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

// Generate test OTP
const testOTP = Math.floor(100000 + Math.random() * 900000).toString();

// Get test recipient email (use email from env or default)
const testEmail = process.env.EMAIL_SERVER_USER; // Send to self for testing

console.log(colors.cyan + '📧 Sending test email...' + colors.reset);
console.log(`   To: ${testEmail}`);
console.log(`   Test OTP: ${testOTP}\n`);

// Email content
const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: testEmail,
    subject: '🧪 Test Email - AssignmentGhar OTP System',
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
          .test-badge {
            background: #28a745;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            display: inline-block;
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
          .success-box {
            background: #d4edda;
            border-left: 4px solid #28a745;
            padding: 12px;
            margin: 20px 0;
            border-radius: 4px;
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
            <div style="text-align: center;">
              <span class="test-badge">🧪 TEST EMAIL</span>
            </div>
            <h2 style="color: #333;">Email Configuration Test</h2>
            <p>Congratulations! Your email configuration is working correctly.</p>
            
            <div class="success-box">
              <strong>✅ Email System Status: WORKING</strong>
              <p style="margin: 5px 0 0 0; font-size: 14px;">Your SMTP configuration is set up correctly and emails are being sent successfully.</p>
            </div>

            <p>Here's a sample OTP code to verify the email formatting:</p>
            
            <div class="otp-box">
              <div style="font-size: 14px; color: #6c757d; margin-bottom: 10px;">Test Verification Code</div>
              <div class="otp-code">${testOTP}</div>
            </div>
            
            <p><strong>Configuration Details:</strong></p>
            <ul>
              <li>Server: ${process.env.EMAIL_SERVER_HOST}</li>
              <li>Port: ${process.env.EMAIL_SERVER_PORT}</li>
              <li>From: ${process.env.EMAIL_FROM}</li>
            </ul>

            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Check that this email arrived in your inbox (not spam)</li>
              <li>Verify the formatting looks correct</li>
              <li>Test the registration flow at http://localhost:3000/register</li>
            </ol>
            
            <p>If you received this email, your OTP system is ready to use!</p>
            
            <p>Best regards,<br><strong>AssignmentGhar Team</strong></p>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} AssignmentGhar. All rights reserved.</p>
              <p>This is a test email from your local development environment.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `,
    text: `
AssignmentGhar - Email Configuration Test

Congratulations! Your email configuration is working correctly.

Test OTP Code: ${testOTP}

Configuration:
- Server: ${process.env.EMAIL_SERVER_HOST}
- Port: ${process.env.EMAIL_SERVER_PORT}
- From: ${process.env.EMAIL_FROM}

Next Steps:
1. Check that this email arrived in your inbox (not spam)
2. Test the registration flow at http://localhost:3000/register

If you received this email, your OTP system is ready to use!

Best regards,
AssignmentGhar Team
  `,
};

// Send test email
transporter.sendMail(mailOptions)
    .then((info) => {
        console.log(colors.green + '✅ Test email sent successfully!' + colors.reset);
        console.log(colors.blue + '\nEmail Details:' + colors.reset);
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`   Response: ${info.response}`);
        console.log('\n' + colors.green + '✅ Your email configuration is working!' + colors.reset);
        console.log('\n' + colors.yellow + '📥 Check your inbox (and spam folder) for the test email.' + colors.reset);
        console.log(colors.yellow + '📧 Email sent to: ' + testEmail + colors.reset + '\n');
    })
    .catch((error) => {
        console.log('\n' + colors.red + '❌ Failed to send test email' + colors.reset);
        console.log(colors.red + '\nError Details:' + colors.reset);
        console.log(error.message);

        if (error.code === 'EAUTH') {
            console.log('\n' + colors.yellow + '💡 Authentication Error - Common Solutions:' + colors.reset);
            console.log('   1. Make sure you\'re using a Gmail App Password, not your regular password');
            console.log('   2. Enable 2-Step Verification in your Google Account');
            console.log('   3. Generate a new App Password at: https://myaccount.google.com/apppasswords');
            console.log('   4. Remove any spaces from the password in your .env file');
        } else if (error.code === 'ENOTFOUND') {
            console.log('\n' + colors.yellow + '💡 Network Error - Common Solutions:' + colors.reset);
            console.log('   1. Check your internet connection');
            console.log('   2. Verify EMAIL_SERVER_HOST is correct');
            console.log('   3. Check if your network blocks SMTP connections');
        } else if (error.code === 'ECONNECTION') {
            console.log('\n' + colors.yellow + '💡 Connection Error - Common Solutions:' + colors.reset);
            console.log('   1. Check EMAIL_SERVER_PORT (should be 587 for TLS)');
            console.log('   2. Verify your firewall isn\'t blocking the connection');
        }

        console.log('\n' + colors.cyan + '📖 See EMAIL_SETUP_GUIDE.md for more troubleshooting tips.\n' + colors.reset);
        process.exit(1);
    });
