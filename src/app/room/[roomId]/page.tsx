import { redirect, notFound } from "next/navigation";
import connectChatDB from "@/chatmongo/chatdb";
import Room from "@/chatmongo/model/room";
import { requireRoomAccess } from "@/lib/room-access";
import ChatRoom from "./ChatRoom";

export const dynamic = "force-dynamic";

function ChatUnavailable() {
  return (
    <div className="flex h-dvh items-center justify-center bg-canvas px-5">
      <div className="max-w-sm text-center">
        <h1 className="text-lg font-semibold text-ink">Chat is temporarily unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We could not reach the chat service. Please try again shortly.
        </p>
      </div>
    </div>
  );
}

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;

  // Session + job-membership check. A signed-in non-participant must not see the thread.
  const { error, status } = await requireRoomAccess(roomId);
  if (error) {
    // Signed out -> send them to sign in. Wrong job or not a participant -> 404,
    // so the page does not confirm that the job exists.
    if (status === 401) redirect(`/sign-in?redirect=/room/${roomId}`);
    if (status === 503) return <ChatUnavailable />;
    notFound();
  }

  try {
    await connectChatDB();
  } catch (err) {
    console.error("Chat database unavailable:", err);
    return <ChatUnavailable />;
  }

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
