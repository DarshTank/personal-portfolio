import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
  console.log("Sign-up request received");
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
    if (!body.email || !body.password || !body.username || !body.fullname) {
      console.log("Missing required fields:", { 
        email: !!body.email, 
        password: !!body.password,
        username: !!body.username,
        fullname: !!body.fullname
      });
      return NextResponse.json(
        { 
          message: "All fields are required",
          error: "missing_fields"
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { 
          message: "Invalid email format",
          error: "invalid_email"
        },
        { status: 400 }
      );
    }

    // Validate username format
    const usernameRegex = /^[a-z][a-z0-9_]*$/;
    if (!usernameRegex.test(body.username.toLowerCase())) {
      return NextResponse.json(
        { 
          message: "Username must start with a letter and can only contain lowercase letters, numbers, and underscores",
          error: "invalid_username"
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log("Checking for existing user...");
    const existingUser = await UserModel.findOne({
      $or: [
        { email: body.email.toLowerCase() },
        { username: body.username.toLowerCase() }
      ]
    });

    if (existingUser) {
      console.log("User already exists:", existingUser.email);
      return NextResponse.json(
        { 
          message: existingUser.email === body.email.toLowerCase() 
            ? "Email is already registered" 
            : "Username is already taken",
          error: "user_exists"
        },
        { status: 400 }
      );
    }

    // Create new user
    console.log("Creating new user...");
    const user = await UserModel.create({
      fullname: body.fullname,
      username: body.username.toLowerCase(),
      email: body.email.toLowerCase(),
      password: body.password,
    });

    // Generate verification code
    const verificationCode = user.generateVerificationCode();
    await user.save();
    console.log("Generated verification code");

    console.log("User created successfully:", user.email);

    return NextResponse.json(
      { 
        message: "Account created successfully",
        email: user.email,
        verificationCode,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          fullname: user.fullname,
          isEmailVerified: user.isEmailVerified
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Sign-up error:", error);
    return NextResponse.json(
      { 
        message: error.message || "Something went wrong",
        error: "server_error"
      },
      { status: 500 }
    );
  }
} 