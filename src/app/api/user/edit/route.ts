import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/mongo/db";
import UserData from "@/mongo/model/user";

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await UserData.findOne({ userId });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const payload = await req.json();

    // Common fields
    if (payload.bio !== undefined) user.bio = payload.bio;
    if (payload.firstName !== undefined) user.firstName = payload.firstName;
    if (payload.lastName !== undefined) user.lastName = payload.lastName;

    // Freelancer-specific fields
    if (user.role === "freelancer") {
      if (payload.skills !== undefined) user.skills = payload.skills;
      if (payload.portfolio !== undefined) user.portfolio = payload.portfolio;
      if (payload.experienceLevel !== undefined) user.experienceLevel = payload.experienceLevel;
    }

    // Client-specific fields
    if (user.role === "client") {
      if (payload.companyName !== undefined) user.companyName = payload.companyName;
      if (payload.companyWebsite !== undefined) user.companyWebsite = payload.companyWebsite;
    }

    await user.save();

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error in PATCH /api/user/edit:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
