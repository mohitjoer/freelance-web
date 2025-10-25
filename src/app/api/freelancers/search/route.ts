import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import UserData from "@/mongo/model/user";

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;

    const query = searchParams.get("query") || "";
    const skills = searchParams.get("skills")?.split(",").filter(Boolean) || [];
    const category = searchParams.get("category") || "";
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const location = searchParams.get("location") || "";
    const availability = searchParams.get("availability") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const filter: any = { role: "freelancer" };

    if (query) {
      filter.$or = [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { skills: { $in: [new RegExp(query, "i")] } },
        { bio: { $regex: query, $options: "i" } },
      ];
    }

    if (skills.length > 0) {
      filter.skills = { $in: skills.map((skill) => new RegExp(skill, "i")) };
    }

    if (category) {
      filter.category = category;
    }

    if (minRating > 0) {
      filter.ratings = { $gte: minRating };
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (availability) {
      filter.availability = availability;
    }

    const skip = (page - 1) * limit;

    const [freelancers, total] = await Promise.all([
      UserData.find(filter)
        .select("-__v -userId")
        .sort({ ratings: -1, projects_done: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserData.countDocuments(filter),
    ]);

    // Transform data to match expected format
    const transformedFreelancers = freelancers.map((f) => ({
      _id: f._id,
      name: `${f.firstName} ${f.lastName || ""}`.trim(),
      email: f.userId, // Using userId as placeholder
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
