import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// ✅ Don't throw error during build - just warn
if (!MONGODB_URI) {
  console.warn(
    "⚠️ MONGODB_URI not found - database features will be unavailable"
  );
}

// Define the cache type
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// ✅ FIX: Use unique global key to avoid namespace collision
declare global {
  var __MONGOOSE_CACHE__: MongooseCache | undefined;
}

// ✅ FIX: Rename to mongooseCache and use unique global key
const mongooseCache: MongooseCache = globalThis.__MONGOOSE_CACHE__ || {
  conn: null,
  promise: null,
};

if (!globalThis.__MONGOOSE_CACHE__) {
  globalThis.__MONGOOSE_CACHE__ = mongooseCache;
}

async function connectDB() {
  // Return null if no URI (during CI build)
  if (!MONGODB_URI) {
    console.warn("⚠️ Skipping database connection - MONGODB_URI not set");
    return null;
  }

  // If already connected, return existing connection
  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  // If not connected, create new connection
  if (!mongooseCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    mongooseCache.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("✅ Connected to MongoDB");
        return mongooseInstance;
      });
  }

  try {
    mongooseCache.conn = await mongooseCache.promise;
  } catch (e) {
    mongooseCache.promise = null;
    throw e;
  }

  return mongooseCache.conn;
}

export { connectDB };
