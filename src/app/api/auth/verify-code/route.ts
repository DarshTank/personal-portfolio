import { NextResponse } from "next/server";
import UserModel from "@/models/User";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { email, code } = body;

    // Find user
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Check if verification code matches
    if (user.verifyCode !== code) {
      return NextResponse.json(
        { message: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Check if verification code has expired
    if (user.verifyCodeExpiry && user.verifyCodeExpiry < new Date()) {
      return NextResponse.json(
        { message: "Verification code has expired" },
        { status: 400 }
      );
    }

    // Update user verification status
    user.isVerified = true;
    user.verifyCode = undefined;
    user.verifyCodeExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
} 