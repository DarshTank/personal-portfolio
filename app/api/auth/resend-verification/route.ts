import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS = 3; // Maximum 3 requests per window

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Check rate limit
    const now = Date.now();
    const userRateLimit = rateLimit.get(email) || { count: 0, timestamp: now };

    if (now - userRateLimit.timestamp > RATE_LIMIT_WINDOW) {
      // Reset rate limit if window has passed
      userRateLimit.count = 0;
      userRateLimit.timestamp = now;
    }

    if (userRateLimit.count >= MAX_REQUESTS) {
      const timeLeft = Math.ceil((RATE_LIMIT_WINDOW - (now - userRateLimit.timestamp)) / 1000);
      return NextResponse.json(
        { 
          message: `Too many requests. Please try again in ${timeLeft} seconds.`,
          timeLeft 
        },
        { status: 429 }
      );
    }

    await connectToDatabase();

    const user = await UserModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 400 }
      );
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new verification code
    user.verificationCode = verificationCode;
    user.verificationCodeExpiry = verificationCodeExpiry;
    await user.save();

    // Send verification email
    try {
      await resend.emails.send({
        from: "Portfolio Maker <noreply@darshtank.me>",
        to: email,
        subject: "New Verification Code - Portfolio Maker",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Verification Code</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .header {
                  text-align: center;
                  padding: 20px 0;
                  background-color: #f8f9fa;
                  border-radius: 8px 8px 0 0;
                }
                .logo {
                  font-size: 24px;
                  font-weight: bold;
                  color: #2563eb;
                }
                .content {
                  padding: 30px 20px;
                }
                .verification-code {
                  background-color: #f8f9fa;
                  padding: 15px;
                  border-radius: 6px;
                  text-align: center;
                  margin: 20px 0;
                  font-size: 24px;
                  font-weight: bold;
                  color: #2563eb;
                  letter-spacing: 2px;
                }
                .footer {
                  text-align: center;
                  padding: 20px;
                  color: #666;
                  font-size: 14px;
                  border-top: 1px solid #eee;
                }
                .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #2563eb;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 6px;
                  margin: 20px 0;
                }
                .warning {
                  color: #dc2626;
                  font-size: 14px;
                  margin-top: 20px;
                  padding: 10px;
                  background-color: #fee2e2;
                  border-radius: 4px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">Portfolio Maker</div>
                </div>
                <div class="content">
                  <h1 style="text-align: center; color: #1f2937; margin-bottom: 20px;">New Verification Code</h1>
                  <p>You requested a new verification code for your Portfolio Maker account. Here's your new code:</p>
                  
                  <div class="verification-code">${verificationCode}</div>
                  
                  <p style="text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?email=${encodeURIComponent(email)}" class="button">
                      Verify Email
                    </a>
                  </p>
                  
                  <p>This code will expire in 10 minutes.</p>
                  
                  <div class="warning">
                    <strong>Important:</strong> If you didn't request this code, please ignore this email or contact support if you have concerns.
                  </div>
                </div>
                <div class="footer">
                  <p>This is an automated message, please do not reply to this email.</p>
                  <p>© ${new Date().getFullYear()} Portfolio Maker. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      // Update rate limit
      userRateLimit.count++;
      rateLimit.set(email, userRateLimit);

      return NextResponse.json({
        message: "New verification code sent successfully",
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return NextResponse.json(
        { message: "Failed to send verification email" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { message: error.message || "Error resending verification code" },
      { status: 500 }
    );
  }
} 