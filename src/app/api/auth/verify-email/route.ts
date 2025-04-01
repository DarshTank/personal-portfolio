import { NextResponse } from "next/server";
import { UserModel } from "@/models/User";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: Request) {
  console.log("Email verification request received");
  try {
    // Connect to database first
    console.log("Attempting to connect to database...");
    try {
      await connectToDatabase();
      console.log("Database connected successfully");
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { 
          message: "Database connection failed",
          error: "db_connection_error"
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    console.log("Request body:", { ...body, code: "[REDACTED]" });

    // Get verification code from either field
    const verificationCode = body.code || body.verificationCode;

    // Validate required fields
    if (!body.email || !verificationCode) {
      console.log("Missing required fields:", { 
        email: !!body.email, 
        code: !!verificationCode
      });
      return NextResponse.json(
        { 
          message: "Email and verification code are required",
          error: "missing_fields"
        },
        { status: 400 }
      );
    }

    // Find user
    console.log("Looking up user by email:", body.email.toLowerCase());
    let user;
    try {
      user = await UserModel.findOne({ email: body.email.toLowerCase() }).select('+verificationCode +verificationCodeExpires');
      console.log("User lookup result:", user ? "User found" : "No user found");
    } catch (findError) {
      console.error("Error finding user:", findError);
      return NextResponse.json(
        { 
          message: "Error finding user",
          error: "db_query_error"
        },
        { status: 500 }
      );
    }

    if (!user) {
      console.log("User not found for email:", body.email.toLowerCase());
      return NextResponse.json(
        { 
          message: "User not found",
          error: "user_not_found"
        },
        { status: 404 }
      );
    }

    // Check if already verified
    console.log("Checking email verification status:", user.isEmailVerified);
    if (user.isEmailVerified) {
      console.log("Email already verified for user:", user.email);
      return NextResponse.json(
        { 
          message: "Email is already verified",
          error: "already_verified"
        },
        { status: 400 }
      );
    }

    // Cleanup any expired tokens
    user.cleanupExpiredTokens();

    // Check if verification code is valid
    console.log("Verifying code...");
    if (!user.isVerificationCodeValid(verificationCode)) {
      console.log("Invalid or expired verification code for user:", user.email);
      return NextResponse.json(
        { 
          message: "Invalid or expired verification code",
          error: "invalid_code"
        },
        { status: 400 }
      );
    }

    // Update user verification status
    console.log("Updating user verification status...");
    try {
      user.isEmailVerified = true;
      user.clearVerificationCode();
      await user.save();
      console.log("User verification status updated successfully");
    } catch (updateError) {
      console.error("Error updating user verification:", updateError);
      return NextResponse.json(
        { 
          message: "Error updating verification status",
          error: "update_error"
        },
        { status: 500 }
      );
    }

    console.log("Email verification completed successfully for user:", user.email);
    return NextResponse.json(
      { 
        message: "Email verified successfully",
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          fullname: user.fullname,
          isEmailVerified: user.isEmailVerified
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { 
        message: error.message || "Something went wrong",
        error: "server_error"
      },
      { status: 500 }
    );
  }
}