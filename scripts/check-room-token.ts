import assert from "node:assert";
import { issueRoomToken, verifyRoomToken } from "../src/lib/room-token";

process.env.BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET ?? "test-secret";

// A valid token round-trips with its claims intact.
const token = issueRoomToken({ userId: "u1", role: "client", roomId: "job-1" });
const claims = verifyRoomToken(token);
assert.equal(claims?.userId, "u1");
assert.equal(claims?.role, "client");
assert.equal(claims?.roomId, "job-1");

// Anything malformed or unsigned is rejected.
assert.equal(verifyRoomToken(undefined), null, "undefined");
assert.equal(verifyRoomToken(""), null, "empty");
assert.equal(verifyRoomToken("nope"), null, "no dot");
assert.equal(verifyRoomToken("a.b"), null, "bad signature");
assert.equal(verifyRoomToken(123 as unknown as string), null, "non-string");

// Flipping one character of the signature invalidates it.
const dot = token.lastIndexOf(".");
const tamperedSig = token.slice(0, dot) + "." + (token[dot + 1] === "A" ? "B" : "A") + token.slice(dot + 2);
assert.equal(verifyRoomToken(tamperedSig), null, "tampered signature");

// Re-signing someone else's payload with a different secret must not verify.
const other = Buffer.from(
  JSON.stringify({ userId: "attacker", role: "client", roomId: "job-1", exp: Math.floor(Date.now() / 1000) + 60 })
).toString("base64url");
assert.equal(verifyRoomToken(`${other}.${"A".repeat(43)}`), null, "forged payload");

// Expired tokens are refused.
const { createHmac } = await import("node:crypto");
const expired = Buffer.from(
  JSON.stringify({ userId: "u1", role: "client", roomId: "job-1", exp: Math.floor(Date.now() / 1000) - 1 })
).toString("base64url");
const sig = createHmac("sha256", process.env.BETTER_AUTH_SECRET).update(expired).digest("base64url");
assert.equal(verifyRoomToken(`${expired}.${sig}`), null, "expired");

console.log("room-token self-check: all assertions passed");
