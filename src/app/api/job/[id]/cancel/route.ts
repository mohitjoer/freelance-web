import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/mongo/db";
import Job from "@/mongo/model/jobschema";

// PATCH /api/job/[id]/cancel → Cancel a job
export async function PATCH(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
    }

    if (job.clientId !== userId) {
      return NextResponse.json({ success: false, message: "Forbidden: You do not own this job." }, { status: 403 });
    }

    if (job.status === "completed") {
      return NextResponse.json({ success: false, message: "Completed jobs cannot be cancelled." }, { status: 400 });
    }

    job.status = "cancelled";
    await job.save();

    return NextResponse.json({ success: true, message: "Job cancelled successfully", data: job });
  } catch (error) {
    console.error("Cancel job error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}