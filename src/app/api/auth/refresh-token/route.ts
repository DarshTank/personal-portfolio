import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { UserModel } from "@/models/User";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json(
        { message: "Refresh token is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find user with matching refresh token
    const user = await UserModel.findOne({ refreshToken });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Generate new access token
    const accessToken = sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );

    // Generate new refresh token
    const newRefreshToken = user.generateRefreshToken();
    await user.save();

    // Create response with cookie
    const response = NextResponse.json({
      message: "Token refreshed successfully",
      refreshToken: newRefreshToken,
    });

    response.cookies.set("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (error: any) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { message: error.message || "Error refreshing token" },
      { status: 500 }
    );
  }
} 