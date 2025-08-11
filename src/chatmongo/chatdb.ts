import mongoose from "mongoose";

const connectionString = `${process.env.MONGO_DB_CHAT}`;

if (!connectionString || connectionString === "undefined") {
  throw new Error("Please provide a valid MONGO_DB_CHAT connection string in your environment variables");
}

declare global {
  var mongoose: {
    conn: typeof import('mongoose') | null;
    promise: Promise<typeof import('mongoose')> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log("----Using existing Chat MongoDB connection----");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("----Connecting to Chat MongoDB----");
    
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000, 
      family: 4 
    };

    cached.promise = mongoose.connect(connectionString, opts).then((mongoose) => {
      console.log("----Connected to Chat MongoDB----");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.log("Error connecting to Chat MongoDB", error);
 
    if (error instanceof Error) {
      if (error.message.includes("IP") || error.message.includes("whitelist")) {
        console.log("💡 Tip: Make sure your IP address is whitelisted in MongoDB Atlas");
      }
      if (error.message.includes("authentication")) {
        console.log("💡 Tip: Check your MongoDB username and password");
      }
    }
    
    throw error;
  }

  return cached.conn;
};

export default connectDB;