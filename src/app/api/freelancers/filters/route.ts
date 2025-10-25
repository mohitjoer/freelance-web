import { NextResponse } from "next/server";
import mongoose from "mongoose";
import UserData from "@/mongo/model/user";

async function connectDB() {
  // if (mongoose.connection.readyState >= 1) return;

 const { readyState } = mongoose.connection;
 if (readyState === 1) {
   return;
 }
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

export async function GET() {
  try {
    await connectDB();

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
  } catch (error: any) {
    console.error("Filters error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch filters" },
      { status: 500 }
    );
  }
}
