// src/app/api/user/report/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/mongo/db";
import Report from "@/mongo/model/repotschema";
import Job from "@/mongo/model/jobschema"; // 🔹 make sure you have this
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { reporterId, reportedId, reason, jobId } = await req.json();

    if (!reporterId || !reportedId || !reason || !jobId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save the report
    const report = new Report({
      reportId: uuidv4(),
      reporterId,
      reportedId,
      reason,
      jobId,
    });

    await report.save();

    // 🔹 Mark the job as cancelled
    await Job.findOneAndUpdate(
      { jobId },
      { status: "cancelled" },
      { new: true }
    );

    return NextResponse.json({ message: "Report submitted and job cancelled" });
  } catch (error) {
    console.error("Error submitting report:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
