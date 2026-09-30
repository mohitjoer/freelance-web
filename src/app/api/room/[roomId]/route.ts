// app/api/room/[roomId]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/chatmongo/chatdb";
import Room from "@/chatmongo/model/room";
import { requireRoomAccess } from "@/lib/room-access";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;

    const { error } = await requireRoomAccess(roomId);
    if (error) return error;

    await connectDB();

    let room = await Room.findOne({ roomId });

    if (!room) {
      room = new Room({ roomId, messages: [] });
      await room.save();
      console.log(`Room ${roomId} created successfully`);
    }

    return NextResponse.json(room);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch room",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;

    // senderId and role come from the session, never from the request body.
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
    console.error("POST /api/room/[roomId] error:", error);
    return NextResponse.json(
      {
        error: "Failed to add message",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
