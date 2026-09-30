// app/api/room/[roomId]/message/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/chatmongo/chatdb";
import Room from "@/chatmongo/model/room";
import { requireRoomAccess } from "@/lib/room-access";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;

    // senderId and role are derived from the session, not trusted from the body.
    const { access, error } = await requireRoomAccess(roomId);
    if (error) return error;

    const body = await req.json();
    const { message } = body ?? {};

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Missing required field: message" },
        { status: 400 }
      );
    }

    await connectDB();

    const room = await Room.findOneAndUpdate(
      { roomId },
      {
        $push: {
          messages: {
            senderId: access.userId,
            role: access.role,
            message: message.trim(),
            timestamp: new Date(),
          },
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, room });
  } catch (error) {
    console.error("POST /api/room/[roomId]/message error:", error);
    return NextResponse.json(
      {
        error: "Failed to add message",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
