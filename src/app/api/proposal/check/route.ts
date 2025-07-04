import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/mongo/db';
import Proposal from '@/mongo/model/proposalschema';
import Job from '@/mongo/model/jobschema';

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const jobId = url.searchParams.get('jobId');
  const job = await Job.findById(jobId);
  if (!job || job.status !== 'open') {
      return NextResponse.json({ success: false, message: 'Invalid or closed job' }, { status: 400 });
  }

  if (!jobId) {
    return NextResponse.json({ success: false, message: 'Missing jobId' }, { status: 400 });
  }

  try {
    await connectDB();

    const existingProposal = await Proposal.findOne({
      jobId:job.jobId,
      freelancerId: userId,
    });

    return NextResponse.json({ success: true, proposal: existingProposal || null });
  } catch (error) {
    console.error('[PROPOSAL_CHECK_ERROR]', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
