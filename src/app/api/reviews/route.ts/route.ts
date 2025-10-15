import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import connectDB from '@/mongo/db';
import Review from '@/mongo/model/reviewschema';
import Job from '@/mongo/model/jobschema';
import UserData from '@/mongo/model/user';

// POST: Submit a new review
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobId, revieweeId, rating, comment, revieweeRole } = await request.json();

    if (!jobId || !revieweeId || !rating || !comment || !revieweeRole) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    await connectDB();

    // Verify the job exists and is completed
    const job = await Job.findOne({ jobId, status: 'completed' });
    if (!job) {
      return NextResponse.json({ error: 'Job not found or not completed' }, { status: 404 });
    }

    // Determine if the user can review based on their role
    const isClient = job.clientId === user.id;
    const isFreelancer = job.freelancerId === user.id;

    if (!isClient && !isFreelancer) {
      return NextResponse.json({ error: 'You are not involved in this job' }, { status: 403 });
    }

    // Determine the reviewee and reviewer roles
    let actualRevieweeId, actualReviewerId, actualRevieweeRole;

    if (isClient && revieweeRole === 'freelancer') {
      actualRevieweeId = job.freelancerId;
      actualReviewerId = job.clientId;
      actualRevieweeRole = 'freelancer';
    } else if (isFreelancer && revieweeRole === 'client') {
      actualRevieweeId = job.clientId;
      actualReviewerId = job.freelancerId;
      actualRevieweeRole = 'client';
    } else {
      return NextResponse.json({ error: 'Invalid review configuration' }, { status: 400 });
    }

    if (actualRevieweeId !== revieweeId) {
      return NextResponse.json({ error: 'Reviewee does not match job participants' }, { status: 400 });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      jobId,
      reviewerId: actualReviewerId,
      revieweeId: actualRevieweeId,
    });

    if (existingReview) {
      return NextResponse.json({ error: 'Review already submitted for this job' }, { status: 409 });
    }

    // Create the review
    const review = new Review({
      reviewerId: actualReviewerId,
      revieweeId: actualRevieweeId,
      jobId,
      rating,
      comment,
      revieweeRole: actualRevieweeRole,
    });

    await review.save();

    // Update the reviewee's average rating
    const reviews = await Review.find({ revieweeId: actualRevieweeId });
    const averageRating = reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length;

    await UserData.updateOne(
      { userId: actualRevieweeId },
      { ratings: averageRating }
    );

    return NextResponse.json({ message: 'Review submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
