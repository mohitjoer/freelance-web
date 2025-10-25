import mongoose from "mongoose";

export async function connectDB() {
  const { readyState } = mongoose.connection;

  if (readyState === 1) return; // already connected
  if (readyState === 2) {
    await mongoose.connection.asPromise();
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}
