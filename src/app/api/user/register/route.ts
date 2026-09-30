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
        userImage: body.userImage || '/default-avatar.png',
        firstName: body.firstName,
        lastName: body.lastName,
        role: body.role,
        bio: body.bio,
        companyName: body.companyName || '',
        companyWebsite: body.companyWebsite || '',
        reviews: [],
      });
    } else if (body.role === 'freelancer') {
      await UserData.create({
        userId: body.userId,
        userImage: body.userImage || '/default-avatar.png',
        firstName: body.firstName,
        lastName: body.lastName,
        role: body.role,
        bio: body.bio,
        skills: Array.isArray(body.skills) ? body.skills : [],
        experienceLevel: body.experienceLevel || 'beginner',
        portfolio: Array.isArray(body.portfolio) ? body.portfolio : [],
        reviews: [],
      });
    } else {
      // An unrecognised role would fall through both branches and report
      // success without writing a document, bouncing the user back here.
      return NextResponse.json(
        { success: false, message: 'Pick a role before continuing.' },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
