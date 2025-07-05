import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/mongo/db';
import Job from '@/mongo/model/jobschema';
import UserData from '@/mongo/model/user';
import { auth } from '@clerk/nextjs/server';
import Proposal from '@/mongo/model/proposalschema';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await context.params;
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get user's role
    const user = await UserData.findOne({ userId });
    if (!user || user.role !== 'client') {
      return NextResponse.json({ success: false, message: 'Access denied: client only.' }, { status: 403 });
    }

    // Validate jobId and check ownership
    const job = await Job.findOne({ jobId: jobId });
    if (!job) {
      return NextResponse.json({ success: false, message: 'Job not found.' }, { status: 404 });
    }
    
    if (userId !== job.clientId) {
      return NextResponse.json({ success: false, message: 'Access denied: not the job owner.' }, { status: 403 });
    }

    // Fetch proposals for this job
    const proposals = await Proposal.find({ jobId: jobId });

    if (!proposals || proposals.length === 0) {
      return NextResponse.json({ success: true, message: 'No proposals found' });
    }

    return NextResponse.json({ success: true, data: proposals });
  } catch (error) {
    console.error('Proposals fetch error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch proposals' }, { status: 500 });
  }
}