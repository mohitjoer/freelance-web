// app/api/room/[roomId]/socket-token/route.ts
import { NextResponse } from "next/server";
import { requireRoomAccess } from "@/lib/room-access";
import { issueRoomToken } from "@/lib/room-token";

/**
 * Hands the socket server a signed, expiring assertion for this room.
 * Membership is decided here, where the jobs collection is available; the
 * socket process only has to verify the signature.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;

    const { access, error } = await requireRoomAccess(roomId);
    if (error) return error;

    return NextResponse.json({
      token: issueRoomToken({ userId: access.userId, role: access.role, roomId }),
    });
  } catch (err) {
    console.error("GET /api/room/[roomId]/socket-token error:", err);
    return NextResponse.json({ error: "Failed to issue room token" }, { status: 500 });
  }
}
