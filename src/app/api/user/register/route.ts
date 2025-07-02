import { NextResponse } from 'next/server';
import connectDB from '@/mongo/db';
import UserData from '@/mongo/model/user';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    const exists = await UserData.findOne({ userId: body.userId });
    if (exists) {
      return NextResponse.json({ success: true, message: 'Already registered' });
    }

    if (body.role === 'client') {
      await UserData.create({
      userId: body.userId,
      userImage: body.userImage,
      firstName: body.firstName,
      lastName: body.lastName,
      role: body.role,
      bio: body.bio,
      companyName: body.companyName ? body.companyName : "",
      companyWebsite: body.companyWebsite ? body.companyWebsite : "",
    })
    } 

    if (body.role === 'freelancer') {
      await UserData.create({
        userId: body.userId,
        userImage: body.userImage,
        firstName: body.firstName,
        lastName: body.lastName,
        role: body.role,
        bio: body.bio,
        skills: Array.isArray(body.skills) ? body.skills : [],
        experienceLevel: body.experienceLevel || 'beginner',
        portfolio: Array.isArray(body.portfolio) ? body.portfolio : [],
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
