import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/mongo/db';
import Job from '@/mongo/model/jobschema';
import { auth } from '@clerk/nextjs/server';

async function handleJobCompletion(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    await connectDB();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await the params before accessing properties
    const { jobId } = await params;

    const text = await req.text();
    if (!text) {
      return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
    }

    let body;
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
    }

    const { role }: { role: 'client' | 'freelancer' } = body;

    if (!role || !['client', 'freelancer'].includes(role)) {
      return NextResponse.json({ error: 'Valid role is required' }, { status: 400 });
    }

    const job = await Job.findOne({ jobId });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Clerk ID-based verification
    if (role === 'client' && job.clientId !== userId) {
      return NextResponse.json({ error: 'Forbidden: Not authorized as the client' }, { status: 403 });
    }

    if (role === 'freelancer' && job.freelancerId !== userId) {
      return NextResponse.json({ error: 'Forbidden: Not authorized as the freelancer' }, { status: 403 });
    }

    // Mark role-based completion
    if (role === 'client') {
      job.clientMarkedComplete = true;
    } else if (role === 'freelancer') {
      job.freelancerMarkedComplete = true;
    }

    // Mark fully completed
    if (job.clientMarkedComplete && job.freelancerMarkedComplete) {
      job.status = 'completed';
      job.finishedAt = new Date();
    }

    await job.save();

    return NextResponse.json({
      success: true,
      message: `Marked as complete by ${role}`,
      job,
    });
  } catch (error) {
    console.error('[JOB_COMPLETE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  return handleJobCompletion(req, context);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  return handleJobCompletion(req, context);
}