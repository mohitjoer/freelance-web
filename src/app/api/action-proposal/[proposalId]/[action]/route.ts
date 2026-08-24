import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from "@/lib/session";
import Job from '@/mongo/model/jobschema';
import Proposal from '@/mongo/model/proposalschema';
import User from '@/mongo/model/user';
import Notification from '@/mongo/model/notificationschema';
import { v4 as uuidv4 } from 'uuid';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ proposalId: string; action: string }> }
) {
  
  try {
    // Await the params before destructuring
    const { proposalId, action } = await context.params;
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const jobId = url.searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({ success: false, message: 'Missing jobId' }, { status: 400 });
    }

    if (!['accept', 'reject'].includes(action)) {
      return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }

    
    const job = await Job.findOne({ jobId, clientId: userId });
    
    if (!job) {
      console.log('Error: Job not found or unauthorized');
      return NextResponse.json({ success: false, message: 'Unauthorized or job not found' }, { status: 403 });
    }
    
    // Check if this proposal is already accepted
    if (job.status === 'in-progress' && job.acceptedProposalId === proposalId && action === 'accept') {
      
      return NextResponse.json({
        success: true,
        message: 'Proposal already accepted successfully.',
      });
    }
    
    if (job.status !== 'open') {

      const message = job.status === 'in-progress' 
        ? 'Job is already in progress - proposal has been accepted' 
        : 'Job is not open for proposals';
      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    if (job.acceptedProposalId) {
      
      return NextResponse.json({ success: false, message: 'Job already has an accepted proposal' }, { status: 400 });
    }
    
    const proposal = await Proposal.findOne({ proposalId });
    
    
    if (!proposal) {
      
      return NextResponse.json({ success: false, message: 'Proposal not found' }, { status: 404 });
    }

    if (action === 'accept') {
      // Update job status and assign freelancer
      await Job.findOneAndUpdate({ jobId: jobId }, {
        status: 'in-progress',
        freelancerId: proposal.freelancerId,
        acceptedProposalId: proposalId,
        budget: proposal.proposedAmount,
        startedAt: new Date(),
      });

      // Add job to client's in progress jobs
      await User.findOneAndUpdate(
        { userId: job.clientId },
        { $push: {jobsInProgress: job.jobId } }
      );


      // Add job to freelancer's in progress jobs
      await User.findOneAndUpdate(
        { userId: proposal.freelancerId },
        { $push: { jobsInProgress: job.jobId } }
      );

      // Update proposal status to accepted
      await Proposal.findOneAndUpdate(
        { proposalId: proposal.proposalId }, 
        { status: 'accepted' }
      );

      // Optionally: Reject all other proposals for this job
      await Proposal.updateMany(
        { 
          jobId: job.jobId, 
          proposalId: { $ne: proposalId }, 
          status: 'pending' 
        },
        { status: 'rejected' }
      );

    } else if (action === 'reject') {
      await Proposal.findOneAndUpdate(
        { proposalId: proposal.proposalId },
        { status: 'rejected' }
      );
    }

    // Notify the freelancer(s) (best effort — never fail the request)
    try {
      if (action === 'accept') {
        await Notification.create({
          notificationId: uuidv4(),
          userId: proposal.freelancerId,
          type: 'proposal_accepted',
          title: 'Proposal accepted',
          message: `Your proposal for "${job.title}" was accepted. The job is now in progress.`,
          link: `/jobs/${job.jobId}`,
          jobId: job.jobId,
        });

        // Notify freelancers whose proposals were auto-rejected
        const autoRejected = await Proposal.find({
          jobId: job.jobId,
          proposalId: { $ne: proposalId },
          status: 'rejected',
          freelancerId: { $ne: proposal.freelancerId },
        }).lean();

        if (autoRejected.length > 0) {
          await Notification.insertMany(
            autoRejected.map((pr) => ({
              notificationId: uuidv4(),
              userId: pr.freelancerId,
              type: 'proposal_rejected',
              title: 'Proposal not selected',
              message: `Your proposal for "${job.title}" was not selected this time.`,
              link: `/jobs/open`,
              jobId: job.jobId,
            }))
          );
        }
      } else {
        await Notification.create({
          notificationId: uuidv4(),
          userId: proposal.freelancerId,
          type: 'proposal_rejected',
          title: 'Proposal declined',
          message: `Your proposal for "${job.title}" was declined by the client.`,
          link: `/jobs/open`,
          jobId: job.jobId,
        });
      }
    } catch (err) {
      console.error('Failed to create notifications:', err);
    }

    return NextResponse.json({
      success: true,
      message: `Proposal ${action}ed successfully.`,
    });

  } catch (error) {
    console.error('PATCH /api/action-proposal/[proposalId]/[action] error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}