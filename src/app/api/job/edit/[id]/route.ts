import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/mongo/db';
import Job from '@/mongo/model/jobschema';
import UserData from '@/mongo/model/user';

// GET /api/job/[id] → Fetch job details
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const job = await Job.findById(params.id);

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
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const job = await Job.findById(params.id);
    if (!job) {
      
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    if (job.clientId !== userId) {
      console.log('Forbidden: Not your job', { jobClientId: job.clientId, userId });
      return NextResponse.json({ success: false, message: 'Forbidden: Not your job' }, { status: 403 });
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
