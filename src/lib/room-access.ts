import { NextResponse } from "next/server";
import { getUserId } from "@/lib/session";
import connectDB from "@/mongo/db";
import Job from "@/mongo/model/jobschema";

export type RoomRole = "client" | "freelancer";

/**
 * Chat sits on its own cluster (MONGO_DB_CHAT). If that cluster is unreachable
 * the room cannot be read or written, and the old behaviour — silently using the
 * main database — hid this. Surface it as a 503 instead of an opaque 500.
 */
export const CHAT_UNAVAILABLE = (): NextResponse =>
  NextResponse.json(
    {
      error: "Chat is temporarily unavailable",
      detail: "The chat database could not be reached. Please try again shortly.",
    },
    { status: 503 }
  );

interface RoomAccess {
  userId: string;
  role: RoomRole;
  roomId: string;
}

/**
 * A chat room is keyed by jobId (see links in jobongoing.tsx / ProposalCard.tsx),
 * so the only people allowed in are the job's client and its assigned freelancer.
 *
 * Returns the access grant, or an already-built error Response to return directly.
 */
/**
 * Discriminated on `error`, so callers get `access` back as non-null once they
 * have returned early on the error branch.
 */
export type RoomAccessResult =
  | { access: RoomAccess; error: null; status: 200 }
  | {
      access: null;
      error: NextResponse;
      status: 401 | 403 | 404 | 503;
    };

export async function requireRoomAccess(roomId: string): Promise<RoomAccessResult> {
  let userId: string | null;
  try {
    userId = await getUserId();
  } catch {
    return { access: null, error: CHAT_UNAVAILABLE(), status: 503 };
  }

  if (!userId) {
    return {
      access: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      status: 401,
    };
  }

  await connectDB();

  // Was `Job.findOne({ jobId })` — `jobId` is not in scope here, so mongoose
  // dropped the undefined filter and matched an arbitrary job. Every
  // authorization decision below was therefore made against the wrong record.
  const job = await Job.findOne({ jobId: roomId }).select("clientId freelancerId").lean();

  if (!job) {
    return {
      access: null,
      error: NextResponse.json({ error: "Room not found" }, { status: 404 }),
      status: 404,
    };
  }

  // Compare on userId, not _id: the schema stores string userIds.
  if (job.clientId === userId) {
    return { access: { userId, role: "client", roomId }, error: null, status: 200 };
  }

  if (job.freelancerId && job.freelancerId === userId) {
    return { access: { userId, role: "freelancer", roomId }, error: null, status: 200 };
  }

  return {
    access: null,
    error: NextResponse.json({ error: "Forbidden: not a participant" }, { status: 403 }),
    status: 403,
  };
}
