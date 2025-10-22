import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * POST /api/contact/send
 *
 * Send contact form email via Nodemailer
 *
 * Input: { name, email, subject?, message }
 *
 * Responses:
 * - 200: Email sent successfully
 * - 400: Validation error
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        {
          code: "INVALID_NAME",
          message: "Name must be at least 2 characters long",
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        {
          code: "INVALID_EMAIL",
          message: "Please provide a valid email address",
        },
        { status: 400 }
      );
    }

    if (!message || message.trim().length < 10) {
      return NextResponse.json(
        {
          code: "INVALID_MESSAGE",
          message: "Message must be at least 10 characters long",
        },
        { status: 400 }
      );
    }

    if (message.trim().length > 5000) {
      return NextResponse.json(
        {
          code: "MESSAGE_TOO_LONG",
          message: "Message must be less than 5000 characters",
        },
        { status: 400 }
      );
    }

    // Check for required environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error("Email configuration missing in environment variables");
      return NextResponse.json(
        {
          code: "SERVER_CONFIG_ERROR",
          message:
            "Email service is not configured. Please contact the administrator.",
        },
        { status: 500 }
      );
    }

    // Create Nodemailer transporter (Gmail configuration)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // assignmentghar1@gmail.com
        pass: process.env.EMAIL_PASSWORD, // App password from Google
      },
    });

    // Email content to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: "assignmentghar1@gmail.com",
      subject: subject || `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Contact Form Submission</h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
            ${
              subject
                ? `<p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>`
                : ""
            }
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #6b7280; font-size: 12px;">
            <p>This email was sent from the AssignmentGhar contact form.</p>
            <p>Received at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
    };

    // Confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting AssignmentGhar",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #2563eb;">Thank You for Reaching Out!</h2>
          
          <p>Dear ${name},</p>
          
          <p>We have received your message and our team will get back to you as soon as possible, typically within 24-48 hours.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Your Message:</strong></p>
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <p>If you have any urgent concerns, please feel free to reply to this email directly.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="margin: 5px 0;"><strong>Best regards,</strong></p>
            <p style="margin: 5px 0;">The AssignmentGhar Team</p>
            <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">📧 assignmentghar1@gmail.com</p>
          </div>
        </div>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return NextResponse.json(
      {
        message:
          "Your message has been sent successfully! We'll get back to you soon.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Contact form email error:", error);
    return NextResponse.json(
      {
        code: "EMAIL_SEND_ERROR",
        message:
          "Failed to send email. Please try again later or contact us directly at assignmentghar1@gmail.com",
      },
      { status: 500 }
    );
  }
}
