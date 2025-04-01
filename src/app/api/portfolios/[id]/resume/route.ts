import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/token";
import { connectToDatabase } from "@/lib/db";
import { PortfolioModel } from "@/models/Portfolio";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded || typeof decoded === "string") {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    await connectToDatabase();

    const formData = await req.formData();
    const file = formData.get('resume') as File;
    
    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    // Here you would:
    // 1. Upload the file to your storage service (e.g., AWS S3, Cloudinary)
    // 2. Get the URL of the uploaded file
    // 3. Save the URL to the portfolio document

    // Example with a hypothetical upload service:
    // const resumeUrl = await uploadFileToStorage(file);
    
    const resumeUrl = "your-storage-url/resume.pdf"; // Replace with actual upload logic

    // Update portfolio with resume URL
    await PortfolioModel.findByIdAndUpdate(params.id, {
      resumeUrl: resumeUrl
    });

    return NextResponse.json({
      message: "Resume uploaded successfully",
      resumeUrl: resumeUrl
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
} 