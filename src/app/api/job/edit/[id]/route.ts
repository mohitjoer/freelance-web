import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/mongo/db';
import Job from '@/mongo/model/jobschema';


// GET /api/job/[id] → Fetch job details
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error('GET /api/job/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/job/[id] → Update job details
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const job = await Job.findById(id);
    if (!job) {
      
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    if (job.clientId !== userId) {
      console.log('Forbidden: Not your job', { jobClientId: job.clientId, userId });
      return NextResponse.json({ success: false, message: 'Forbidden: Not your job' }, { status: 403 });
    }

    if (job.status === "in-progress") {
      return NextResponse.json({ success: false, message: "in-progress jobs cannot be edited ." }, { status: 400 });
    }
    
    if (job.status === "cancelled") {
      return NextResponse.json({ success: false, message: "Cancelled jobs cannot be edited ." }, { status: 400 });
    }

    
    if (job.status === "completed") {
      return NextResponse.json({ success: false, message: "Completed jobs cannot be edited." }, { status: 400 });
    }

    const payload = await req.json();
 

    const updatableFields = ['title', 'description', 'category', 'budget', 'deadline', 'references', 'resources'];
    for (const field of updatableFields) {
      if (payload[field] !== undefined) {
        job[field] = field === 'budget' ? parseFloat(payload[field]) : payload[field];
      }
    }

    await job.save();

    return NextResponse.json({ success: true, message: 'Job updated successfully', data: job });
  } catch (error) {
    console.error('PATCH /api/job/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}