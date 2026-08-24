import mongoose from "mongoose";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import connectDB from "@/mongo/db";

async function createAuth() {
  await connectDB();
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("MongoDB connection is not available");
  }
  return betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
      enabled: true,
    },
  });
}

export type AuthInstance = Awaited<ReturnType<typeof createAuth>>;

let authPromise: Promise<AuthInstance> | null = null;

export async function getAuth(): Promise<AuthInstance> {
  if (!authPromise) {
    authPromise = createAuth();
  }
  return authPromise;
}
