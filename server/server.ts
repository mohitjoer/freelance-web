import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
    credentials: true
  },
});

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`📥 Socket ${socket.id} joined room ${roomId}`);
    
    // Confirm to the client that they joined
    socket.emit("roomJoined", { roomId, socketId: socket.id });
    
    // Notify others in the room
    socket.to(roomId).emit("userJoined", { socketId: socket.id });
  });

  socket.on("chatMessage", ({ roomId, message, senderId, role }) => {
    console.log(`💬 Message in room ${roomId}:`, message);
    
    // Broadcast to all clients in the room (including sender)
    io.to(roomId).emit("chatMessage", { 
      message, 
      senderId, 
      role,
      timestamp: new Date().toISOString(),
      socketId: socket.id 
    });
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`📤 Socket ${socket.id} left room ${roomId}`);
    socket.to(roomId).emit("userLeft", { socketId: socket.id });
  });

  socket.on("error", (error) => {
    console.error("❌ Socket error:", error);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Client disconnected:", socket.id, "Reason:", reason);
  });
});

// Error handling for the server
httpServer.on("error", (error) => {
  console.error("❌ HTTP Server error:", error);
});

io.on("error", (error) => {
  console.error("❌ Socket.IO error:", error);
});

const PORT = process.env.SOCKET_PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on http://localhost:${PORT}`);
  console.log(`📡 CORS enabled for: http://localhost:3000`);
});