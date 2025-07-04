import { NextRequest, NextResponse } from 'next/server';
import User from '@/mongo/model/user';
import connectDB from '@/mongo/db';
import  Job, { IJob } from '@/mongo/model/jobschema';


export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    await connectDB();

    if (!id || id.length !== 24) {
      return NextResponse.json(
        { success: false, message: 'Invalid Job ID format' },
        { status: 400 }
      );
    }

    const job = await Job.findById(id).lean<IJob>();
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    const client = await User.findOne({ userId: job.clientId }).select('firstName lastName userImage');
    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }

    const jobWithClient = {
      ...job,
      client: {
        name: `${client.firstName} ${client.lastName || ''}`.trim(),
        image: client.userImage,
      },
    };

    return NextResponse.json({ success: true, data: jobWithClient }, { status: 200 });

  } catch (err) {
    console.error('GET /api/job/[id] error:', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
