// /app/api/profile/[userId]/route.ts

import { NextResponse } from 'next/server';
import  connectDB  from '@/mongo/db';
import UserData from '@/mongo/model/user';

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();
    const user = await UserData.findOne({ userId: params.userId }).select('-_id -__v');

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
