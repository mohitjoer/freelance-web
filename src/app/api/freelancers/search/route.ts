import { NextRequest, NextResponse } from "next/server";
import UserData from "@/mongo/model/user";
import { connectDB } from "@/lib/db";

// Utility functions
function sanitizeString(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;

    // Sanitize and validate params
    const query = sanitizeString(searchParams.get("query") || "", 500);
    const category = sanitizeString(searchParams.get("category") || "", 100);
    const location = sanitizeString(searchParams.get("location") || "", 100);
    const availability = sanitizeString(
      searchParams.get("availability") || "",
      100
    );

    const skills =
      searchParams
        .get("skills")
        ?.split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0) || [];

    let page = parseInt(searchParams.get("page") || "1", 10);
    let limit = parseInt(searchParams.get("limit") || "12", 10);
    let minRating = parseFloat(searchParams.get("minRating") || "0");

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 12;
    if (limit > 100) limit = 100;
    if (isNaN(minRating) || minRating < 0) minRating = 0;
    if (minRating > 5) minRating = 5;

    // Build filter with proper typing
    interface MongoFilter {
      role: string;
      $or?: Array<Record<string, unknown>>;
      skills?: { $in: RegExp[] };
      category?: string;
      ratings?: { $gte: number };
      location?: { $regex: string; $options: string };
      availability?: string;
    }

    const filter: MongoFilter = { role: "freelancer" };

    if (query) {
      const escapedQuery = escapeRegex(query);
      filter.$or = [
        { firstName: { $regex: escapedQuery, $options: "i" } },
        { lastName: { $regex: escapedQuery, $options: "i" } },
        { skills: { $in: [new RegExp(escapedQuery, "i")] } },
        { bio: { $regex: escapedQuery, $options: "i" } },
      ];
    }

    if (skills.length > 0) {
      filter.skills = { $in: skills.map((s) => new RegExp(s, "i")) };
    }

    if (category) filter.category = category;
    if (minRating > 0) filter.ratings = { $gte: minRating };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (availability) filter.availability = availability;

    const skip = (page - 1) * limit;

    // ✅ Include userId in projection (fix for email issue)
    const [freelancers, total] = await Promise.all([
      UserData.find(filter)
        .select("-__v")
        .sort({ ratings: -1, projects_done: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserData.countDocuments(filter),
    ]);

    const transformedFreelancers = freelancers.map(
      (f: Record<string, unknown>) => ({
        _id: f._id,
        name: `${f.firstName || ""} ${f.lastName || ""}`.trim(),
        email: f.userId, // ✅ userId is now available
        skills: (f.skills as string[]) || [],
        category: (f.category as string) || "General",
        rating: (f.ratings as number) || 0,
        location: (f.location as string) || "Not specified",
        availability: (f.availability as string) || "available",
        completedJobs: (f.projects_done as number) || 0,
        bio: (f.bio as string) || "",
        profileImage: f.userImage as string | undefined,
        hourlyRate: (f.hourlyRate as number) || 0,
      })
    );

    return NextResponse.json({
      success: true,
      data: transformedFreelancers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to search freelancers",
      },
      { status: 500 }
    );
  }
}
