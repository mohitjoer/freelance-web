import { createServer } from "http";
import { Server } from "socket.io";
import { verifyRoomToken } from "../src/lib/room-token";

/**
 * Authenticated chat gateway.
 *
 * Previously this accepted any connection, let anyone join any roomId, and
 * rebroadcast whatever senderId/role the client claimed. Identity now comes from
 * a signed room token issued by the Next app (GET /api/room/[roomId]/socket-token),
 * which is where job-membership is actually enforced.
 *
 * Deliberately has no mongoose import: the authorisation decision is made in the
 * app, and Bun cannot load the mongodb driver.
 */

const AUTH_ORIGINS = (process.env.SOCKET_ALLOWED_ORIGINS ?? "http://localhost:3000,http://127.0.0.1:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: { origin: AUTH_ORIGINS, methods: ["GET", "POST"], credentials: true },
});

/** socket -> the single room it is allowed to occupy, with its verified role. */
const claims = new WeakMap<object, { userId: string; role: "client" | "freelancer"; roomId: string }>();

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  const verified = verifyRoomToken(token);
  if (!verified) return next(new Error("unauthorized"));
  socket.data.claims = verified;
  next();
});

io.on("connection", (socket) => {
  const me = socket.data.claims as { userId: string; role: "client" | "freelancer"; roomId: string };
  claims.set(socket, me);

  console.log("✅ Client connected:", socket.id, me.userId, "as", me.role);

  socket.on("joinRoom", (roomId: unknown) => {
    // The token is bound to exactly one room.
    if (roomId !== me.roomId) {
      socket.emit("roomError", { roomId, error: "Forbidden" });
      return;
    }
    socket.join(me.roomId);
    socket.emit("roomJoined", { roomId: me.roomId, socketId: socket.id });
    socket.to(me.roomId).emit("userJoined", { socketId: socket.id });
  });

  socket.on("chatMessage", (payload: unknown) => {
    const { roomId, message } = (payload ?? {}) as { roomId?: unknown; message?: unknown };

    if (roomId !== me.roomId) {
      socket.emit("roomError", { roomId, error: "Forbidden" });
      return;
    }
    if (typeof message !== "string" || !message.trim()) return;

    // senderId and role come from the verified token, never from the payload.
    io.to(me.roomId).emit("chatMessage", {
      message: message.trim(),
      senderId: me.userId,
      role: me.role,
      timestamp: new Date().toISOString(),
      socketId: socket.id,
    });
  });

  socket.on("leaveRoom", () => {
    socket.leave(me.roomId);
    socket.to(me.roomId).emit("userLeft", { socketId: socket.id });
  });

  socket.on("error", (error) => console.error("❌ Socket error:", error));
  socket.on("disconnect", (reason) => console.log("❌ Client disconnected:", socket.id, reason));
});

httpServer.on("error", (error) => console.error("❌ HTTP Server error:", error));
io.on("error", (error) => console.error("❌ Socket.IO error:", error));

const PORT = process.env.SOCKET_PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on http://localhost:${PORT}`);
  console.log(`📡 CORS enabled for: ${AUTH_ORIGINS.join(", ")}`);
});
