import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/mongo/db';
import Review from '@/mongo/model/reviewschema';

// GET: Get reviews for a specific job
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const jobId = params.id;

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    await connectDB();

    // Get all reviews for the job
    const reviews = await Review.find({ jobId })
      .populate('reviewerId', 'firstName lastName userImage')
      .populate('revieweeId', 'firstName lastName userImage')
      .sort({ createdAt: -1 });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching job reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
