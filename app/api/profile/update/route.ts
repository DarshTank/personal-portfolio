import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import UserModel from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import { isValidEmail, isValidPassword } from "@/lib/utils";

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const {
      fullname,
      email,
      currentPassword,
      newPassword,
      confirmPassword,
    } = body;

    // Find user
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // If updating password
    if (newPassword) {
      // Validate new password
      if (!isValidPassword(newPassword)) {
        return NextResponse.json(
          {
            message:
              "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
          },
          { status: 400 }
        );
      }

      // Check if passwords match
      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { message: "New passwords do not match" },
          { status: 400 }
        );
      }

      // Verify current password
      const isValidCurrentPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isValidCurrentPassword) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 401 }
        );
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    // Update user profile
    user.fullname = fullname;
    await user.save();

    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
} 