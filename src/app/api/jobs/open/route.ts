import { NextResponse } from 'next/server';
import connectDB from '@/mongo/db';
import Job from '@/mongo/model/jobschema';
import UserData from '@/mongo/model/user';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await UserData.findOne({ userId });
    if (!user || user.role !== 'freelancer') {
      return NextResponse.json(
        { success: false, message: 'Access denied: freelancers only.' },
        { status: 403 }
      );
    }

    // Fetch all open jobs with no assigned freelancer
    const openJobs = await Job.find({
      status: 'open',
      freelancerId: { $exists: false },
    }).sort({ createdAt: -1 });

    // Fetch associated client data for each job
    const jobsWithClientDetails = await Promise.all(
      openJobs.map(async (job) => {
        const client = await UserData.findOne({ userId: job.clientId }).select('firstName lastName userImage');

        return {
          _id: job._id,
          jobId: job.jobId,
          title: job.title,
          description: job.description,
          category: job.category,
          budget: job.budget,
          deadline: job.deadline,
          status: job.status,
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,

          // Client details
          client: {
            clientId: job.clientId,
            name: `${client?.firstName || ''} ${client?.lastName || ''}`.trim(),
            image: client?.userImage || '/default-avatar.png',
          },
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: jobsWithClientDetails,
      count: jobsWithClientDetails.length,
    });
  } catch (error) {
    console.error('Open jobs fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
