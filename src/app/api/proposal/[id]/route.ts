import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Proposal from '@/mongo/model/proposalschema';
import Job from '@/mongo/model/jobschema';
import User from '@/mongo/model/user';
import connectDB from '@/mongo/db';

// --- Update proposal---
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    // Await params before accessing its properties
    const params = await context.params;
    const proposalId = params.id;
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    if (!jobId) {
      return NextResponse.json({ success: false, message: 'Missing jobId in query' }, { status: 400 });
    }
    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON in request body' }, { status: 400 });
    }
    const { message, proposedAmount, estimatedDays } = requestBody;
    if (!message || !proposedAmount || !estimatedDays) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields: message, proposedAmount, or estimatedDays' 
      }, { status: 400 });
    }
    const job = await Job.findOne({ jobId });
    if (!job || job.status !== 'open') {
      return NextResponse.json({ success: false, message: 'Invalid or closed job' }, { status: 400 });
    }
    const updatedProposal = await Proposal.findOneAndUpdate(
      { proposalId : proposalId, freelancerId: userId, jobId : job.jobId },
      { message, proposedAmount, estimatedDays },
      { new: true }
    );
    if (!updatedProposal) {
      return NextResponse.json({ success: false, message: 'Proposal not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, proposal: updatedProposal });
  } catch (error) {
    console.error('[PROPOSAL_UPDATE_ERROR]', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined 
    }, { status: 500 });
  }
}

// --- DELETE proposal ---
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    // Await params before accessing its properties
    const params = await context.params;
    const proposalId = params.id;
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    if (!jobId) {
      return NextResponse.json({ success: false, message: 'Missing jobId in query' }, { status: 400 });
    }
    const job = await Job.findOne({ jobId });
    if (!job || job.status !== 'open') {
      return NextResponse.json({ success: false, message: 'Invalid or closed job' }, { status: 400 });
    }
    //Remove proposal from database
    const deletedProposal = await Proposal.findOneAndDelete({
      proposalId : proposalId, freelancerId: userId, jobId : job.jobId 
    });
    if (!deletedProposal) {
      return NextResponse.json({ success: false, message: 'Proposal not found' }, { status: 404 });
    }
    //Remove proposalId from user's profile
    const RemoveFromUser = await User.findOneAndUpdate(
      { userId },
      { $pull: { jobsProposed: proposalId } }
    );
    if (!RemoveFromUser) {
      return NextResponse.json({ success: false, message: 'Remove User not found' }, { status: 404 });
    }
    //Remove proposalId from jobId
    const RemoveFromJob = await Job.findOneAndUpdate(
      { jobId },
      { $pull: { proposals: proposalId } }
    );
    if (!RemoveFromJob) {
      return NextResponse.json({ success: false, message: 'Remove job array not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Proposal deleted successfully' });
  } catch (error) {
    console.error('[PROPOSAL_DELETE_ERROR]', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined 
    }, { status: 500 });
  }
}