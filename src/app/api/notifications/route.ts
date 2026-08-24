import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from "@/lib/session";
import connectDB from '@/mongo/db';
import Notification from '@/mongo/model/notificationschema';

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error('GET /api/notifications error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    if (body.action === 'markAllRead') {
      await connectDB();
      await Notification.updateMany({ userId, read: false }, { read: true });
      return NextResponse.json({ success: true, message: 'All notifications marked as read' });
    }

    if (body.action === 'markRead' && typeof body.notificationId === 'string') {
      await connectDB();
      await Notification.findOneAndUpdate(
        { notificationId: body.notificationId, userId },
        { read: true }
      );
      return NextResponse.json({ success: true, message: 'Notification marked as read' });
    }

    return NextResponse.json({ success: false, message: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('PATCH /api/notifications error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
