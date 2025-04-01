import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { PortfolioModel } from "@/models/Portfolio";
import { UserModel } from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { JwtPayload } from "jsonwebtoken";

const isJwtPayload = (decoded: string | JwtPayload): decoded is JwtPayload => {
  return typeof decoded !== "string" && "id" in decoded;
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await connectToDatabase();

    // Try to find the portfolio without authentication first
    let portfolio = await PortfolioModel.findOne({ _id: id });

    // If portfolio is not found or not published, check authentication
    if (!portfolio || !portfolio.isPublished) {
      const authHeader = req.headers.get("authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
          { error: "No token provided" },
          { status: 401 }
        );
      }

      const token = authHeader.split(" ")[1];
      const decoded = await verifyToken(token);

      if (!isJwtPayload(decoded)) {
        return NextResponse.json(
          { error: "Invalid token format" },
          { status: 401 }
        );
      }

      const user = await UserModel.findById(decoded.id);
      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      portfolio = await PortfolioModel.findOne({
        userId: user._id,
        _id: id,
      });
    }

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ portfolio });
  } catch (error: any) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    // Get token from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    console.log("Received token:", token.substring(0, 10) + "...");
    
    try {
      const decoded = await verifyToken(token);
      console.log("Decoded token:", decoded);

      if (!isJwtPayload(decoded)) {
        return NextResponse.json(
          { error: "Invalid token format" },
          { status: 401 }
        );
      }

      await connectToDatabase();
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const portfolio = await PortfolioModel.findOne({
        userId: user._id,
        _id: id,
      });

      if (!portfolio) {
        return NextResponse.json(
          { error: "Portfolio not found" },
          { status: 404 }
        );
      }

      const body = await req.json();
      
      // Update portfolio fields
      portfolio.username = body.username || portfolio.username;
      portfolio.fullname = body.fullname || portfolio.fullname;
      portfolio.role = body.role || portfolio.role;
      portfolio.brandTitle = body.brandTitle || portfolio.brandTitle;
      portfolio.email = body.email || portfolio.email;
      portfolio.about = body.about || portfolio.about;
      portfolio.linkedin = body.linkedin || portfolio.linkedin;
      portfolio.github = body.github || portfolio.github;
      portfolio.instagram = body.instagram || portfolio.instagram;
      portfolio.twitter = body.twitter || portfolio.twitter;
      portfolio.resumeUrl = body.resumeUrl || portfolio.resumeUrl;
      portfolio.template = body.template || portfolio.template;
      portfolio.sections = body.sections || portfolio.sections;
      portfolio.lastUpdated = new Date();

      await portfolio.save();

      return NextResponse.json({ portfolio });
    } catch (tokenError: any) {
      console.error("Token verification error:", tokenError);
      return NextResponse.json(
        { error: "Invalid token: " + tokenError.message },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    // Get token from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    console.log("Received token:", token.substring(0, 10) + "...");
    
    try {
      const decoded = await verifyToken(token);
      console.log("Decoded token:", decoded);

      if (!isJwtPayload(decoded)) {
        return NextResponse.json(
          { error: "Invalid token format" },
          { status: 401 }
        );
      }

      await connectToDatabase();
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const portfolio = await PortfolioModel.findOneAndDelete({
        userId: user._id,
        _id: id,
      });

      if (!portfolio) {
        return NextResponse.json(
          { error: "Portfolio not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ message: "Portfolio deleted successfully" });
    } catch (tokenError: any) {
      console.error("Token verification error:", tokenError);
      return NextResponse.json(
        { error: "Invalid token: " + tokenError.message },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json(
      { error: "Failed to delete portfolio" },
      { status: 500 }
    );
  }
} 