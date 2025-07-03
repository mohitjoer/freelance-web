import { NextResponse } from 'next/server';
import connectDB from '@/mongo/db';
import Job from '@/mongo/model/jobschema';
import UserData from '@/mongo/model/user';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get user's role
    const user = await UserData.findOne({ userId });
    if (!user || user.role !== 'freelancer') {
      return NextResponse.json({ success: false, message: 'Access denied: freelancers only.' }, { status: 403 });
    }

    // Fetch open jobs
    const openJobs = await Job.find({
      status: 'open',
      freelancerId: { $exists: false },
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: openJobs });
  } catch (error) {
    console.error('Open jobs fetch error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch jobs' }, { status: 500 });
  }
}
