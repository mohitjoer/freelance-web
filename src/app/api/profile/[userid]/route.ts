// /app/api/profile/[userId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/mongo/db';
import UserData from '@/mongo/model/user';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();

    // Await the params promise
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Missing userId in params' },
        { status: 400 }
      );
    }

    const user = await UserData.findOne({ userId }).select('-_id -__v');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}