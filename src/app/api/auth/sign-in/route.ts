import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email: body.email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValidPassword = await user.comparePassword(body.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!user.isEmailVerified) {
      return NextResponse.json(
        { 
          message: "Please verify your email first",
          email: user.email,
          verificationCode: user.generateVerificationCode()
        },
        { status: 403 }
      );
    }

    await user.save();

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error: any) {
    console.error("Sign-in error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}