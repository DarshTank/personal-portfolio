import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { PortfolioModel } from "@/models/Portfolio";
import { UserModel } from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { JwtPayload } from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Configure the route to be dynamic
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const isJwtPayload = (decoded: string | JwtPayload): decoded is JwtPayload => {
  return typeof decoded !== "string" && "id" in decoded;
};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session in GET:", session); // Debug log

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - No session found" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const portfolios = await PortfolioModel.find({ userId: session.user.email });
    return NextResponse.json(portfolios);
  } catch (error: any) {
    console.error("Get portfolios error:", error);
    return NextResponse.json(
      { error: "Failed to get portfolios", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session in POST:", session); // Debug log

    if (!session?.user?.email) {
      console.log("No session found in POST request"); // Debug log
      return NextResponse.json(
        { error: "Unauthorized - No session found" },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("Request body:", body); // Debug log

    const {
      username,
      fullname,
      role,
      brandTitle,
      email,
      about,
      sections,
      theme,
      template,
      socialLinks,
      resumeUrl,
    } = body;

    // Validate required fields
    if (!username || !fullname || !role || !brandTitle || !email || !about) {
      return NextResponse.json(
        { 
          error: "Missing required fields",
          details: {
            username: !username ? "Username is required" : undefined,
            fullname: !fullname ? "Full name is required" : undefined,
            role: !role ? "Role is required" : undefined,
            brandTitle: !brandTitle ? "Brand title is required" : undefined,
            email: !email ? "Email is required" : undefined,
            about: !about ? "About section is required" : undefined,
          }
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if username is already taken
    const existingPortfolio = await PortfolioModel.findOne({ username });
    if (existingPortfolio) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }

    const portfolio = await PortfolioModel.create({
      userId: session.user.email,
      username,
      fullname,
      role,
      brandTitle,
      email,
      about,
      sections: sections || [],
      theme: theme || "light",
      template: template || "1",
      socialLinks: socialLinks || [],
      resumeUrl: resumeUrl || "",
    });

    return NextResponse.json(portfolio, { status: 201 });
  } catch (error: any) {
    console.error("Create portfolio error:", error);
    return NextResponse.json(
      { 
        error: "Failed to create portfolio",
        details: error.message
      },
      { status: 500 }
    );
  }
} 