import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import UserData from "@/mongo/model/user";

async function connectDB() {
  const { readyState } = mongoose.connection;

  if (readyState === 1) return; // already connected
  if (readyState === 2) {
    await mongoose.connection.asPromise();
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

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

    // Build filter
    const filter: any = { role: "freelancer" };

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

    const transformedFreelancers = freelancers.map((f) => ({
      _id: f._id,
      name: `${f.firstName} ${f.lastName || ""}`.trim(),
      email: f.userId, // ✅ userId is now available
      skills: f.skills || [],
      category: f.category || "General",
      rating: f.ratings || 0,
      location: f.location || "Not specified",
      availability: f.availability || "available",
      completedJobs: f.projects_done || 0,
      bio: f.bio || "",
      profileImage: f.userImage,
      hourlyRate: f.hourlyRate || 0,
    }));

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
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to search freelancers",
      },
      { status: 500 }
    );
  }
}
