import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";

export async function getUserId(): Promise<string | null> {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user?.id ?? null;
  } catch (err) {
    console.error("getUserId error:", err);
    return null;
  }
}
