import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Short-lived HMAC assertion that a user may join one specific room.
 *
 * The Next app already authorises room membership (see requireRoomAccess) and has
 * the database; the Socket.IO process must not need one. So the authorisation
 * decision is made once, here, and expressed as a signed token the socket
 * server can verify with nothing but the shared secret.
 *
 * This keeps `server/server.ts` free of mongoose, which Bun cannot load.
 */

export interface RoomClaims {
  userId: string;
  role: "client" | "freelancer";
  roomId: string;
  exp: number; // epoch seconds
}

const TTL_SECONDS = 2 * 60 * 60;

function secret(): string {
  const s = process.env.BETTER_AUTH_SECRET;
  if (!s) throw new Error("BETTER_AUTH_SECRET is required to sign room tokens");
  return s;
}

const b64 = (buf: Buffer) => buf.toString("base64url");

export function issueRoomToken(claims: Omit<RoomClaims, "exp">): string {
  const body: RoomClaims = { ...claims, exp: Math.floor(Date.now() / 1000) + TTL_SECONDS };
  const payload = b64(Buffer.from(JSON.stringify(body)));
  const sig = b64(createHmac("sha256", secret()).update(payload).digest());
  return `${payload}.${sig}`;
}

/** Returns the claims, or null if the token is malformed, forged or expired. */
export function verifyRoomToken(token: unknown): RoomClaims | null {
  if (typeof token !== "string") return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;

  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = b64(createHmac("sha256", secret()).update(payload).digest());

  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  let claims: RoomClaims;
  try {
    claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (
    typeof claims?.userId !== "string" ||
    typeof claims?.roomId !== "string" ||
    (claims?.role !== "client" && claims?.role !== "freelancer")
  ) {
    return null;
  }
  if (typeof claims.exp !== "number" || claims.exp * 1000 < Date.now()) return null;

  return claims;
}
