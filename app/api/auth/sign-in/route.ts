import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";
import { generateToken } from "@/lib/token";

export async function POST(request: Request) {
  console.log("Sign-in request received");
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

    const body = await request.json();
    console.log("Request body:", { ...body, password: "[REDACTED]" });

    // Validate required fields
    if (!body.email || !body.password) {
      console.log("Missing required fields:", { 
        email: !!body.email, 
        password: !!body.password
      });
      return NextResponse.json(
        { 
          message: "Email and password are required",
          error: "missing_fields"
        },
        { status: 400 }
      );
    }

    // Find user
    console.log("Looking up user by email:", body.email.toLowerCase());
    let user;
    try {
      user = await UserModel.findOne({ email: body.email.toLowerCase() }).select('+verificationCode');
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
          message: "Invalid email or password",
          error: "invalid_credentials"
        },
        { status: 401 }
      );
    }

    // Verify password first
    console.log("Verifying password...");
    const isPasswordValid = await user.comparePassword(body.password);
    if (!isPasswordValid) {
      console.log("Invalid password for user:", user.email);
      return NextResponse.json(
        { 
          message: "Invalid email or password",
          error: "invalid_credentials"
        },
        { status: 401 }
      );
    }

    // Then check if email is verified
    if (!user.isEmailVerified) {
      console.log("Email not verified for user:", user.email);
      
      // Generate new verification code
      const verificationCode = user.generateVerificationCode();
      await user.save();
      console.log("Generated new verification code");

      return NextResponse.json(
        { 
          message: "Please verify your email first",
          error: "email_not_verified",
          email: user.email,
          verificationCode, // New verification code
          redirectTo: "/verify-email"
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    console.log("Generating JWT token...");
    const token = generateToken(user._id);

    // Set token in cookie
    const response = NextResponse.json(
      { 
        message: "Signed in successfully",
        token,
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

    // Set HTTP-only cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    console.log("Sign-in completed successfully for user:", user.email);
    return response;
  } catch (error: any) {
    console.error("Sign-in error:", error);
    return NextResponse.json(
      { 
        message: error.message || "Something went wrong",
        error: "server_error"
      },
      { status: 500 }
    );
  }
} 