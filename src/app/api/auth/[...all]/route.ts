import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";

export async function GET(req: Request) {
  const auth = await getAuth();
  return toNextJsHandler(auth).GET(req);
}

export async function POST(req: Request) {
  const auth = await getAuth();
  return toNextJsHandler(auth).POST(req);
}
