import { redirect } from "next/navigation";
import { getUserId } from "@/lib/session";
import connectChatDB from "@/chatmongo/chatdb";
import Room from "@/chatmongo/model/room";
import ChatRoom from "./ChatRoom";

export const dynamic = "force-dynamic";

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  // Session check and DB connection are independent
  // react-doctor-disable-next-line -- already wrapped in Promise.all; detector misses imported helpers
  const [userId] = await Promise.all([getUserId(), connectChatDB()]);
  if (!userId) redirect(`/sign-in?redirect=/room/${roomId}`);

  // Mirrors GET /api/room/[roomId] (chat database, not the main one)
  const room = await Room.findOne({ roomId }).lean();

  return (
    <ChatRoom
      roomId={roomId}
      initialMessages={
        room?.messages?.map((m, i) => ({
          _id: String((m as { _id?: unknown })._id ?? i),
          senderId: m.senderId,
          role: m.role,
          message: m.message,
          // Deterministic fallback avoids SSR/client hydration mismatch
          timestamp: (m.timestamp ?? new Date(0)).toISOString(),
        })) ?? []
      }
    />
  );
}
