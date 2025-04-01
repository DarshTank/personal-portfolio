import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
  console.log("Username check request received");
  try {
    const { username } = await request.json();
    console.log("Checking username:", username);

    if (!username) {
      console.log("Username is missing");
      return NextResponse.json(
        { 
          available: false,
          message: "Username is required" 
        },
        { status: 400 }
      );
    }

    // Normalize username
    const normalizedUsername = username.toLowerCase().trim();
    console.log("Normalized username:", normalizedUsername);

    // Basic validation before database check
    if (normalizedUsername.length < 3) {
      return NextResponse.json({
        available: false,
        message: "Username must be at least 3 characters long",
      });
    }

    if (normalizedUsername.length > 20) {
      return NextResponse.json({
        available: false,
        message: "Username cannot be longer than 20 characters",
      });
    }

    if (!/^[a-z][a-z0-9_]*$/.test(normalizedUsername)) {
      return NextResponse.json({
        available: false,
        message: "Username must start with a letter and can only contain lowercase letters, numbers, and underscores",
      });
    }

    // Check reserved words
    const reservedWords = ['admin', 'root', 'system', 'user', 'test'];
    if (reservedWords.includes(normalizedUsername)) {
      return NextResponse.json({
        available: false,
        message: "This username is not allowed",
      });
    }

    // Connect to database
    console.log("Connecting to database...");
    try {
      await connectToDatabase();
      console.log("Database connected successfully");
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { 
          available: false,
          message: "Database connection failed. Please try again." 
        },
        { status: 503 }
      );
    }

    // Check if username exists
    console.log("Checking if username exists...");
    let existingUser;
    try {
      existingUser = await UserModel.findOne({ username: normalizedUsername });
      console.log("Username check result:", existingUser ? "Username taken" : "Username available");
    } catch (findError) {
      console.error("Error checking username:", findError);
      return NextResponse.json(
        { 
          available: false,
          message: "Error checking username. Please try again." 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      available: !existingUser,
      message: existingUser ? "Username is taken" : "Username is available",
    });
  } catch (error: any) {
    console.error("Username check error:", error);
    return NextResponse.json(
      { 
        available: false,
        message: "Error checking username. Please try again." 
      },
      { status: 500 }
    );
  }
} 