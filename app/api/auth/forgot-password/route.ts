import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserModel from "@/models/User";
import { Resend } from "resend";
import { rateLimitMiddleware } from "@/lib/rateLimiter";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Apply rate limiting
    const rateLimitResult = rateLimitMiddleware(email.toLowerCase());
    if (rateLimitResult.isRateLimited) {
      return NextResponse.json(
        { message: rateLimitResult.message },
        { status: 429 }
      );
    }

    await connectToDatabase();

    // Find user
    const user = await UserModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return NextResponse.json({
        message: "If an account exists with this email, you will receive password reset instructions.",
      });
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send reset email
    try {
      await resend.emails.send({
        from: "Portfolio Maker <noreply@portfoliomaker.com>",
        to: email,
        subject: "Password Reset Request",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset Your Password</title>
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
                .footer {
                  text-align: center;
                  padding: 20px;
                  color: #666;
                  font-size: 14px;
                  border-top: 1px solid #eee;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">Portfolio Maker</div>
                </div>
                <div class="content">
                  <h1 style="text-align: center; color: #1f2937; margin-bottom: 20px;">Reset Your Password</h1>
                  <p>You requested to reset your password. Click the button below to create a new password:</p>
                  
                  <p style="text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}" class="button">
                      Reset Password
                    </a>
                  </p>
                  
                  <p>This link will expire in 10 minutes.</p>
                  
                  <div class="warning">
                    <strong>Important:</strong> If you didn't request this password reset, please ignore this email or contact support if you have concerns.
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

      return NextResponse.json({
        message: "If an account exists with this email, you will receive password reset instructions.",
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return NextResponse.json(
        { message: "Failed to send password reset email" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { message: error.message || "Error processing password reset request" },
      { status: 500 }
    );
  }
} 