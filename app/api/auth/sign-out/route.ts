import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear the authentication cookie
    cookies().delete("token");

    return NextResponse.json({
      message: "Signed out successfully",
    });
  } catch (error: any) {
    console.error("Sign out error:", error);
    return NextResponse.json(
      { message: error.message || "Error signing out" },
      { status: 500 }
    );
  }
} 