// app/api/room/[roomId]/message/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/chatmongo/chatdb";
import Room from "@/chatmongo/model/room";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const { senderId, role, message } = await req.json();
    
    if (!senderId || !role || !message) {
      return NextResponse.json(
        { error: "Missing required fields: senderId, role, message" }, 
        { status: 400 }
      );
    }

    await connectDB();
    
    const room = await Room.findOneAndUpdate(
      { roomId },
      { 
        $push: { 
          messages: { 
            senderId, 
            role, 
            message, 
            timestamp: new Date() 
          } 
        } 
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, room });
  } catch (error) {
    console.error("POST /api/room/[roomId]/message error:", error);
    return NextResponse.json({ 
      error: "Failed to add message",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}