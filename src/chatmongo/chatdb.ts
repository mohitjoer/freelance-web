import mongoose from "mongoose";

const connectionString = process.env.MONGO_DB_CHAT;

if (!connectionString) {
  throw new Error("Please provide a valid MONGO_DB_CHAT connection string");
}

/**
 * Chat lives on its own cluster, so it needs its OWN connection.
 *
 * Previously this called mongoose.connect() on the default singleton and then
 * returned early whenever readyState >= 1. Because the main database always
 * connects first, chat never connected to MONGO_DB_CHAT at all — every Room
 * document was written to the main database instead.
 */
const conn = mongoose.createConnection(connectionString);

// Without a listener, a failed connection is an unhandled 'error' event and
// takes the process down.
conn.on("error", (error) => {
  console.error("----Chat MongoDB error----", error);
});

export const chatConnection = conn;

const connectDB = async (): Promise<typeof conn> => {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (conn.readyState === 1) return conn;
  if (conn.readyState === 2) return conn.asPromise();
  await conn.asPromise();
  console.log("----Connected to chat MongoDB----");
  return conn;
};

export default connectDB;
