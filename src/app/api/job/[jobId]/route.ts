import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/mongo/db';
import Job from '@/mongo/model/jobschema';
import User from '@/mongo/model/user';
import { isValidObjectId } from 'mongoose';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  // Await params before using its properties
  const { jobId } = await context.params;

  try {
    await connectDB();

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Check if it's a valid UUID format (36 characters with hyphens)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    let job;
    
    if (uuidRegex.test(jobId)) {
      // It's a UUID, search by jobId field
      job = await Job.findOne({ jobId }).lean();
    } else if (isValidObjectId(jobId)) {
      // It's a MongoDB ObjectId, search by _id
      job = await Job.findById(jobId).lean();
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid Job ID format' },
        { status: 400 }
      );
    }

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    // Type assertion to access clientId property
    const jobData = job as any;
    const client = await User.findOne({ userId: jobData.clientId }).select('firstName lastName userImage');

    const jobWithClient = {
      ...job,
      client: client ? {
        name: `${client.firstName} ${client.lastName || ''}`.trim(),
        image: client.userImage,
      } : null
    };

    return NextResponse.json({ success: true, data: jobWithClient }, { status: 200 });
  } catch (err) {
    console.error('[GET_JOB]', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}