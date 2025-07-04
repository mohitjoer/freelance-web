// /app/api/job/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/mongo/db";
import Job from "@/mongo/model/jobschema";
import UserData from "@/mongo/model/user";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const requiredFields = ["title", "description", "category", "budget", "deadline"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, message: `${field} is required.` }, { status: 400 });
      }
    }

    // Create the job
    const job = await Job.create({
      jobId: uuidv4(),
      title: body.title,
      description: body.description,
      category: body.category,
      budget: body.budget,
      deadline: new Date(body.deadline),
      clientId: userId,
      references: body.references || [],
      resources: body.resources || [],
    });

    
    await UserData.findOneAndUpdate(
      { userId },
      { $push: { jobsPosted: job.jobId.toString() } }
    );

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error("Job creation error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
