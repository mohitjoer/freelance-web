import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/mongo/db';
import UserData from '@/mongo/model/user';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await UserData.findOne({ userId, role: 'freelancer' });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Freelancer profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: user.userId,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        image: user.userImage,
        bio: user.bio,
        skills: user.skills,
        portfolio: user.portfolio || [],
        experienceLevel: user.experienceLevel,
        projects_done: user.projects_done || 0,
        jobsTaken: user.jobsTaken || [],
        jobsProposed: user.jobsProposed || [],
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
