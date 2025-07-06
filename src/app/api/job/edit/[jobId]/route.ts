import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/mongo/db';
import Job from '@/mongo/model/jobschema';

// Define the context type explicitly
type RouteContext = {
  params: Promise<{ jobId: string }>;
};

// GET /api/job/edit/[jobId]
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Await params before accessing properties
    const { jobId } = await context.params;

    await connectDB();

    const job = await Job.findOne({ jobId: jobId });

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error('GET /api/job/edit/[jobId] error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// PATCH /api/job/edit/[jobId]
export async function PATCH(
  req: NextRequest, 
  context: RouteContext
) {
  try {
    // Await params before accessing properties
    const { jobId } = await context.params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    await connectDB();

    // Use the same field as in the GET method
    const job = await Job.findOne({ jobId: jobId });

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' }, 
        { status: 404 }
      );
    }

    if (job.clientId !== userId) {
      console.log('Forbidden: Not your job', { 
        jobClientId: job.clientId, 
        userId 
      });
      return NextResponse.json(
        { success: false, message: 'Forbidden: Not your job' }, 
        { status: 403 }
      );
    }

    if (['in-progress', 'cancelled', 'completed'].includes(job.status)) {
      return NextResponse.json(
        { success: false, message: `${job.status} jobs cannot be edited.` }, 
        { status: 400 }
      );
    }

    const payload = await req.json();
    const updatableFields = [
      'title', 
      'description', 
      'category', 
      'budget', 
      'deadline', 
      'references', 
      'resources'
    ];

    for (const field of updatableFields) {
      if (payload[field] !== undefined) {
        job[field] = field === 'budget' 
          ? parseFloat(payload[field]) 
          : payload[field];
      }
    }

    await job.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Job updated successfully', 
      data: job 
    });
  } catch (error) {
    console.error('PATCH /api/job/edit/[jobId] error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}