
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/mongo/db";
import Job from "@/mongo/model/jobschema";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const jobs = await Job.find({ clientId: userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: jobs });
  } catch (err) {
    console.error("Error fetching client jobs:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
