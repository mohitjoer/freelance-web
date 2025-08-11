// app/api/room/[roomId]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/chatmongo/chatdb";
import Room from "@/chatmongo/model/room";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    await connectDB();
    

    let room = await Room.findOne({ roomId });

    if (!room) {
      room = new Room({
        roomId,
        messages: []
      });
      await room.save();
      console.log(`Room ${roomId} created successfully`);
    }
    
    return NextResponse.json(room);
  } catch (error) {
    return NextResponse.json({ 
      error: "Failed to fetch room",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const body = await req.json();
    const { senderId, role, message } = body;

    if (!senderId || !role || !message) { 
      return NextResponse.json(
        { 
          error: "Missing required fields", 
          required: ["senderId", "role", "message"],
          received: { senderId, role, message }
        }, 
        { status: 400 }
      );
    }

    await connectDB();

    let room = await Room.findOne({ roomId });
    if (!room) {
      room = new Room({
        roomId,
        messages: []
      });
    }

    room.messages.push({ 
      senderId, 
      role, 
      message, 
      timestamp: new Date() 
    });
    await room.save();

    
    return NextResponse.json({ success: true, room });
  } catch (error) {
    
    return NextResponse.json({ 
      error: "Failed to add message",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}