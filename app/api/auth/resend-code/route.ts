import { NextResponse } from "next/server";
import UserModel from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import { generateVerificationCode } from "@/lib/utils";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { email } = body;

    // Find user
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Generate new verification code
    const verifyCode = generateVerificationCode();
    const verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new verification code
    user.verifyCode = verifyCode;
    user.verifyCodeExpiry = verifyCodeExpiry;
    await user.save();

    // Send verification email
    await sendVerificationEmail(email, verifyCode);

    return NextResponse.json(
      { message: "Verification code sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Resend code error:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
} 