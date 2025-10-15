import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/mongo/db';
import Review from '@/mongo/model/reviewschema';
import UserData from '@/mongo/model/user';

// GET: Get reviews for a specific user (both given and received)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await connectDB();

    // Get reviews where the user is the reviewee
    const receivedReviews = await Review.find({ revieweeId: userId })
      .populate('reviewerId', 'firstName lastName userImage')
      .sort({ createdAt: -1 });

    // Get reviews where the user is the reviewer
    const givenReviews = await Review.find({ reviewerId: userId })
      .populate('revieweeId', 'firstName lastName userImage')
      .sort({ createdAt: -1 });

    // Calculate average rating for the user
    const allReviews = await Review.find({ revieweeId: userId });
    const averageRating = allReviews.length > 0
      ? allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length
      : 0;

    return NextResponse.json({
      receivedReviews,
      givenReviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: allReviews.length,
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
