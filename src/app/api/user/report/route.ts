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

    // Check if user has 5 or more reports
    const existingReports = await Report.countDocuments({ reportedId });
    
    if (existingReports >= 4) {
      // This will be the 5th report, ban the user
      try {
        await fetch(`${process.env.CLERK_API_BASE}/v1/users/${reportedId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            banned: true
          })
        });
      } catch (clerkError) {
        console.error("Error banning user in Clerk:", clerkError);
      }
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
