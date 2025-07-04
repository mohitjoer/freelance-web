// File: /app/api/proposal/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/mongo/db';
import Proposal from '@/mongo/model/proposalschema';
import Job from '@/mongo/model/jobschema';
import User from '@/mongo/model/user';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { jobId, message, proposedAmount, estimatedDays } = await req.json();

    if (!jobId || !message || !proposedAmount || !estimatedDays) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();




    // Confirm job exists and is open
    const job = await Job.findOne({ jobId });

    if (!job || job.status !== 'open') {
      return NextResponse.json({ success: false, message: 'Invalid or closed job' }, { status: 400 });
    }

    // Ensure user is a freelancer
    const freelancer = await User.findOne({ userId: userId, role: 'freelancer' });
    if (!freelancer) {
      return NextResponse.json({ success: false, message: 'Only freelancers can submit proposals' }, { status: 403 });
    }

    // Check if proposal already submitted
    const alreadyProposed = await Proposal.findOne({ jobId: job.jobId, freelancerId: userId });
    if (alreadyProposed) {
      return NextResponse.json({ success: false, message: 'You have already submitted a proposal for this job' }, { status: 409 });
    }

    // Create new proposal
    const newProposal = await Proposal.create({
      proposalId: uuidv4(), 
      jobId: job.jobId,
      freelancerId: userId,
      message,
      proposedAmount,
      estimatedDays,
      status: 'pending',
    });

    // Update job with proposal
    job.proposals.push(newProposal.proposalId);
    await job.save();

    // Update freelancer profile with proposal
    freelancer.jobsProposed.push(newProposal.proposalId);
    await freelancer.save();

    return NextResponse.json({
      success: true,
      message: 'Proposal submitted successfully',
      data: newProposal,
    });
  } catch (error) {
    console.error('Proposal submission error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
