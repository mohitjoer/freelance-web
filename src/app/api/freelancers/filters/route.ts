import { NextResponse } from "next/server";
import UserData from "@/mongo/model/user";
import { connectDB } from "@/lib/db";

// ✅ ADD THIS
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // ✅ Handle the case where DB might not be available
    const connection = await connectDB();
    if (!connection) {
      return NextResponse.json(
        {
          success: false,
          error: "Database connection not available",
        },
        { status: 503 }
      );
    }

    const [skills, categories, locations] = await Promise.all([
      UserData.distinct("skills", { role: "freelancer" }),
      UserData.distinct("category", { role: "freelancer" }),
      UserData.distinct("location", { role: "freelancer" }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        skills: skills.filter(Boolean).sort(),
        categories: categories.filter(Boolean).sort(),
        locations: locations.filter(Boolean).sort(),
      },
    });
  } catch (error) {
    console.error("Filters error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch filters",
      },
      { status: 500 }
    );
  }
}
