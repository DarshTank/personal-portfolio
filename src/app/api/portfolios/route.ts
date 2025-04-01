import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { PortfolioModel } from "@/models/Portfolio";
import type { Model } from "mongoose";
import type { Portfolio } from "@/app/types/portfolio";

// Configure the route to be dynamic
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const portfolios = await PortfolioModel.find({ userId: session.user.id });
    return NextResponse.json(portfolios);
  } catch (error) {
    console.error("Error in GET /api/portfolios:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const portfolio = await PortfolioModel.create({
      userId: session.user.id,
      title,
      description,
      sections: [
        {
          type: "about",
          title: "About Me",
          content: "Tell us about yourself"
        },
        {
          type: "education",
          title: "Education",
          content: []
        },
        {
          type: "experience",
          title: "Experience",
          content: []
        },
        {
          type: "skills",
          title: "Skills",
          content: []
        },
        {
          type: "projects",
          title: "Projects",
          content: []
        }
      ]
    });

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Error in POST /api/portfolios:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}