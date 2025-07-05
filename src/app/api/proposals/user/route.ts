import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/mongo/db';
import Proposal from '@/mongo/model/proposalschema';
import Job from '@/mongo/model/jobschema';

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

    // Step 1: Get all proposals by freelancer
    const proposals = await Proposal.find({ freelancerId: userId }).sort({
      createdAt: -1,
    });

    // Step 2: Extract jobIds from proposals
    const jobIds = proposals.map((p) => p.jobId);

    // Step 3: Fetch all jobs with those jobIds
    const jobs = await Job.find({ jobId: { $in: jobIds } });

    // Step 4: Attach job data to each proposal
    const proposalsWithJobs = proposals.map((proposal) => {
      const job = jobs.find(
        (j) => j.jobId === proposal.jobId // Fixed: Compare jobId with jobId, not _id with jobId
      );
      return {
        ...proposal.toObject(),
        job: job || null, // Explicitly set to null if job not found
      };
    });

    return NextResponse.json({ success: true, data: proposalsWithJobs });
  } catch (error) {
    console.error('[GET_USER_PROPOSALS]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}